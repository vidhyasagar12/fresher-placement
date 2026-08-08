import { useState, useEffect, useCallback } from 'react';
import { interviewCategories as staticCats } from '../../../data/interviewPrep';

const EMPTY_CAT = { id: '', label: '', icon: '📚', color: '#6c3cfc' };
const EMPTY_TOPIC = { title: '', difficulty: 'Easy', time: '2 hrs', description: '' };

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`admin-toast ${type}`}>{msg}</div>;
}

export default function AdminInterviewPrep() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  // Category form
  const [showCatForm, setShowCatForm] = useState(false);
  const [catForm, setCatForm] = useState(EMPTY_CAT);
  const [editCatId, setEditCatId] = useState(null);

  // Topic form
  const [showTopicForm, setShowTopicForm] = useState(false);
  const [topicForm, setTopicForm] = useState(EMPTY_TOPIC);
  const [editTopicId, setEditTopicId] = useState(null);
  const [topicCatId, setTopicCatId] = useState(null);

  const [saving, setSaving] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setCategories(staticCats || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // ── Category CRUD ──
  const openAddCat = () => { setCatForm(EMPTY_CAT); setEditCatId(null); setShowCatForm(true); };
  const openEditCat = (cat) => { setCatForm({ id: cat.id, label: cat.label, icon: cat.icon, color: cat.color }); setEditCatId(cat.id); setShowCatForm(true); };

  const saveCat = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaving(false);
    showToast(editCatId ? 'Category updated!' : 'Category added!');
    setShowCatForm(false);
  };

  const deleteCat = async () => {
    if (!confirm('Delete this category and ALL its topics?')) return;
    showToast('Category deleted');
  };

  // ── Topic CRUD ──
  const openAddTopic = (catId) => { setTopicForm(EMPTY_TOPIC); setEditTopicId(null); setTopicCatId(catId); setShowTopicForm(true); };
  const openEditTopic = (topic) => { setTopicForm({ title: topic.title, difficulty: topic.difficulty, time: topic.time, description: topic.description }); setEditTopicId(topic.id); setTopicCatId(topic.category_id); setShowTopicForm(true); };

  const saveTopic = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaving(false);
    showToast(editTopicId ? 'Topic updated!' : 'Topic added!');
    setShowTopicForm(false);
  };

  const deleteTopic = async () => {
    if (!confirm('Delete this topic?')) return;
    showToast('Topic deleted');
  };

  const CF = (key) => ({ value: catForm[key], onChange: e => setCatForm(f => ({ ...f, [key]: e.target.value })) });
  const TF = (key) => ({ value: topicForm[key], onChange: e => setTopicForm(f => ({ ...f, [key]: e.target.value })) });

  const diffColor = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

  return (
    <div className="admin-section">
      <Toast msg={toast.msg} type={toast.type} />

      <div className="admin-section-header">
        <h2>🎯 Interview Prep</h2>
        <button className="admin-btn-primary" onClick={openAddCat}>➕ Add Category</button>
      </div>

      {loading ? (
        <div className="admin-loading">⏳ Loading...</div>
      ) : categories.length === 0 ? (
        <div className="admin-empty"><span>🎯</span>No categories yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {categories.map(cat => (
            <div key={cat.id} style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
              {/* Category header */}
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }} onClick={() => setExpanded(expanded === cat.id ? null : cat.id)}>
                <span style={{ fontSize: 24 }}>{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <strong style={{ color: cat.color }}>{cat.label}</strong>
                  <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{cat.topics.length} topics</p>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="admin-btn-edit" onClick={e => { e.stopPropagation(); openEditCat(cat); }}>✏️</button>
                  <button className="admin-btn-danger" onClick={e => { e.stopPropagation(); deleteCat(cat.id); }}>🗑</button>
                  <button className="admin-btn-primary" style={{ padding: '6px 12px', fontSize: 13 }} onClick={e => { e.stopPropagation(); openAddTopic(cat.id); setExpanded(cat.id); }}>+ Topic</button>
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 18 }}>{expanded === cat.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Topics list */}
              {expanded === cat.id && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  {cat.topics.length === 0 ? (
                    <p style={{ padding: '16px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No topics yet. Add one above.</p>
                  ) : (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Topic</th>
                          <th>Difficulty</th>
                          <th>Time</th>
                          <th>Description</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cat.topics.map(topic => (
                          <tr key={topic.id}>
                            <td><strong>{topic.title}</strong></td>
                            <td><span style={{ color: diffColor[topic.difficulty], fontWeight: 600 }}>{topic.difficulty}</span></td>
                            <td>{topic.time}</td>
                            <td style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{topic.description}</td>
                            <td>
                              <div className="actions">
                                <button className="admin-btn-edit" onClick={() => openEditTopic(topic)}>✏️</button>
                                <button className="admin-btn-danger" onClick={() => deleteTopic(topic.id)}>🗑</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Category Form Modal */}
      {showCatForm && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowCatForm(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editCatId ? '✏️ Edit Category' : '➕ Add Category'}</h3>
              <button className="admin-modal-close" onClick={() => setShowCatForm(false)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={saveCat}>
              {!editCatId && (
                <div className="admin-form-group">
                  <label>Category ID (unique, no spaces) *</label>
                  <input required placeholder="e.g. dsa" {...CF('id')} />
                </div>
              )}
              <div className="admin-form-group">
                <label>Label *</label>
                <input required placeholder="e.g. DSA & Coding" {...CF('label')} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Icon (emoji)</label>
                  <input placeholder="💻" maxLength={4} {...CF('icon')} />
                </div>
                <div className="admin-form-group">
                  <label>Color</label>
                  <input type="color" {...CF('color')} style={{ height: 44, padding: 4 }} />
                </div>
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowCatForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={saving}>{saving ? 'Saving...' : '💾 Save Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Topic Form Modal */}
      {showTopicForm && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowTopicForm(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editTopicId ? '✏️ Edit Topic' : '➕ Add Topic'}</h3>
              <button className="admin-modal-close" onClick={() => setShowTopicForm(false)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={saveTopic}>
              <div className="admin-form-group">
                <label>Topic Title *</label>
                <input required placeholder="e.g. Arrays & Strings" {...TF('title')} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Difficulty</label>
                  <select {...TF('difficulty')}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Estimated Time</label>
                  <input placeholder="e.g. 3 hrs" {...TF('time')} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Description</label>
                <textarea rows={3} placeholder="Brief description of this topic..." {...TF('description')} />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowTopicForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={saving}>{saving ? 'Saving...' : '💾 Save Topic'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
