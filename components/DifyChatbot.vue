<template>
  <div class="fixed bottom-6 left-6 z-50">
    <!-- Toggle Button -->
    <button
      :class="[
        'w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300',
        isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700',
      ]"
      @click="toggleChat"
    >
      <svg
        v-if="!isOpen"
        class="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
      <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>

    <!-- Chat Window -->
    <Transition
      enter-active-class="transform transition-transform duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transform transition-transform duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed bottom-24 left-6 w-[400px] max-w-[calc(100vw-3rem)] h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200"
      >
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-3 flex items-center justify-between"
        >
          <div class="flex items-center space-x-2">
            <span class="text-2xl">👩‍🏫</span>
            <span class="font-semibold text-sm">Study Counselor (AI)</span>
          </div>
          <button class="text-white hover:text-gray-200" @click="toggleChat">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Dify Iframe -->
        <iframe
          :src="difyUrl"
          class="w-full h-full border-none"
          allow="microphone; clipboard-write"
        ></iframe>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);
const difyUrl = 'https://udify.app/chatbot/q9cswZbNuQjCfNiv';

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};
</script>
