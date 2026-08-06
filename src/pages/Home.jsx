import { Link } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useBlogs } from '../hooks/useBlogs';
import { useSiteStats } from '../hooks/useSiteStats';
import JobCard from '../components/JobCard';
import BlogCard from '../components/BlogCard';
import './Home.css';

const features = [
  { icon: '💼', title: 'Live Job Openings', desc: 'Freshly curated job listings from top companies — updated daily.', link: '/jobs' },
  { icon: '🎯', title: 'Interview Prep', desc: 'DSA, HR, aptitude, and system design guides all in one place.', link: '/interview-prep' },
  { icon: '🤖', title: 'AI Career Tips', desc: 'Get personalized career advice powered by cutting-edge AI.', link: '/ai-tips' },
  { icon: '📝', title: 'Career Blog', desc: 'In-depth articles on landing your first job, resume tips, and more.', link: '/blog' },
];

export default function Home() {
  const { jobs, loading: jobsLoading } = useJobs();
  const { blogs, loading: blogsLoading } = useBlogs();
  const siteStats = useSiteStats();

  const stats = [
    { value: siteStats.jobsCount, label: 'Jobs Listed', icon: '💼' },
    { value: siteStats.companiesCount, label: 'Companies', icon: '🏢' },
    { value: siteStats.topicsCount, label: 'Interview Tips', icon: '🎯' },
    { value: siteStats.followersCount, label: 'Followers', icon: '📱' },
  ];

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg-blobs">
          <div className="blob blob1" />
          <div className="blob blob2" />
          <div className="blob blob3" />
        </div>
        <div className="container hero-content">
          <div className="hero-badge">
            <span>📸</span>
            <a href="https://www.instagram.com/fresherplacement?igsh=em1kanJzam5yZDQ3" target="_blank" rel="noopener noreferrer">
              @fresherplacement
            </a>
            <span>•</span>
            <span>Your placement community</span>
          </div>
          <h1 className="hero-title">
            Land Your <span className="grad-text">Dream Job</span><br />
            as a Fresher in 2025
          </h1>
          <p className="hero-subtitle">
            Curated job openings, expert interview prep, AI career advice, and a community of {siteStats.followersCount} freshers — all in one place.
          </p>
          <div className="hero-ctas">
            <Link to="/jobs" className="btn btn-primary">Browse Jobs 💼</Link>
            <Link to="/ai-tips" className="btn btn-outline">Try AI Tips ✨</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="container stats-grid">
          {stats.map(s => (
            <div key={s.label} className="stat-card card">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-value grad-text">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <p className="badge">Everything You Need</p>
          <h2 className="section-title" style={{ marginTop: 8 }}>One platform for<br /><span className="grad-text">all things placement</span></h2>
          <div className="grid-4" style={{ marginTop: 40 }}>
            {features.map(f => (
              <Link to={f.link} key={f.title} className="feature-card card">
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="feature-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="section" style={{ background: 'var(--surface2)', paddingBlock: 80 }}>
        <div className="container">
          <div className="section-header">
            <div>
              <p className="badge">Fresh Listings</p>
              <h2 className="section-title" style={{ marginTop: 8 }}>Latest <span className="grad-text">Job Openings</span></h2>
            </div>
            <Link to="/jobs" className="btn btn-outline">View All Jobs →</Link>
          </div>
          <div className="grid-2" style={{ marginTop: 32 }}>
            {jobsLoading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading jobs...</p>
            ) : (
              jobs.slice(0, 4).map(job => <JobCard key={job.id} job={job} />)
            )}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="ig-cta-section section">
        <div className="container">
          <div className="ig-cta-card">
            <div className="ig-cta-content">
              <span className="ig-emoji">📸</span>
              <h2>Follow Us on Instagram</h2>
              <p>Get daily job alerts, interview tips, and career hacks delivered to your feed.</p>
              <a
                href="https://www.instagram.com/fresherplacement?igsh=em1kanJzam5yZDQ3"
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
                style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', color: '#fff' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                @fresherplacement
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="badge">Read &amp; Learn</p>
              <h2 className="section-title" style={{ marginTop: 8 }}>Latest <span className="grad-text">Blog Posts</span></h2>
            </div>
            <Link to="/blog" className="btn btn-outline">View All Posts →</Link>
          </div>
          <div className="grid-3" style={{ marginTop: 32 }}>
            {blogsLoading ? (
              <p style={{ color: 'var(--text-muted)' }}>Loading blogs...</p>
            ) : (
              blogs.slice(0, 3).map(blog => <BlogCard key={blog.id} blog={blog} />)
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
