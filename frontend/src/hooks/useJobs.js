import { useState, useEffect } from 'react';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/v1/jobs`);
        if (res.ok) {
          const data = await res.json();
          setJobs(data || []);
        } else {
          setError(`Database API returned status ${res.status}`);
          setJobs([]);
        }
      } catch (err) {
        setError(`Database connection failed: ${err.message}`);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  return { jobs, loading, error };
}
