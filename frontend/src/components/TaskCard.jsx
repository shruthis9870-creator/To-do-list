import React from 'react';
import { Calendar, Tag, Pencil, Trash2 } from 'lucide-react';

export const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';

  // Format Due Date
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);

    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let label = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });

    let statusType = 'normal';

    if (diffDays < 0 && !isCompleted) {
      statusType = 'overdue';
      label = `Overdue (${label})`;
    } else if (diffDays === 0) {
      statusType = 'today';
      label = 'Today';
    } else if (diffDays === 1) {
      label = 'Tomorrow';
    }

    return { label, statusType };
  };

  const dueInfo = formatDueDate(task.due_date);

  const priorityClass = {
    high: 'badge-priority-high',
    medium: 'badge-priority-medium',
    low: 'badge-priority-low'
  }[task.priority?.toLowerCase()] || 'badge-priority-medium';

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-card-left">
        <input
          type="checkbox"
          className="custom-checkbox"
          checked={isCompleted}
          onChange={() => onToggleStatus(task.id, isCompleted ? 'pending' : 'completed')}
          title={isCompleted ? "Mark as pending" : "Mark as completed"}
        />

        <div className="task-card-details">
          <h4 className="task-title">{task.title}</h4>
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-meta-tags">
            {/* Priority Tag */}
            <span className={`badge ${priorityClass}`}>
              {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Medium'}
            </span>

            {/* Category Tag */}
            {task.category && (
              <span className="badge badge-category">
                <Tag size={12} />
                {task.category}
              </span>
            )}

            {/* Due Date Tag */}
            {dueInfo && (
              <span className={`badge badge-due-date ${dueInfo.statusType}`}>
                <Calendar size={12} />
                {dueInfo.label}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-card-actions">
        <button
          onClick={() => onEdit(task)}
          className="btn-icon"
          title="Edit task"
        >
          <Pencil size={17} />
        </button>
        <button
          onClick={() => onDelete(task)}
          className="btn-icon delete"
          title="Delete task"
        >
          <Trash2 size={17} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
