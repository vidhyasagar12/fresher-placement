import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setJobs(data || []);
      }
      setLoading(false);
    }
    fetchJobs();
  }, []);

  return { jobs, loading, error };
}
