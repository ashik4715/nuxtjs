<template>
  <Teleport to="body">
    <Transition
      enter-active-class="duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            @click="emit('cancel')"
          />

          <Transition
            enter-active-class="duration-200 ease-out"
            enter-from-class="scale-95 opacity-0"
            enter-to-class="scale-100 opacity-100"
            leave-active-class="duration-150 ease-in"
            leave-from-class="scale-100 opacity-100"
            leave-to-class="scale-95 opacity-0"
          >
            <div
              v-if="show"
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-3xl max-h-[90vh] flex flex-col"
            >
              <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ mode === 'add' ? 'Add New Professor' : 'Edit Professor' }}
                </h3>
              </div>

              <div class="px-6 py-4 overflow-y-auto flex-1">
                <form class="space-y-4" @submit.prevent="handleSubmit">
                  <!-- Basic Info Section -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Basic Information
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          for="professorTitle"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Title
                        </label>
                        <select
                          id="professorTitle"
                          v-model="form.professorTitle"
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="">Select title</option>
                          <option value="Prof.">Prof.</option>
                          <option value="Dr.">Dr.</option>
                          <option value="Associate Prof.">Associate Prof.</option>
                          <option value="Assistant Prof.">Assistant Prof.</option>
                          <option value="Lecturer">Lecturer</option>
                        </select>
                      </div>

                      <div>
                        <label
                          for="professorFirstName"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          First Name *
                        </label>
                        <input
                          id="professorFirstName"
                          v-model="form.professorFirstName"
                          type="text"
                          required
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          :class="{ 'border-red-500': errors.professorFirstName }"
                        />
                        <p v-if="errors.professorFirstName" class="mt-1 text-sm text-red-500">
                          {{ errors.professorFirstName }}
                        </p>
                      </div>

                      <div>
                        <label
                          for="professorLastName"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Last Name *
                        </label>
                        <input
                          id="professorLastName"
                          v-model="form.professorLastName"
                          type="text"
                          required
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          :class="{ 'border-red-500': errors.professorLastName }"
                        />
                        <p v-if="errors.professorLastName" class="mt-1 text-sm text-red-500">
                          {{ errors.professorLastName }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Contact Info Section -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Contact Information
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          for="email"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Email *
                        </label>
                        <input
                          id="email"
                          v-model="form.email"
                          type="email"
                          required
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          :class="{ 'border-red-500': errors.email }"
                        />
                        <p v-if="errors.email" class="mt-1 text-sm text-red-500">
                          {{ errors.email }}
                        </p>
                      </div>

                      <div>
                        <label
                          for="altEmail"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Alternate Email
                        </label>
                        <input
                          id="altEmail"
                          v-model="form.altEmail"
                          type="email"
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Affiliation Section -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Affiliation
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          for="university"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          University *
                        </label>
                        <input
                          id="university"
                          v-model="form.university"
                          type="text"
                          required
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          :class="{ 'border-red-500': errors.university }"
                        />
                        <p v-if="errors.university" class="mt-1 text-sm text-red-500">
                          {{ errors.university }}
                        </p>
                      </div>

                      <div>
                        <label
                          for="department"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Department
                        </label>
                        <input
                          id="department"
                          v-model="form.department"
                          type="text"
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          for="country"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Country
                        </label>
                        <input
                          id="country"
                          v-model="form.country"
                          type="text"
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Research Section -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Research
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          for="researchArea"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Research Area
                        </label>
                        <input
                          id="researchArea"
                          v-model="form.researchArea"
                          type="text"
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div>
                        <label
                          for="keywords"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Keywords
                        </label>
                        <input
                          id="keywords"
                          v-model="form.keywords"
                          type="text"
                          placeholder="Comma-separated"
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>

                      <div class="sm:col-span-2">
                        <label
                          for="linkedPaperUrl"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Linked Paper URL
                        </label>
                        <input
                          id="linkedPaperUrl"
                          v-model="form.linkedPaperUrl"
                          type="url"
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          placeholder="https://"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Outreach Section -->
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                      Outreach
                    </h4>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          for="status"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Status
                        </label>
                        <select
                          id="status"
                          v-model="form.status"
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="Researching">Researching</option>
                          <option value="Email Drafted">Email Drafted</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Responded">Responded</option>
                          <option value="Meeting Scheduled">Meeting Scheduled</option>
                          <option value="Applied">Applied</option>
                        </select>
                      </div>

                      <div>
                        <label
                          for="priority"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Priority
                        </label>
                        <select
                          id="priority"
                          v-model="form.priority"
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>

                      <div>
                        <label
                          for="programType"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Program Type
                        </label>
                        <input
                          id="programType"
                          v-model="form.programType"
                          type="text"
                          class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Notes Section -->
                  <div>
                    <label
                      for="notes"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      v-model="form.notes"
                      rows="3"
                      class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>

              <div
                class="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex flex-row-reverse gap-3"
              >
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  @click="handleSubmit"
                >
                  {{ mode === 'add' ? 'Add Professor' : 'Save Changes' }}
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md bg-white dark:bg-gray-600 px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500"
                  @click="emit('cancel')"
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { watch, reactive } from 'vue';

interface Professor {
  id?: string;
  professorTitle: string;
  professorFirstName: string;
  professorLastName: string;
  email: string;
  altEmail: string;
  university: string;
  department: string;
  country: string;
  researchArea: string;
  keywords: string;
  linkedPaperUrl: string;
  status: string;
  priority: string;
  programType: string;
  notes: string;
}

interface Props {
  show: boolean;
  professor?: Professor | null;
  mode: 'add' | 'edit';
}

const props = withDefaults(defineProps<Props>(), {
  professor: null,
});

const emit = defineEmits<{
  save: [professor: Partial<Professor>];
  cancel: [];
}>();

const defaultForm = (): Professor => ({
  professorTitle: '',
  professorFirstName: '',
  professorLastName: '',
  email: '',
  altEmail: '',
  university: '',
  department: '',
  country: '',
  researchArea: '',
  keywords: '',
  linkedPaperUrl: '',
  status: 'Not Started',
  priority: 'Medium',
  programType: '',
  notes: '',
});

const form = reactive<Professor>(defaultForm());
const errors = reactive<Record<string, string>>({});

const resetErrors = () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = '';
  });
};

watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      if (props.professor && props.mode === 'edit') {
        Object.assign(form, { ...defaultForm(), ...props.professor });
      } else {
        Object.assign(form, defaultForm());
      }
      resetErrors();
    }
  }
);

const validate = (): boolean => {
  resetErrors();

  if (!form.professorFirstName.trim()) {
    errors.professorFirstName = 'First name is required';
  }
  if (!form.professorLastName.trim()) {
    errors.professorLastName = 'Last name is required';
  }
  if (!form.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Invalid email format';
  }
  if (!form.university.trim()) {
    errors.university = 'University is required';
  }

  return Object.keys(errors).length === 0;
};

const handleSubmit = () => {
  if (validate()) {
    emit('save', { ...form });
  }
};
</script>
