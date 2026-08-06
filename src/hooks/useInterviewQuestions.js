import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function useInterviewQuestions(filters = {}) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      let query = supabase
        .from('interview_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.category) query = query.eq('category', filters.category);
      if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);
      if (filters.company) query = query.ilike('company', `%${filters.company}%`);

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setQuestions(data || []);
      }
      setLoading(false);
    }
    fetchQuestions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.difficulty, filters.company]);

  return { questions, loading, error };
}
