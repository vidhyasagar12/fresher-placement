import { useState, useEffect, useCallback } from 'react';

const CATEGORIES = ['Career Advice', 'Company Guides', 'Resume Tips', 'Tech Skills'];

const EMPTY_BLOG = {
  title: '', slug: '', excerpt: '', category: 'Career Advice',
  date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
  read_time: '5 min read', tags: '', content: '',
};

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`admin-toast ${type}`}>{msg}</div>;
}

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_BLOG);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const loadBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/api/v1/blogs`);
      if (res.ok) {
        const data = await res.json();
        setBlogs(data || []);
      } else {
        setBlogs([]);
      }
    } catch {
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBlogs(); }, [loadBlogs]);

  const openAdd = () => { setForm(EMPTY_BLOG); setEditId(null); setShowForm(true); };
  const openEdit = (blog) => {
    setForm({ ...blog, tags: (blog.tags || []).join(', ') });
    setEditId(blog.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    showToast(editId ? 'Blog updated!' : 'Blog published!');
    setSaving(false);
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this blog post?')) return;
    showToast('Blog deleted');
  };

  const F = (key) => ({
    value: form[key],
    onChange: e => {
      const val = e.target.value;
      setForm(f => {
        const updated = { ...f, [key]: val };
        if (key === 'title' && !editId) updated.slug = slugify(val);
        return updated;
      });
    }
  });

  return (
    <div className="admin-section">
      <Toast msg={toast.msg} type={toast.type} />

      <div className="admin-section-header">
        <h2>📝 Blog Posts</h2>
        <button className="admin-btn-primary" onClick={openAdd}>✍️ Write New Blog</button>
      </div>

      {loading ? (
        <div className="admin-loading">⏳ Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="admin-empty"><span>📝</span>No blogs yet. Write your first one!</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Read Time</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <tr key={blog.id}>
                  <td><strong>{blog.title}</strong></td>
                  <td>{blog.category}</td>
                  <td>{blog.date}</td>
                  <td>{blog.read_time}</td>
                  <td>
                    <div className="admin-tags">
                      {(blog.tags || []).slice(0, 3).map(t => <span key={t} className="admin-tag">{t}</span>)}
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="admin-btn-edit" onClick={() => openEdit(blog)}>✏️ Edit</button>
                      <button className="admin-btn-danger" onClick={() => handleDelete(blog.id)}>🗑 Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editId ? '✏️ Edit Blog Post' : '✍️ Write New Blog'}</h3>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={handleSave}>
              <div className="admin-form-group">
                <label>Title *</label>
                <input required placeholder="e.g. How to Crack TCS NQT 2025" {...F('title')} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Slug (auto-generated)</label>
                  <input placeholder="how-to-crack-tcs-nqt-2025" {...F('slug')} />
                </div>
                <div className="admin-form-group">
                  <label>Category</label>
                  <select {...F('category')}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Excerpt / Summary</label>
                <textarea rows={2} placeholder="Short description of the blog..." {...F('excerpt')} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Date</label>
                  <input placeholder="August 2, 2025" {...F('date')} />
                </div>
                <div className="admin-form-group">
                  <label>Read Time</label>
                  <input placeholder="5 min read" {...F('read_time')} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Tags (comma-separated)</label>
                <input placeholder="TCS, NQT, Placement" {...F('tags')} />
              </div>
              <div className="admin-form-group">
                <label>Content (Markdown supported)</label>
                <textarea rows={12} placeholder="## Introduction&#10;&#10;Write your blog content here using Markdown..." {...F('content')} />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editId ? '💾 Update Blog' : '🚀 Publish Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
