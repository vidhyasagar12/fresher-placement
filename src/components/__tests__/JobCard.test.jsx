import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import JobCard from '../JobCard';

describe('JobCard Component', () => {
  const sampleJobFromDb = {
    id: '123',
    company: 'Google',
    role: 'Associate Software Engineer',
    location: 'Bangalore, India',
    type: 'Hybrid',
    experience: 'Fresher (0–1 yr)',
    salary: '₹18–24 LPA',
    description: 'Build high-scale infrastructure and developer tooling.',
    tags: ['React', 'Python', 'Cloud'],
    requirements: ['B.E/B.Tech in Computer Science', 'Strong knowledge of Data Structures'],
    created_at: new Date().toISOString(),
    apply_link: 'careers.google.com/jobs', // missing http/https, should be formatted to https://
  };

  it('renders job title, company, work type, location, experience, and salary correctly', () => {
    render(<JobCard job={sampleJobFromDb} />);

    expect(screen.getByText('Associate Software Engineer')).toBeTruthy();
    expect(screen.getByText('Google')).toBeTruthy();
    expect(screen.getByText('Hybrid')).toBeTruthy();
    expect(screen.getByText('📍 Bangalore, India')).toBeTruthy();
    expect(screen.getByText('🎓 Fresher (0–1 yr)')).toBeTruthy();
    expect(screen.getByText('💰 ₹18–24 LPA')).toBeTruthy();
  });

  it('displays dynamic relative posted time "Just now" for fresh jobs', () => {
    render(<JobCard job={sampleJobFromDb} />);
    expect(screen.getByText('🕐 Just now')).toBeTruthy();
  });

  it('formats external apply_link from Admin DB to include https://', () => {
    render(<JobCard job={sampleJobFromDb} />);
    const applyButton = screen.getByText('Apply Now →');
    expect(applyButton.getAttribute('href')).toBe('https://careers.google.com/jobs');
    expect(applyButton.getAttribute('target')).toBe('_blank');
  });

  it('handles camelCase job.applyLink from static dataset properly', () => {
    const staticJob = {
      ...sampleJobFromDb,
      apply_link: undefined,
      applyLink: 'https://careers.microsoft.com',
    };
    render(<JobCard job={staticJob} />);
    const applyButton = screen.getByText('Apply Now →');
    expect(applyButton.getAttribute('href')).toBe('https://careers.microsoft.com');
  });

  it('expands and collapses requirements list when clicking View Requirements toggle button', () => {
    render(<JobCard job={sampleJobFromDb} />);

    // Initially requirements should not be visible
    expect(screen.queryByText('B.E/B.Tech in Computer Science')).toBeNull();

    const toggleButton = screen.getByText('▼ View Requirements');
    fireEvent.click(toggleButton);

    // Requirements should now be visible
    expect(screen.getByText('B.E/B.Tech in Computer Science')).toBeTruthy();
    expect(screen.getByText('Strong knowledge of Data Structures')).toBeTruthy();
    expect(screen.getByText('▲ Hide Requirements')).toBeTruthy();

    // Click again to collapse
    fireEvent.click(screen.getByText('▲ Hide Requirements'));
    expect(screen.queryByText('B.E/B.Tech in Computer Science')).toBeNull();
  });

  it('shows warning alert and prevents navigation if apply link is missing', () => {
    const windowAlertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const jobNoLink = { ...sampleJobFromDb, apply_link: '', applyLink: '' };

    render(<JobCard job={jobNoLink} />);
    const applyBtn = screen.getByText('Apply Now →');

    fireEvent.click(applyBtn);

    expect(windowAlertSpy).toHaveBeenCalledWith('Application link is not available for this job listing.');
    windowAlertSpy.mockRestore();
  });
});
