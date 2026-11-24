import React from 'react';
import { 
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Hourglass, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ activeFilter, setActiveFilter, stats }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { id: 'all', label: 'All Tasks', icon: ListTodo, count: stats?.total || 0 },
    { id: 'today', label: "Today's Tasks", icon: Calendar },
    { id: 'upcoming', label: 'Upcoming Tasks', icon: Clock },
    { id: 'pending', label: 'Pending Tasks', icon: Hourglass, count: stats?.pending || 0 },
    { id: 'completed', label: 'Completed Tasks', icon: CheckCircle2, count: stats?.completed || 0 },
  ];

  const userInitial = user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U';

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-heading">Navigation</div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.id;
            return (
              <button
                key={item.id}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveFilter(item.id)}
              >
                <div className="sidebar-item-left">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="sidebar-badge">{item.count}</span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile-widget">
          <div className="user-avatar">{userInitial}</div>
          <div className="user-info">
            <span className="user-name">{user?.full_name || 'TaskFlow User'}</span>
            <span className="user-email">{user?.email || ''}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="btn btn-outline" style={{ width: '100%', justifyContent: 'flex-start' }}>
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
