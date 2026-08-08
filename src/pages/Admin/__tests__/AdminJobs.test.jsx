import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminJobs from '../sections/AdminJobs';
import * as cleanDuplicatesModule from '../../../utils/cleanDuplicates';

// Mock Supabase
vi.mock('../../../supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        order: () => Promise.resolve({
          data: [
            {
              id: 'job-1',
              company: 'Amazon',
              role: 'SDE 1',
              location: 'Hyderabad',
              type: 'Onsite',
              salary: '₹28 LPA',
              created_at: new Date().toISOString(),
              apply_link: 'https://amazon.jobs',
            },
          ],
          error: null,
        }),
      }),
      delete: () => ({
        eq: () => Promise.resolve({ error: null }),
        in: () => Promise.resolve({ error: null }),
      }),
      insert: () => ({
        select: () => Promise.resolve({ data: [{ id: 'job-new' }], error: null }),
      }),
      update: () => ({
        eq: () => Promise.resolve({ error: null }),
      }),
    }),
  },
}));

describe('AdminJobs Component & Deduplication UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders AdminJobs section header and Clean Duplicates button', async () => {
    render(<AdminJobs />);

    expect(screen.getByText('💼 Job Listings & Instagram Publisher')).toBeTruthy();
    expect(screen.getByText('🧹 Clean Duplicates')).toBeTruthy();
    expect(screen.getByText('➕ Post New Job')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Amazon')).toBeTruthy();
      expect(screen.getByText('SDE 1')).toBeTruthy();
    });
  });

  it('triggers cleanDuplicateJobs function when Clean Duplicates button is clicked', async () => {
    const cleanSpy = vi.spyOn(cleanDuplicatesModule, 'cleanDuplicateJobs').mockResolvedValue({
      success: true,
      removedCount: 2,
      uniqueCount: 5,
    });
    vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(<AdminJobs />);

    await waitFor(() => expect(screen.getByText('Amazon')).toBeTruthy());

    const cleanBtn = screen.getByText('🧹 Clean Duplicates');
    fireEvent.click(cleanBtn);

    await waitFor(() => {
      expect(cleanSpy).toHaveBeenCalled();
    });
  });
});
