import { useState, useEffect, useCallback } from 'react';

const CATS = ['DSA', 'HR', 'Aptitude', 'System Design', 'General'];
const DIFFS = ['Easy', 'Medium', 'Hard'];

const EMPTY_Q = { question: '', answer: '', category: 'DSA', difficulty: 'Medium', company: '' };

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`admin-toast ${type}`}>{msg}</div>;
}

const diffColor = { Easy: '#10b981', Medium: '#f59e0b', Hard: '#ef4444' };

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_Q);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [filterCat, setFilterCat] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setQuestions([]);
    setLoading(false);
  }, []);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  const filtered = filterCat === 'All' ? questions : questions.filter(q => q.category === filterCat);

  const openAdd = () => { setForm(EMPTY_Q); setEditId(null); setShowForm(true); };
  const openEdit = (q) => { setForm({ question: q.question, answer: q.answer, category: q.category, difficulty: q.difficulty, company: q.company || '' }); setEditId(q.id); setShowForm(true); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaving(false);
    showToast(editId ? 'Question updated!' : 'Question added!');
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this question?')) return;
    showToast('Question deleted');
  };

  const F = (key) => ({ value: form[key], onChange: e => setForm(f => ({ ...f, [key]: e.target.value })) });

  return (
    <div className="admin-section">
      <Toast msg={toast.msg} type={toast.type} />

      <div className="admin-section-header">
        <h2>❓ Interview Q&amp;A</h2>
        <button className="admin-btn-primary" onClick={openAdd}>➕ Add Question</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {['All', ...CATS].map(c => (
          <button
            key={c}
            onClick={() => setFilterCat(c)}
            style={{
              padding: '6px 14px', borderRadius: 20, border: 'none', fontSize: 13, cursor: 'pointer',
              background: filterCat === c ? 'rgba(108,60,252,0.3)' : 'rgba(255,255,255,0.05)',
              color: filterCat === c ? '#a78bfa' : 'rgba(255,255,255,0.5)',
              fontWeight: filterCat === c ? 700 : 400,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="admin-loading">⏳ Loading questions...</div>
      ) : filtered.length === 0 ? (
        <div className="admin-empty"><span>❓</span>No questions yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(q => (
            <div key={q.id} style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
              <div
                style={{ padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === q.id ? null : q.id)}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 20, background: 'rgba(108,60,252,0.2)', color: '#a78bfa', fontSize: 11, fontWeight: 600 }}>{q.category}</span>
                    <span style={{ padding: '2px 8px', borderRadius: 20, background: diffColor[q.difficulty] + '22', color: diffColor[q.difficulty], fontSize: 11, fontWeight: 600 }}>{q.difficulty}</span>
                    {q.company && <span style={{ padding: '2px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>{q.company}</span>}
                  </div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#e2e8f0', fontSize: 14 }}>{q.question}</p>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button className="admin-btn-edit" onClick={e => { e.stopPropagation(); openEdit(q); }}>✏️</button>
                  <button className="admin-btn-danger" onClick={e => { e.stopPropagation(); handleDelete(q.id); }}>🗑</button>
                </div>
              </div>
              {expanded === q.id && (
                <div style={{ padding: '0 18px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <p style={{ margin: '12px 0 0', color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && setShowForm(false)}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editId ? '✏️ Edit Question' : '➕ Add Interview Question'}</h3>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={handleSave}>
              <div className="admin-form-group">
                <label>Question *</label>
                <textarea required rows={3} placeholder="e.g. What is the difference between ArrayList and LinkedList?" {...F('question')} />
              </div>
              <div className="admin-form-group">
                <label>Answer *</label>
                <textarea required rows={6} placeholder="Write a detailed, helpful answer..." {...F('answer')} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Category</label>
                  <select {...F('category')}>
                    {CATS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="admin-form-group">
                  <label>Difficulty</label>
                  <select {...F('difficulty')}>
                    {DIFFS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Company (optional)</label>
                <input placeholder="e.g. Google, Amazon" {...F('company')} />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={saving}>{saving ? 'Saving...' : '💾 Save Question'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
