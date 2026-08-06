import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { autoSeedIfEmpty, smartSeedAll } from '../utils/autoSeed';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      
      // Auto-seed initial data if Supabase jobs table is empty
      await autoSeedIfEmpty('jobs', smartSeedAll);

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
