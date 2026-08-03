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
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-2xl"
            >
              <div class="px-6 py-5">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {{ mode === 'add' ? 'Add New Program' : 'Edit Program' }}
                </h3>

                <form class="space-y-4" @submit.prevent="handleSubmit">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <!-- University -->
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

                    <!-- Program Name -->
                    <div>
                      <label
                        for="programName"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Program Name *
                      </label>
                      <input
                        id="programName"
                        v-model="form.programName"
                        type="text"
                        required
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        :class="{ 'border-red-500': errors.programName }"
                      />
                      <p v-if="errors.programName" class="mt-1 text-sm text-red-500">
                        {{ errors.programName }}
                      </p>
                    </div>

                    <!-- Degree -->
                    <div>
                      <label
                        for="degree"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Degree
                      </label>
                      <select
                        id="degree"
                        v-model="form.degree"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      >
                        <option value="">Select degree</option>
                        <option value="MS">MS</option>
                        <option value="MA">MA</option>
                        <option value="MBA">MBA</option>
                        <option value="PhD">PhD</option>
                        <option value="MEng">MEng</option>
                        <option value="MFA">MFA</option>
                        <option value="MPA">MPA</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <!-- Field of Study -->
                    <div>
                      <label
                        for="fieldOfStudy"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Field of Study
                      </label>
                      <input
                        id="fieldOfStudy"
                        v-model="form.fieldOfStudy"
                        type="text"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <!-- Deadline -->
                    <div>
                      <label
                        for="deadline"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Deadline
                      </label>
                      <input
                        id="deadline"
                        v-model="form.deadline"
                        type="date"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <!-- Status -->
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
                        <option value="In Progress">In Progress</option>
                        <option value="Applied">Applied</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <!-- Tuition -->
                    <div>
                      <label
                        for="tuition"
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Tuition (USD)
                      </label>
                      <input
                        id="tuition"
                        v-model="form.tuition"
                        type="number"
                        min="0"
                        class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>

                    <!-- Funding Available -->
                    <div class="flex items-center">
                      <input
                        id="fundingAvailable"
                        v-model="form.fundingAvailable"
                        type="checkbox"
                        class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label
                        for="fundingAvailable"
                        class="ml-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        Funding Available
                      </label>
                    </div>
                  </div>

                  <!-- URL -->
                  <div>
                    <label
                      for="url"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Program URL
                    </label>
                    <input
                      id="url"
                      v-model="form.url"
                      type="url"
                      class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="https://"
                    />
                  </div>

                  <!-- Requirements -->
                  <div>
                    <label
                      for="requirements"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Requirements
                    </label>
                    <textarea
                      id="requirements"
                      v-model="form.requirements"
                      rows="3"
                      class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <!-- Notes -->
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
                      rows="2"
                      class="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>

              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex flex-row-reverse gap-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                  @click="handleSubmit"
                >
                  {{ mode === 'add' ? 'Add Program' : 'Save Changes' }}
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

interface Program {
  id?: string;
  university: string;
  programName: string;
  degree: string;
  fieldOfStudy: string;
  deadline: string;
  status: string;
  tuition: string;
  fundingAvailable: boolean;
  url: string;
  requirements: string;
  notes: string;
}

interface Props {
  show: boolean;
  program?: Program | null;
  mode: 'add' | 'edit';
}

const props = withDefaults(defineProps<Props>(), {
  program: null,
});

const emit = defineEmits<{
  save: [program: Partial<Program>];
  cancel: [];
}>();

const defaultForm = (): Program => ({
  university: '',
  programName: '',
  degree: '',
  fieldOfStudy: '',
  deadline: '',
  status: 'Not Started',
  tuition: '',
  fundingAvailable: false,
  url: '',
  requirements: '',
  notes: '',
});

const form = reactive<Program>(defaultForm());
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
      if (props.program && props.mode === 'edit') {
        Object.assign(form, { ...defaultForm(), ...props.program });
      } else {
        Object.assign(form, defaultForm());
      }
      resetErrors();
    }
  }
);

const validate = (): boolean => {
  resetErrors();

  if (!form.university.trim()) {
    errors.university = 'University is required';
  }
  if (!form.programName.trim()) {
    errors.programName = 'Program name is required';
  }

  return Object.keys(errors).length === 0;
};

const handleSubmit = () => {
  if (validate()) {
    emit('save', { ...form });
  }
};
</script>
