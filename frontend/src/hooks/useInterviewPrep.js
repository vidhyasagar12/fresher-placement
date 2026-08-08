import { useState } from 'react';
import { interviewCategories as staticCats } from '../data/interviewPrep';

export function useInterviewPrep() {
  const [categories] = useState(staticCats);
  const [loading] = useState(false);
  const [error] = useState(null);

  return { categories, loading, error };
}
