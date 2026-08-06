import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setBlogs(data || []);
      }
      setLoading(false);
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
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setBlog(data);
      }
      setLoading(false);
    }
    fetchBlog();
  }, [slug]);

  return { blog, loading, error };
}
