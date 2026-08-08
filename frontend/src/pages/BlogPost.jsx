import { useParams, Link } from 'react-router-dom';
import { useBlogBySlug, useBlogs } from '../hooks/useBlogs';
import './BlogPost.css';

const categoryColors = {
  'Career Advice': '#6c3cfc',
  'Company Guides': '#e91e8c',
  'Resume Tips': '#10b981',
  'Tech Skills': '#0ea5e9',
};

export default function BlogPost() {
  const { slug } = useParams();
  const { blog, loading, error } = useBlogBySlug(slug);
  const { blogs } = useBlogs();

  if (loading) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: 120 }}>
        <span style={{ fontSize: 48 }}>⏳</span>
        <h2 style={{ marginTop: 16 }}>Loading article...</h2>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: 120 }}>
        <span style={{ fontSize: 64 }}>📭</span>
        <h2 style={{ marginTop: 16 }}>Article not found</h2>
        <Link to="/blog" className="btn btn-primary" style={{ marginTop: 20, display: 'inline-flex' }}>
          ← Back to Blog
        </Link>
      </div>
    );
  }

  const color = categoryColors[blog.category] || '#6c3cfc';
  const related = blogs.filter(b => b.id !== blog.id && b.category === blog.category).slice(0, 3);

  return (
    <div className="page-wrapper">
      {/* Hero */}
      <div className="post-hero" style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}>
        <div className="container post-hero-content">
          <Link to="/blog" className="back-link">← Back to Blog</Link>
          <span className="blog-category" style={{ color, background: color + '20', marginTop: 16 }}>
            {blog.category}
          </span>
          <h1 className="post-title">{blog.title}</h1>
          <div className="post-meta">
            <span>📅 {blog.date}</span>
            <span>⏱ {blog.read_time}</span>
            <div className="post-tags">
              {(blog.tags || []).map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container post-layout">
        <article className="post-content card">
          <div
            className="post-body"
            dangerouslySetInnerHTML={{
              __html: (blog.content || '')
                .replace(/## (.*)/g, '<h2>$1</h2>')
                .replace(/### (.*)/g, '<h3>$1</h3>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/❌ (.*)/g, '<p class="bad-example">❌ $1</p>')
                .replace(/✅ (.*)/g, '<p class="good-example">✅ $1</p>')
                .replace(/\n/g, '<br />')
            }}
          />
        </article>

        {/* Sidebar */}
        <aside className="post-sidebar">
          <div className="card sidebar-card">
            <h4>🤖 Get AI Tips</h4>
            <p>Ask FresherAI about this topic for personalized advice.</p>
            <Link to="/ai-tips" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}>
              Ask FresherAI ✨
            </Link>
          </div>

          <div className="card sidebar-card">
            <h4>📱 Follow us</h4>
            <p>Get daily tips on Instagram.</p>
            <a
              href="https://www.instagram.com/fresherplacement?igsh=em1kanJzam5yZDQ3"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', color: '#fff', width: '100%', justifyContent: 'center', marginTop: 12 }}
            >
              @fresherplacement
            </a>
          </div>

          {related.length > 0 && (
            <div className="card sidebar-card">
              <h4>📚 Related Articles</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {related.map(r => (
                  <Link key={r.id} to={`/blog/${r.slug}`} className="related-link">
                    <span>→</span>
                    <span>{r.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
