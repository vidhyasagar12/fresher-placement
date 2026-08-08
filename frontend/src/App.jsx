import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import InterviewPrep from './pages/InterviewPrep';
import AiTips from './pages/AiTips';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import './index.css';

function PublicLayout({ children, theme, toggleTheme }) {
  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('fp-theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('fp-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with Navbar + Footer */}
        <Route path="/" element={<PublicLayout theme={theme} toggleTheme={toggleTheme}><Home /></PublicLayout>} />
        <Route path="/jobs" element={<PublicLayout theme={theme} toggleTheme={toggleTheme}><Jobs /></PublicLayout>} />
        <Route path="/interview-prep" element={<PublicLayout theme={theme} toggleTheme={toggleTheme}><InterviewPrep /></PublicLayout>} />
        <Route path="/ai-tips" element={<PublicLayout theme={theme} toggleTheme={toggleTheme}><AiTips /></PublicLayout>} />
        <Route path="/blog" element={<PublicLayout theme={theme} toggleTheme={toggleTheme}><Blog /></PublicLayout>} />
        <Route path="/blog/:slug" element={<PublicLayout theme={theme} toggleTheme={toggleTheme}><BlogPost /></PublicLayout>} />

        {/* Admin routes — no Navbar/Footer */}
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
