import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProfessorOutreach } from '~/composables/useProfessorOutreach';

const mockProfessors = [
  {
    id: '1',
    status: 'pending',
    priority: 'high',
    country: 'USA',
    region: 'North America',
    university: 'MIT',
    department: 'CS',
    professorTitle: 'Dr.',
    professorFirstName: 'John',
    professorLastName: 'Doe',
    email: 'john@mit.edu',
    altEmail: '',
    researchArea: 'AI',
    keywords: 'machine learning',
    yourPaperMatch: '',
    personalizedHook: '',
    programType: 'PhD',
    startTerm: 'Fall 2024',
    fundingPath: '',
    eligibilityNotes: '',
    websiteSource: '',
    linkedPaperUrl: '',
    emailVerification: '',
    campaignStatus: '',
    lastContactDate: null,
    followUpDate: null,
    notes: '',
  },
  {
    id: '2',
    status: 'contacted',
    priority: 'medium',
    country: 'USA',
    region: 'North America',
    university: 'Stanford',
    department: 'EE',
    professorTitle: 'Prof.',
    professorFirstName: 'Jane',
    professorLastName: 'Smith',
    email: 'jane@stanford.edu',
    altEmail: '',
    researchArea: 'ML',
    keywords: 'deep learning',
    yourPaperMatch: '',
    personalizedHook: '',
    programType: 'MS',
    startTerm: 'Spring 2024',
    fundingPath: '',
    eligibilityNotes: '',
    websiteSource: '',
    linkedPaperUrl: '',
    emailVerification: '',
    campaignStatus: '',
    lastContactDate: null,
    followUpDate: null,
    notes: '',
  },
];

describe('useProfessorOutreach', () => {
  let outreach: ReturnType<typeof useProfessorOutreach>;

  beforeEach(() => {
    outreach = useProfessorOutreach();
    outreach.professors.value = [...mockProfessors];
  });

  it('should load professors from JSON', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockProfessors),
    });
    global.fetch = mockFetch;

    await outreach.loadProfessors();

    expect(outreach.professors.value).toHaveLength(2);
    expect(outreach.loading.value).toBe(false);
  });

  it('should update professor status', () => {
    outreach.updateStatus('1', 'accepted');

    expect(outreach.professors.value[0].status).toBe('accepted');
  });

  it('should update contact date', () => {
    outreach.updateContactDate('1', '2024-01-15');

    expect(outreach.professors.value[0].lastContactDate).toBe('2024-01-15');
  });

  it('should update follow-up date', () => {
    outreach.updateFollowUpDate('1', '2024-02-01');

    expect(outreach.professors.value[0].followUpDate).toBe('2024-02-01');
  });

  it('should compute stats correctly', () => {
    console.log('Professors:', outreach.professors.value.length);
    const stats = outreach.stats.value;
    console.log('Stats:', stats);
    expect(stats.total).toBe(2);
    expect(stats.byStatus['pending']).toBe(1);
    expect(stats.byStatus['contacted']).toBe(1);
    expect(stats.byCountry['USA']).toBe(2);
  });
});
