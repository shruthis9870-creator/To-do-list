import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="nav-brand">
        <CheckSquare size={24} strokeWidth={2.5} color="var(--primary)" />
        <span>TaskFlow</span>
      </Link>

      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>

        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <LayoutDashboard size={17} />
              <span>Dashboard</span>
            </Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.875rem' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
