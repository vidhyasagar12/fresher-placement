import { useState, useEffect } from 'react';
import { blogs as staticBlogs } from '../data/blogs';

export function useBlogs() {
  const [blogs, setBlogs] = useState(staticBlogs);
  const [loading, setLoading] = useState(false);
  const [error] = useState(null);

  return { blogs, loading, error };
}

export function useBlogBySlug(slug) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const found = staticBlogs.find(b => b.slug === slug);
    if (found) {
      setBlog(found);
      setError(null);
    } else {
      setError('Blog not found');
    }
    setLoading(false);
  }, [slug]);

  return { blog, loading, error };
}
