import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, 
  Inbox, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Trash2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TaskStats from '../components/TaskStats';
import SearchBar from '../components/SearchBar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

export const Dashboard = () => {
  const { user } = useAuth();

  // Tasks & Stats Data
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  // Filters & Search State
  const [activeNavFilter, setActiveNavFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Fetch Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.tasks.getStats();
      if (res.success && res.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Fetch Tasks with filters
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.tasks.getAll({
        filter: activeNavFilter,
        search: searchQuery,
        priority: priorityFilter,
        category: categoryFilter,
        sort: sortBy
      });

      if (res.success && Array.isArray(res.tasks)) {
        setTasks(res.tasks);
      }
    } catch (err) {
      console.error('Failed to load tasks:', err);
      showToast('Error loading tasks. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, [activeNavFilter, searchQuery, priorityFilter, categoryFilter, sortBy]);

  // Initial load and filter change trigger
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  // Dynamic Greeting based on current hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Format Current Date
  const formattedToday = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  // Task Actions
  const handleToggleStatus = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));

    try {
      const res = await api.tasks.updateStatus(taskId, newStatus);
      if (res.success) {
        showToast(newStatus === 'completed' ? 'Task marked as completed! 🎉' : 'Task marked as pending.');
        fetchStats();
      }
    } catch (err) {
      console.error('Status update failed:', err);
      showToast('Failed to update task status.');
      fetchTasks();
    }
  };

  const handleSaveTask = async (taskData) => {
    if (editingTask) {
      const res = await api.tasks.update(editingTask.id, taskData);
      if (res.success) {
        showToast('Task updated successfully.');
        setEditingTask(null);
        fetchTasks();
        fetchStats();
      }
    } else {
      const res = await api.tasks.create(taskData);
      if (res.success) {
        showToast('Task created successfully!');
        fetchTasks();
        fetchStats();
      }
    }
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingTask) return;
    try {
      const res = await api.tasks.delete(deletingTask.id);
      if (res.success) {
        showToast('Task deleted successfully.');
        setDeletingTask(null);
        fetchTasks();
        fetchStats();
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast('Failed to delete task.');
    }
  };

  return (
    <div className="app-container">
      <Navbar />

      <div className="dashboard-layout">
        {/* Sidebar */}
        <Sidebar
          activeFilter={activeNavFilter}
          setActiveFilter={setActiveNavFilter}
          stats={stats}
        />

        {/* Main Content Area */}
        <main className="main-content">
          {/* Header */}
          <div className="dashboard-header">
            <div>
              <h1 className="greeting-title">
                {getGreeting()}, {user?.full_name || 'there'}!
              </h1>
              <p className="current-date">{formattedToday}</p>
            </div>

            <button onClick={handleOpenCreate} className="btn btn-primary">
              <Plus size={18} strokeWidth={2.5} />
              <span>Add New Task</span>
            </button>
          </div>

          {/* Statistics Grid */}
          <TaskStats stats={stats} />

          {/* Search & Filter Bar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Tasks Container */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', animation: 'spin 1s linear infinite' }} />
              <p>Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Inbox size={28} />
              </div>
              <h3 className="empty-state-title">
                {searchQuery || priorityFilter !== 'all' || categoryFilter !== 'all'
                  ? 'No tasks match your criteria'
                  : 'No tasks found'}
              </h3>
              <p className="empty-state-text">
                {searchQuery || priorityFilter !== 'all' || categoryFilter !== 'all'
                  ? 'Try clearing some filters or searching with different keywords.'
                  : 'Your task list is clear! Click the "Add New Task" button to create your first task.'}
              </p>
              <button onClick={handleOpenCreate} className="btn btn-primary">
                <Plus size={18} />
                <span>Create Task</span>
              </button>
            </div>
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={handleOpenEdit}
                  onDelete={setDeletingTask}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Add / Edit Task Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      {deletingTask && (
        <div className="modal-backdrop" onClick={() => setDeletingTask(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}>
                <AlertCircle size={20} />
                <span>Delete Task</span>
              </h3>
              <button onClick={() => setDeletingTask(null)} className="btn-icon">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>
                Are you sure you want to delete this task?
              </p>
              <div style={{ 
                padding: '0.75rem 1rem', 
                backgroundColor: 'var(--bg-subtle)', 
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                "{deletingTask.title}"
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                This action cannot be undone and will permanently remove this task from your account.
              </p>
            </div>
            <div className="modal-footer">
              <button onClick={() => setDeletingTask(null)} className="btn btn-outline">
                Cancel
              </button>
              <button onClick={handleConfirmDelete} className="btn btn-danger">
                <Trash2 size={16} />
                <span>Delete Task</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <CheckCircle2 size={18} color="#4ade80" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
