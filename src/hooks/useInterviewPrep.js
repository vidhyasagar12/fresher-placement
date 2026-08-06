import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useInterviewPrep() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch categories
      const { data: cats, error: catErr } = await supabase
        .from('interview_categories')
        .select('*');

      if (catErr) {
        setError(catErr.message);
        setLoading(false);
        return;
      }

      // Fetch all topics
      const { data: topics, error: topicErr } = await supabase
        .from('interview_topics')
        .select('*');

      if (topicErr) {
        setError(topicErr.message);
        setLoading(false);
        return;
      }

      // Join topics into their categories
      const merged = (cats || []).map(cat => ({
        ...cat,
        topics: (topics || []).filter(t => t.category_id === cat.id),
      }));

      setCategories(merged);
      setLoading(false);
    }
    fetchData();
  }, []);

  return { categories, loading, error };
}
