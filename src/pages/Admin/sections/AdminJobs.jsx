import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../../supabase';

const EMPTY_JOB = {
  company: '', logo: '', logo_color: '#6c3cfc', role: '', location: '',
  type: 'Onsite', experience: 'Fresher', salary: '', tags: '',
  posted: 'Just now', apply_link: '', description: '', requirements: '',
};

function Toast({ msg, type }) {
  if (!msg) return null;
  return <div className={`admin-toast ${type}`}>{msg}</div>;
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_JOB);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 3000);
  };

  const loadJobs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadJobs(); }, [loadJobs]);

  const openAdd = () => { setForm(EMPTY_JOB); setEditId(null); setShowForm(true); };
  const openEdit = (job) => {
    setForm({
      ...job,
      tags: (job.tags || []).join(', '),
      requirements: (job.requirements || []).join('\n'),
    });
    setEditId(job.id);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      requirements: form.requirements.split('\n').map(r => r.trim()).filter(Boolean),
    };
    delete payload.id;
    delete payload.created_at;

    let error;
    if (editId) {
      ({ error } = await supabase.from('jobs').update(payload).eq('id', editId));
    } else {
      ({ error } = await supabase.from('jobs').insert([payload]));
    }

    setSaving(false);
    if (error) {
      showToast('Error: ' + error.message, 'error');
    } else {
      showToast(editId ? 'Job updated!' : 'Job posted!');
      setShowForm(false);
      loadJobs();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job?')) return;
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) showToast('Delete failed: ' + error.message, 'error');
    else { showToast('Job deleted'); loadJobs(); }
  };

  const F = (key) => ({ value: form[key], onChange: e => setForm(f => ({ ...f, [key]: e.target.value })) });

  return (
    <div className="admin-section">
      <Toast msg={toast.msg} type={toast.type} />

      <div className="admin-section-header">
        <h2>💼 Job Listings</h2>
        <button className="admin-btn-primary" onClick={openAdd}>➕ Post New Job</button>
      </div>

      {loading ? (
        <div className="admin-loading">⏳ Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="admin-empty"><span>💼</span>No jobs yet. Post your first one!</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Role</th>
                <th>Location</th>
                <th>Type</th>
                <th>Salary</th>
                <th>Tags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td><strong>{job.company}</strong></td>
                  <td>{job.role}</td>
                  <td>{job.location}</td>
                  <td>{job.type}</td>
                  <td>{job.salary}</td>
                  <td>
                    <div className="admin-tags">
                      {(job.tags || []).slice(0, 3).map(t => <span key={t} className="admin-tag">{t}</span>)}
                    </div>
                  </td>
                  <td>
                    <div className="actions">
                      <button className="admin-btn-edit" onClick={() => openEdit(job)}>✏️ Edit</button>
                      <button className="admin-btn-danger" onClick={() => handleDelete(job.id)}>🗑 Delete</button>
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
              <h3>{editId ? '✏️ Edit Job' : '➕ Post New Job'}</h3>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form className="admin-form" onSubmit={handleSave}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Company Name *</label>
                  <input required placeholder="e.g. Google" {...F('company')} />
                </div>
                <div className="admin-form-group">
                  <label>Logo Letter</label>
                  <input placeholder="e.g. G" maxLength={3} {...F('logo')} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Logo Color</label>
                  <input type="color" {...F('logo_color')} style={{ height: 44, padding: 4 }} />
                </div>
                <div className="admin-form-group">
                  <label>Work Type</label>
                  <select {...F('type')}>
                    <option>Onsite</option>
                    <option>Remote</option>
                    <option>Hybrid</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Job Role / Title *</label>
                <input required placeholder="e.g. Associate Software Engineer" {...F('role')} />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Location</label>
                  <input placeholder="e.g. Bangalore, India" {...F('location')} />
                </div>
                <div className="admin-form-group">
                  <label>Experience</label>
                  <input placeholder="e.g. Fresher (0–1 yr)" {...F('experience')} />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Salary</label>
                  <input placeholder="e.g. ₹12–18 LPA" {...F('salary')} />
                </div>
                <div className="admin-form-group">
                  <label>Posted</label>
                  <input placeholder="e.g. 2 days ago" {...F('posted')} />
                </div>
              </div>
              <div className="admin-form-group">
                <label>Tags (comma-separated)</label>
                <input placeholder="Java, Python, React" {...F('tags')} />
              </div>
              <div className="admin-form-group">
                <label>Apply Link</label>
                <input type="url" placeholder="https://careers.company.com" {...F('apply_link')} />
              </div>
              <div className="admin-form-group">
                <label>Job Description</label>
                <textarea rows={4} placeholder="Describe the role..." {...F('description')} />
              </div>
              <div className="admin-form-group">
                <label>Requirements (one per line)</label>
                <textarea rows={5} placeholder="B.E/B.Tech in CS&#10;Strong in DSA&#10;..." {...F('requirements')} />
              </div>
              <div className="admin-form-actions">
                <button type="button" className="admin-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editId ? '💾 Update Job' : '🚀 Post Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
