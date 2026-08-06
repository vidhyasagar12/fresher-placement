import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError('Incorrect email or password. Access denied.');
      setPassword('');
    } else {
      navigate('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg">
        <div className="admin-blob a1" />
        <div className="admin-blob a2" />
        <div className="admin-blob a3" />
      </div>

      <div className="admin-login-card">
        <div className="admin-login-logo">
          <span>🛡️</span>
        </div>
        <h1 className="admin-login-title">Admin Access</h1>
        <p className="admin-login-sub">FresherPlacement Control Panel</p>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="admin-email">Email</label>
            <div className="admin-input-wrap">
              <span className="admin-input-icon">📧</span>
              <input
                id="admin-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="admin-field">
            <label htmlFor="admin-pass">Password</label>
            <div className="admin-input-wrap">
              <span className="admin-input-icon">🔒</span>
              <input
                id="admin-pass"
                type="password"
                placeholder="Your admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="admin-error">
              <span>⛔</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-btn"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <span className="admin-spinner" />
            ) : (
              <>🔓 Access Dashboard</>
            )}
          </button>
        </form>

        <p className="admin-login-note">
          🔒 This panel is private. Only you have access.
        </p>
      </div>
    </div>
  );
}
