import React from 'react';
import { ListTodo, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const TaskStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Tasks',
      value: stats?.total ?? 0,
      icon: ListTodo,
      colorClass: 'icon-blue'
    },
    {
      label: 'Completed Tasks',
      value: stats?.completed ?? 0,
      icon: CheckCircle2,
      colorClass: 'icon-green'
    },
    {
      label: 'Pending Tasks',
      value: stats?.pending ?? 0,
      icon: Clock,
      colorClass: 'icon-amber'
    },
    {
      label: 'Overdue Tasks',
      value: stats?.overdue ?? 0,
      icon: AlertCircle,
      colorClass: 'icon-red'
    }
  ];

  return (
    <div className="stats-grid">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="stat-card">
            <div className="stat-card-info">
              <span className="stat-card-label">{item.label}</span>
              <span className="stat-card-value">{item.value}</span>
            </div>
            <div className={`stat-card-icon ${item.colorClass}`}>
              <Icon size={22} strokeWidth={2.2} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskStats;
