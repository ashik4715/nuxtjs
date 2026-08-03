<template>
  <div class="space-y-6">
    <!-- Controls -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <!-- Professor Selector -->
      <div>
        <label for="professor" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Professor
        </label>
        <select
          id="professor"
          v-model="selectedProfessorId"
          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Choose a professor</option>
          <option v-for="prof in professors" :key="prof.id" :value="prof.id">
            {{ prof.professorTitle }} {{ prof.professorLastName }} -
            {{ prof.university }}
          </option>
        </select>
      </div>

      <!-- Document Type Selector -->
      <div>
        <label for="docType" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Document Type
        </label>
        <select
          id="docType"
          v-model="selectedDocType"
          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="">Choose document type</option>
          <option value="Motivation Letter">Motivation Letter</option>
          <option value="Statement of Purpose">Statement of Purpose</option>
          <option value="Cold Email">Cold Email</option>
          <option value="Follow-up Email">Follow-up Email</option>
        </select>
      </div>

      <!-- Generate Button -->
      <div class="flex items-end">
        <button
          :disabled="!canGenerate || generating"
          class="w-full inline-flex justify-center items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="handleGenerate"
        >
          <ArrowPathIcon v-if="generating" class="h-4 w-4 animate-spin" />
          <DocumentTextIcon v-else class="h-4 w-4" />
          {{ generating ? 'Generating...' : 'Generate Document' }}
        </button>
      </div>
    </div>

    <!-- Document Preview -->
    <div
      v-if="generatedDocument"
      class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
    >
      <div
        class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-medium text-gray-900 dark:text-white">Generated Document</h3>
          <div class="flex items-center gap-2">
            <button
              class="inline-flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              @click="copyToClipboard"
            >
              <ClipboardIcon class="h-4 w-4" />
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
            <button
              class="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              @click="handleDownload"
            >
              <ArrowDownTrayIcon class="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      <div class="p-4 bg-white dark:bg-gray-900">
        <!-- Subject Line (for emails) -->
        <div
          v-if="generatedDocument.subject"
          class="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700"
        >
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
            Subject:
          </span>
          <p class="mt-1 text-sm text-gray-900 dark:text-white">
            {{ generatedDocument.subject }}
          </p>
        </div>

        <!-- Document Body -->
        <div class="prose prose-sm dark:prose-invert max-w-none">
          <pre class="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">{{
            generatedDocument.body
          }}</pre>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!generating"
      class="text-center py-12 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg"
    >
      <DocumentTextIcon class="mx-auto h-12 w-12 text-gray-400" />
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Select a professor and document type, then click Generate
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
  ArrowPathIcon,
  DocumentTextIcon,
  ClipboardIcon,
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/outline';

interface Professor {
  id: string;
  professorTitle: string;
  professorLastName: string;
  university: string;
  researchArea: string;
  personalizedHook: string;
  programType: string;
  startTerm: string;
}

interface GeneratedDocument {
  subject?: string;
  body: string;
}

interface Props {
  professors: Professor[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  generate: [type: string, professorId: string];
  download: [content: string];
}>();

const selectedProfessorId = ref('');
const selectedDocType = ref('');
const generating = ref(false);
const generatedDocument = ref<GeneratedDocument | null>(null);
const copied = ref(false);

const canGenerate = computed(() => {
  return selectedProfessorId.value && selectedDocType.value;
});

const handleGenerate = async () => {
  if (!canGenerate.value) return;

  generating.value = true;
  generatedDocument.value = null;

  try {
    const professor = props.professors.find((p) => p.id === selectedProfessorId.value);
    if (!professor) return;

    // Simulate document generation with a template
    await new Promise((resolve) => setTimeout(resolve, 500));

    const doc = generateDocumentContent(selectedDocType.value, professor);
    generatedDocument.value = doc;

    emit('generate', selectedDocType.value, selectedProfessorId.value);
  } finally {
    generating.value = false;
  }
};

const generateDocumentContent = (type: string, professor: Professor): GeneratedDocument => {
  const profName = `${professor.professorTitle} ${professor.professorLastName}`;

  const templates: Record<string, GeneratedDocument> = {
    'Motivation Letter': {
      body: `Dear ${profName},

I am writing to express my strong interest in pursuing my graduate studies under your supervision at ${professor.university}. Your groundbreaking research in ${professor.researchArea} has been a significant source of inspiration for my academic journey.

${professor.personalizedHook}

I am particularly drawn to your work because it aligns closely with my research interests and career goals. I believe that your mentorship would be invaluable in helping me achieve my academic aspirations.

I have attached my CV and transcripts for your review. I would welcome the opportunity to discuss potential research opportunities in your lab.

Thank you for your time and consideration.

Best regards`,
    },
    'Statement of Purpose': {
      body: `STATEMENT OF PURPOSE

${profName}
${professor.university}

Research Interest: ${professor.researchArea}

---

My academic journey has been driven by a deep curiosity for ${professor.researchArea}. Throughout my studies, I have developed a strong foundation in both theoretical knowledge and practical skills that prepare me for advanced research.

${professor.personalizedHook}

My goal is to contribute meaningfully to the field while working under the guidance of an accomplished researcher like ${profName}. Your work at ${professor.university} represents the ideal environment for me to grow as a researcher and make impactful contributions.

I am confident that my background, combined with your mentorship, will enable me to achieve significant outcomes in this research direction.`,
    },
    'Cold Email': {
      subject: `Prospective Graduate Student - ${professor.researchArea}`,
      body: `Dear ${profName},

I hope this email finds you well. I am writing to express my interest in potential graduate research opportunities in your lab at ${professor.university}.

${professor.personalizedHook}

I am particularly interested in your work on ${professor.researchArea} and believe my background would make me a strong fit for your research group.

Would you be available for a brief meeting to discuss potential opportunities? I have attached my CV for your reference.

Thank you for your time.

Best regards`,
    },
    'Follow-up Email': {
      subject: `Follow-up: Prospective Graduate Student`,
      body: `Dear ${profName},

I hope you are doing well. I wanted to follow up on my previous email regarding potential graduate research opportunities in your lab.

I remain very interested in the possibility of working with you at ${professor.university} on ${professor.researchArea} research.

Please let me know if there is any additional information I can provide or if you would be available for a brief discussion.

Thank you for your consideration.

Best regards`,
    },
  };

  return (
    templates[type] || {
      body: `Document template for "${type}" not found.`,
    }
  );
};

const copyToClipboard = async () => {
  if (!generatedDocument.value) return;

  const text = generatedDocument.value.subject
    ? `Subject: ${generatedDocument.value.subject}\n\n${generatedDocument.value.body}`
    : generatedDocument.value.body;

  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const handleDownload = () => {
  if (!generatedDocument.value) return;

  const text = generatedDocument.value.subject
    ? `Subject: ${generatedDocument.value.subject}\n\n${generatedDocument.value.body}`
    : generatedDocument.value.body;

  const filename = `${selectedDocType.value.toLowerCase().replace(/\s+/g, '-')}-${selectedProfessorId.value}.txt`;

  emit('download', text);

  if (import.meta.client) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
</script>
