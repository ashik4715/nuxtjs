import { ref } from 'vue';

interface EmailTemplate {
  templateName: string;
  subject: string;
  body: string;
}

interface Professor {
  id: string;
  professorTitle: string;
  professorLastName: string;
  researchArea: string;
  personalizedHook: string;
  programType: string;
  startTerm: string;
}

interface Profile {
  name: string;
  profession: string;
  specializations: string[];
  location: string;
  website: string;
  description: string;
}

export function useDocumentGenerator() {
  const templates = ref<EmailTemplate[]>([]);
  const loading = ref(false);

  const loadTemplates = async () => {
    loading.value = true;
    try {
      const response = await fetch('/email-templates.json');
      if (!response.ok) {
        throw new Error('Failed to load email templates');
      }
      const data = await response.json();
      templates.value = data;
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      loading.value = false;
    }
  };

  const interpolateTemplate = (
    template: string,
    professor: Professor,
    profile: Profile
  ): string => {
    return template
      .replace(/\{\{Professor_Title\}\}/g, professor.professorTitle)
      .replace(/\{\{Professor_LastName\}\}/g, professor.professorLastName)
      .replace(/\{\{Research_Area\}\}/g, professor.researchArea)
      .replace(/\{\{Personalized_Hook\}\}/g, professor.personalizedHook)
      .replace(/\{\{Program_Type\}\}/g, professor.programType)
      .replace(/\{\{Start_Term\}\}/g, professor.startTerm)
      .replace(/\{\{Your_Name\}\}/g, profile.name)
      .replace(/\{\{Your_Profession\}\}/g, profile.profession)
      .replace(/\{\{Your_Specializations\}\}/g, profile.specializations.join(', '))
      .replace(/\{\{Your_Location\}\}/g, profile.location)
      .replace(/\{\{Your_Website\}\}/g, profile.website)
      .replace(/\{\{Your_Description\}\}/g, profile.description);
  };

  const generateDocument = (type: string, professor: Professor, profile: Profile) => {
    const template = templates.value.find((t) => t.templateName === type);
    if (!template) {
      return null;
    }

    const subject = interpolateTemplate(template.subject, professor, profile);
    const body = interpolateTemplate(template.body, professor, profile);

    return {
      subject,
      body,
    };
  };

  const downloadDocument = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    templates,
    loading,
    loadTemplates,
    generateDocument,
    downloadDocument,
  };
}
