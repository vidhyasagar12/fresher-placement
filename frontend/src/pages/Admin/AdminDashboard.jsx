import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminJobs from './sections/AdminJobs';
import AdminBlogs from './sections/AdminBlogs';
import AdminInterviewPrep from './sections/AdminInterviewPrep';
import AdminQuestions from './sections/AdminQuestions';
import AdminSeed from './sections/AdminSeed';
import './AdminDashboard.css';

const NAV = [
  { id: 'overview', icon: '📊', label: 'Overview' },
  { id: 'jobs', icon: '💼', label: 'Jobs' },
  { id: 'blogs', icon: '📝', label: 'Blogs' },
  { id: 'interview', icon: '🎯', label: 'Interview Prep' },
  { id: 'questions', icon: '❓', label: 'Q&A Questions' },
  { id: 'seed', icon: '🌱', label: 'Seed Data' },
];

export default function AdminDashboard() {
  const [active, setActive] = useState('overview');
  const [stats, setStats] = useState({ jobs: 0, blogs: 0, topics: 0, questions: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadStats() {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/jobs`);
        if (res.ok) {
          const jobsData = await res.json();
          setStats(prev => ({ ...prev, jobs: Array.isArray(jobsData) ? jobsData.length : 0 }));
        }
      } catch {
        // Fallback
      }
    }
    loadStats();
  }, [active]);

  const handleLogout = async () => {
    localStorage.removeItem('admin_session');
    navigate('/admin/login');
  };

  const statCards = [
    { icon: '💼', label: 'Total Jobs', value: stats.jobs, color: '#6c3cfc', section: 'jobs' },
    { icon: '📝', label: 'Blog Posts', value: stats.blogs, color: '#e91e8c', section: 'blogs' },
    { icon: '🎯', label: 'Interview Topics', value: stats.topics, color: '#0ea5e9', section: 'interview' },
    { icon: '❓', label: 'Q&A Questions', value: stats.questions, color: '#10b981', section: 'questions' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <span className="admin-brand-icon">🛡️</span>
            {sidebarOpen && <span className="admin-brand-name">Admin Panel</span>}
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(o => !o)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="admin-nav">
          {NAV.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${active === item.id ? 'active' : ''}`}
              onClick={() => setActive(item.id)}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout} title="Logout">
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
          {sidebarOpen && (
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-view-site"
            >
              <span>🌐</span>
              <span>View Site</span>
            </a>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-topbar">
          <h1 className="admin-page-title">
            {NAV.find(n => n.id === active)?.icon} {NAV.find(n => n.id === active)?.label}
          </h1>
          <div className="admin-topbar-right">
            <span className="admin-badge-you">👤 You (Admin)</span>
          </div>
        </header>

        <div className="admin-content">
          {active === 'overview' && (
            <div className="admin-overview">
              <p className="admin-welcome">Welcome back! Here's your site at a glance.</p>
              <div className="admin-stat-grid">
                {statCards.map(s => (
                  <div
                    key={s.label}
                    className="admin-stat-card"
                    style={{ '--accent': s.color }}
                    onClick={() => setActive(s.section)}
                  >
                    <div className="admin-stat-icon">{s.icon}</div>
                    <div className="admin-stat-value">{s.value}</div>
                    <div className="admin-stat-label">{s.label}</div>
                    <div className="admin-stat-arrow">→ Manage</div>
                  </div>
                ))}
              </div>

              <div className="admin-quick-actions">
                <h3>Quick Actions</h3>
                <div className="qa-grid">
                  {[
                    { icon: '➕', label: 'Post a Job', action: () => setActive('jobs') },
                    { icon: '✍️', label: 'Write a Blog', action: () => setActive('blogs') },
                    { icon: '🎯', label: 'Add Interview Topic', action: () => setActive('interview') },
                    { icon: '❓', label: 'Add Q&A', action: () => setActive('questions') },
                    { icon: '🌱', label: 'Seed Initial Data', action: () => setActive('seed') },
                  ].map(qa => (
                    <button key={qa.label} className="qa-btn" onClick={qa.action}>
                      <span>{qa.icon}</span>
                      <span>{qa.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {active === 'jobs' && <AdminJobs />}
          {active === 'blogs' && <AdminBlogs />}
          {active === 'interview' && <AdminInterviewPrep />}
          {active === 'questions' && <AdminQuestions />}
          {active === 'seed' && <AdminSeed onSeedDone={() => setActive('overview')} />}
        </div>
      </main>
    </div>
  );
}
