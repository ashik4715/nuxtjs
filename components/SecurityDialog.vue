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
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all w-full max-w-md"
            >
              <div class="px-6 py-5">
                <div class="flex items-center">
                  <div
                    class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30"
                  >
                    <ExclamationTriangleIcon class="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                      Security Verification
                    </h3>
                  </div>
                </div>

                <div class="mt-4">
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    {{ question }}
                  </p>

                  <input
                    v-model="answer"
                    type="text"
                    placeholder="Your answer"
                    class="mt-4 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-gray-900 dark:text-white shadow-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    @keyup.enter="handleVerify"
                  />
                </div>
              </div>

              <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex flex-row-reverse gap-3">
                <button
                  type="button"
                  :disabled="!answer.trim()"
                  class="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  @click="handleVerify"
                >
                  Verify
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
import { ref, watch } from 'vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

interface Props {
  show: boolean;
  question: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  verify: [answer: string];
  cancel: [];
}>();

const answer = ref('');

watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      answer.value = '';
    }
  }
);

const handleVerify = () => {
  if (answer.value.trim()) {
    emit('verify', answer.value.trim());
  }
};
</script>
