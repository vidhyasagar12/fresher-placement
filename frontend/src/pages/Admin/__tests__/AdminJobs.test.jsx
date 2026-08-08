import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminJobs from '../sections/AdminJobs';
import * as cleanDuplicatesModule from '../../../utils/cleanDuplicates';



describe('AdminJobs Component & Deduplication UI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, company: 'Google', role: 'Associate Software Engineer', location: 'Bangalore', type: 'ONSITE', salary: '12 LPA', experience: 'Fresher', posted: 'Just now' }
      ]
    });
  });

  it('renders AdminJobs section header and Clean Duplicates button', async () => {
    render(<AdminJobs />);

    expect(screen.getByText('💼 Job Listings & Instagram Publisher')).toBeTruthy();
    expect(screen.getByText('🧹 Clean Duplicates')).toBeTruthy();
    expect(screen.getByText('➕ Post New Job')).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByText('Google')).toBeTruthy();
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

    await waitFor(() => expect(screen.getByText('Google')).toBeTruthy());

    const cleanBtn = screen.getByText('🧹 Clean Duplicates');
    fireEvent.click(cleanBtn);

    await waitFor(() => {
      expect(cleanSpy).toHaveBeenCalled();
    });
  });
});
