import { useState } from 'react';
import { useBlogs } from '../hooks/useBlogs';
import BlogCard from '../components/BlogCard';
import './Blog.css';

const allCategories = ['All', 'Career Advice', 'Company Guides', 'Resume Tips', 'Tech Skills'];

export default function Blog() {
  const { blogs, loading, error } = useBlogs();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = blogs.filter(b => {
    const matchCat = activeCategory === 'All' || b.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || b.title?.toLowerCase().includes(q) || (b.tags || []).some(t => t.toLowerCase().includes(q));
    return matchCat && matchSearch;
  });

  return (
    <div className="page-wrapper">
      <div className="blog-hero">
        <div className="container">
          <p className="badge">Career Knowledge Base</p>
          <h1 className="section-title" style={{ marginTop: 8 }}>
            Fresher <span className="grad-text">Career Blog</span>
          </h1>
          <p className="section-subtitle">In-depth guides, company breakdowns, and expert advice for freshers.</p>

          <input
            type="text"
            className="blog-search"
            placeholder="🔍 Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="blog-filters">
        <div className="container blog-filter-inner">
          {allCategories.map(cat => (
            <button
              key={cat}
              className={`filter-chip${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="container section">
        {loading ? (
          <div className="no-results">
            <span style={{ fontSize: 40 }}>⏳</span>
            <h3>Loading articles...</h3>
          </div>
        ) : error ? (
          <div className="no-results">
            <span>⚠️</span>
            <h3>Could not load articles</h3>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <p className="results-count" style={{ marginBottom: 24 }}>
              {filtered.length} article{filtered.length !== 1 ? 's' : ''} found
            </p>
            {filtered.length === 0 ? (
              <div className="no-results">
                <span>📭</span>
                <h3>No articles found</h3>
                <p>Try a different search term or category.</p>
              </div>
            ) : (
              <div className="grid-3">
                {filtered.map(blog => <BlogCard key={blog.id} blog={blog} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
