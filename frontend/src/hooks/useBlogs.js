import { useState, useEffect } from 'react';

export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/blogs`);
        if (res.ok) {
          const data = await res.json();
          setBlogs(data || []);
        } else {
          setError(`Database API returned status ${res.status}`);
          setBlogs([]);
        }
      } catch (err) {
        setError(`Database connection failed: ${err.message}`);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  return { blogs, loading, error };
}

export function useBlogBySlug(slug) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    async function fetchBlog() {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/blogs/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBlog(data);
        } else {
          setError('Article not found in database');
          setBlog(null);
        }
      } catch (err) {
        setError(`Database connection failed: ${err.message}`);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  return { blog, loading, error };
}
