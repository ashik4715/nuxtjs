import { ref } from 'vue';

interface Professor {
  id: string;
  status: string;
  priority: string;
  country: string;
  region: string;
  university: string;
  department: string;
  professorTitle: string;
  professorFirstName: string;
  professorLastName: string;
  email: string;
  altEmail: string;
  researchArea: string;
  keywords: string;
  yourPaperMatch: string;
  personalizedHook: string;
  programType: string;
  startTerm: string;
  fundingPath: string;
  eligibilityNotes: string;
  websiteSource: string;
  linkedPaperUrl: string;
  emailVerification: string;
  campaignStatus: string;
  lastContactDate: string | null;
  followUpDate: string | null;
  notes: string;
}

export function useProfessorOutreach() {
  const professors = ref<Professor[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadProfessors = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch('/professors.json');
      if (!response.ok) {
        throw new Error('Failed to load professors data');
      }
      const data = await response.json();
      professors.value = data;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = (id: string, status: string) => {
    const professor = professors.value.find((p) => p.id === id);
    if (professor) {
      professor.status = status;
    }
  };

  const updateContactDate = (id: string, date: string) => {
    const professor = professors.value.find((p) => p.id === id);
    if (professor) {
      professor.lastContactDate = date;
    }
  };

  const updateFollowUpDate = (id: string, date: string) => {
    const professor = professors.value.find((p) => p.id === id);
    if (professor) {
      professor.followUpDate = date;
    }
  };

  const getStats = () => {
    const total = professors.value.length;
    const byStatus = professors.value.reduce(
      (acc, prof) => {
        acc[prof.status] = (acc[prof.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const byCountry = professors.value.reduce(
      (acc, prof) => {
        acc[prof.country] = (acc[prof.country] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      total,
      byStatus,
      byCountry,
    };
  };

  return {
    professors,
    loading,
    error,
    loadProfessors,
    updateStatus,
    updateContactDate,
    updateFollowUpDate,
    getStats,
  };
}
