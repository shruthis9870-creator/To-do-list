import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckSquare, 
  ArrowRight, 
  ShieldCheck, 
  SlidersHorizontal, 
  CalendarClock, 
  Sparkles,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import Navbar from '../components/Navbar';

export const Home = () => {
  return (
    <div className="app-container">
      <Navbar />

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-pill">
          <Sparkles size={16} />
          <span>Simple, Fast & Organized</span>
        </div>

        <h1 className="hero-title">
          Organize your day,<br />one task at a time.
        </h1>

        <p className="hero-desc">
          TaskFlow is a clean, modern task management application built to help you stay focused, 
          prioritize what matters most, and achieve your daily goals with ease.
        </p>

        <div className="hero-cta">
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
            <span>Get Started Free</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
            <span>Sign In to TaskFlow</span>
          </Link>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="landing-preview">
        <div className="preview-window">
          <div className="preview-bar">
            <span className="preview-dot" style={{ backgroundColor: '#ef4444' }}></span>
            <span className="preview-dot" style={{ backgroundColor: '#f59e0b' }}></span>
            <span className="preview-dot" style={{ backgroundColor: '#10b981' }}></span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginLeft: '0.5rem', fontWeight: 500 }}>
              TaskFlow Dashboard – Preview
            </span>
          </div>

          <div style={{ padding: '2rem 1.5rem', backgroundColor: '#f8fafc' }}>
            {/* Mock Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Good morning, Alex! 👋
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Tuesday, November 24, 2026 • 4 tasks left for today
                </span>
              </div>
              <button className="btn btn-primary" style={{ pointerEvents: 'none' }}>
                + Add New Task
              </button>
            </div>

            {/* Mock Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total Tasks</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.2rem' }}>12</div>
              </div>
              <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Completed</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a', marginTop: '0.2rem' }}>8</div>
              </div>
              <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pending</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ea580c', marginTop: '0.2rem' }}>4</div>
              </div>
              <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Overdue</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#dc2626', marginTop: '0.2rem' }}>0</div>
              </div>
            </div>

            {/* Mock Task Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: '2px solid #cbd5e1', backgroundColor: '#fff' }}></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Finalize product presentation slides</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Review key metrics and deliver to team</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-priority-high">High</span>
                  <span className="badge badge-category">Work</span>
                </div>
              </div>

              <div style={{ background: '#fff', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '6px', backgroundColor: 'var(--primary)', display: 'grid', placeContent: 'center' }}>
                    <CheckCircle2 size={14} color="#fff" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', textDecoration: 'line-through', color: '#94a3b8' }}>Schedule weekly sync call</div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Confirmed with client for 3 PM</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span className="badge badge-priority-medium">Medium</span>
                  <span className="badge badge-category">Personal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="landing-features">
        <div className="feature-box">
          <div className="feature-icon-wrapper">
            <ListTodo size={24} />
          </div>
          <h3 className="feature-title">Intuitive Task Tracking</h3>
          <p className="feature-desc">
            Create, categorize, edit, and check off tasks with zero cognitive overload. Simple checkboxes and clean layouts keep you organized.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrapper">
            <CalendarClock size={24} />
          </div>
          <h3 className="feature-title">Priorities & Deadlines</h3>
          <p className="feature-desc">
            Tag tasks as High, Medium, or Low priority. Set due dates and instantly spot overdue items before they slip through the cracks.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrapper">
            <SlidersHorizontal size={24} />
          </div>
          <h3 className="feature-title">Instant Search & Filters</h3>
          <p className="feature-desc">
            Filter tasks by status, priority, or category. Search by keywords and sort by newest, due date, or priority in real-time.
          </p>
        </div>

        <div className="feature-box">
          <div className="feature-icon-wrapper">
            <ShieldCheck size={24} />
          </div>
          <h3 className="feature-title">Secure & Cloud Powered</h3>
          <p className="feature-desc">
            Your tasks belong strictly to you. Backed by PostgreSQL Row-Level Security and Supabase Authentication, data stays private.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
            <CheckSquare size={20} color="var(--primary)" />
            <span>TaskFlow</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} TaskFlow Inc. Built for maximum personal productivity.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
