import { getDatabaseClient } from '../config/supabase.js';

/**
 * Helper to get local date string YYYY-MM-DD
 */
const getTodayDateString = () => {
  const d = new Date();
  return d.toISOString().split('T')[0];
};

/**
 * Get all tasks for the logged in user with filtering, searching, and sorting
 */
export const getTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, priority, category, search, filter, sort } = req.query;
    const client = getDatabaseClient(req);

    let query = client
      .from('tasks')
      .select('*')
      .eq('user_id', userId);

    const todayStr = getTodayDateString();

    // Sidebar special filters
    if (filter === 'today') {
      query = query.eq('due_date', todayStr);
    } else if (filter === 'upcoming') {
      query = query.gt('due_date', todayStr);
    } else if (filter === 'completed') {
      query = query.eq('status', 'completed');
    } else if (filter === 'pending') {
      query = query.eq('status', 'pending');
    }

    // Status filter
    if (status && status !== 'all') {
      query = query.eq('status', status.toLowerCase());
    }

    // Priority filter
    if (priority && priority !== 'all') {
      query = query.eq('priority', priority.toLowerCase());
    }

    // Category filter
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Search query by title or description
    if (search && search.trim()) {
      const cleanSearch = search.trim();
      query = query.or(`title.ilike.%${cleanSearch}%,description.ilike.%${cleanSearch}%`);
    }

    // Sorting
    switch (sort) {
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      case 'due_date':
        query = query.order('due_date', { ascending: true, nullsFirst: false });
        break;
      case 'priority':
        query = query.order('created_at', { ascending: false });
        break;
      case 'newest':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const { data: tasks, error } = await query;

    if (error) {
      console.error('Error fetching tasks from Supabase:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to retrieve tasks.',
        error: error.message
      });
    }

    let result = tasks || [];

    // Custom priority sort if requested
    if (sort === 'priority') {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      result = [...result].sort((a, b) => {
        const weightA = priorityWeight[a.priority?.toLowerCase()] || 0;
        const weightB = priorityWeight[b.priority?.toLowerCase()] || 0;
        return weightB - weightA;
      });
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      tasks: result
    });
  } catch (err) {
    console.error('getTasks unexpected error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching tasks.'
    });
  }
};

/**
 * Get dashboard task statistics for the logged in user
 */
export const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = getTodayDateString();
    const client = getDatabaseClient(req);

    const { data: tasks, error } = await client
      .from('tasks')
      .select('id, status, due_date')
      .eq('user_id', userId);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to compute task statistics.',
        error: error.message
      });
    }

    const allTasks = tasks || [];
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.status === 'completed').length;
    const pending = allTasks.filter(t => t.status === 'pending').length;
    const overdue = allTasks.filter(t => 
      t.status === 'pending' && t.due_date && t.due_date < todayStr
    ).length;

    return res.status(200).json({
      success: true,
      stats: {
        total,
        completed,
        pending,
        overdue
      }
    });
  } catch (err) {
    console.error('getTaskStats error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while computing statistics.'
    });
  }
};

/**
 * Get a single task by ID for the logged in user
 */
export const getTaskById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const client = getDatabaseClient(req);

    const { data: task, error } = await client
      .from('tasks')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error || !task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied.'
      });
    }

    return res.status(200).json({
      success: true,
      task
    });
  } catch (err) {
    console.error('getTaskById error:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve task.'
    });
  }
};

/**
 * Create a new task
 */
export const createTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, due_date, priority, category } = req.body;
    const client = getDatabaseClient(req);

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.'
      });
    }

    const validPriorities = ['low', 'medium', 'high'];
    const validCategories = ['Personal', 'Work', 'Study', 'Other'];

    const taskPriority = validPriorities.includes(priority?.toLowerCase())
      ? priority.toLowerCase()
      : 'medium';

    const taskCategory = validCategories.includes(category)
      ? category
      : 'Personal';

    let taskDueDate = null;
    if (due_date) {
      const parsedDate = new Date(due_date);
      if (!isNaN(parsedDate.getTime())) {
        taskDueDate = due_date;
      }
    }

    const newTask = {
      user_id: userId,
      title: title.trim(),
      description: description ? description.trim() : '',
      due_date: taskDueDate,
      priority: taskPriority,
      category: taskCategory,
      status: 'pending'
    };

    const { data, error } = await client
      .from('tasks')
      .insert([newTask])
      .select()
      .single();

    if (error) {
      console.error('Error creating task in Supabase:', error);
      return res.status(400).json({
        success: false,
        message: 'Failed to create task.',
        error: error.message
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Task created successfully!',
      task: data
    });
  } catch (err) {
    console.error('createTask error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while creating task.'
    });
  }
};

/**
 * Update an existing task
 */
export const updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, due_date, priority, category, status } = req.body;
    const client = getDatabaseClient(req);

    // Check ownership first
    const { data: existingTask, error: checkError } = await client
      .from('tasks')
      .select('id')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (checkError || !existingTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or you do not have permission to edit it.'
      });
    }

    const updates = {};

    if (title !== undefined) {
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Task title cannot be empty.'
        });
      }
      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description ? description.trim() : '';
    }

    if (due_date !== undefined) {
      if (due_date === '' || due_date === null) {
        updates.due_date = null;
      } else {
        const parsed = new Date(due_date);
        if (!isNaN(parsed.getTime())) {
          updates.due_date = due_date;
        }
      }
    }

    if (priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high'];
      if (validPriorities.includes(priority?.toLowerCase())) {
        updates.priority = priority.toLowerCase();
      }
    }

    if (category !== undefined) {
      const validCategories = ['Personal', 'Work', 'Study', 'Other'];
      if (validCategories.includes(category)) {
        updates.category = category;
      }
    }

    if (status !== undefined) {
      if (['pending', 'completed'].includes(status)) {
        updates.status = status;
      }
    }

    updates.updated_at = new Date().toISOString();

    const { data: updatedTask, error: updateError } = await client
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update task.',
        error: updateError.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully!',
      task: updatedTask
    });
  } catch (err) {
    console.error('updateTask error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating task.'
    });
  }
};

/**
 * Toggle or set task status (pending / completed)
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;
    const client = getDatabaseClient(req);

    if (!status || !['pending', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'pending' or 'completed'."
      });
    }

    const { data: updatedTask, error } = await client
      .from('tasks')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error || !updatedTask) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied.'
      });
    }

    return res.status(200).json({
      success: true,
      message: `Task marked as ${status}.`,
      task: updatedTask
    });
  } catch (err) {
    console.error('updateTaskStatus error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while updating task status.'
    });
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const client = getDatabaseClient(req);

    const { data, error } = await client
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select();

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete task.',
        error: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.'
    });
  } catch (err) {
    console.error('deleteTask error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while deleting task.'
    });
  }
};
