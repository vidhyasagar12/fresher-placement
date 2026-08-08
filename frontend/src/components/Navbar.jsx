import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/interview-prep', label: 'Interview Prep' },
  { to: '/ai-tips', label: 'AI Tips ✨' },
  { to: '/blog', label: 'Blog' },
];

export default function Navbar({ theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🎯</span>
          <span className="logo-text">Fresher<span className="grad-text">Placement</span></span>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="nav-actions">
          <a
            href="https://www.instagram.com/fresherplacement?igsh=em1kanJzam5yZDQ3"
            target="_blank"
            rel="noopener noreferrer"
            className="ig-badge"
            title="Follow on Instagram"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
            <span>Follow us</span>
          </a>

          <button className="theme-btn" onClick={toggleTheme} title="Toggle dark mode">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Hamburger */}
          <button
            className={`hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(p => !p)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `mobile-link${isActive ? ' active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href="https://www.instagram.com/fresherplacement?igsh=em1kanJzam5yZDQ3"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-link ig-mobile"
          >
            📸 Follow @fresherplacement
          </a>
        </div>
      )}
    </nav>
  );
}
