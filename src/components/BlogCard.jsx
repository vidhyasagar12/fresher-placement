import { Link } from 'react-router-dom';
import './BlogCard.css';

const categoryColors = {
  'Career Advice': '#6c3cfc',
  'Company Guides': '#e91e8c',
  'Resume Tips': '#10b981',
  'Tech Skills': '#0ea5e9',
};

export default function BlogCard({ blog }) {
  const color = categoryColors[blog.category] || '#6c3cfc';

  return (
    <Link to={`/blog/${blog.slug}`} className="blog-card card">
      <div className="blog-card-cover" style={{ background: `linear-gradient(135deg, ${color}22, ${color}44)` }}>
        <span className="blog-cover-emoji" style={{ color }}>
          {blog.category === 'Career Advice' ? '🚀' :
           blog.category === 'Company Guides' ? '🏢' :
           blog.category === 'Resume Tips' ? '📄' : '💻'}
        </span>
      </div>
      <div className="blog-card-body">
        <span className="blog-category" style={{ color, background: color + '15' }}>
          {blog.category}
        </span>
        <h3 className="blog-title">{blog.title}</h3>
        <p className="blog-excerpt">{blog.excerpt}</p>
        <div className="blog-meta">
          <span>📅 {blog.date}</span>
          <span>⏱ {blog.readTime}</span>
        </div>
        <div className="blog-tags">
          {blog.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
        </div>
      </div>
    </Link>
  );
}
