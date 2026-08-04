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
        class="fixed bottom-24 left-6 w-[420px] max-w-[calc(100vw-3rem)] h-[600px] bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
      >
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-green-500 to-teal-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0"
        >
          <div class="flex items-center space-x-2">
            <span class="text-2xl">👩‍🏫</span>
            <span class="font-semibold text-sm">Study Counselor (AI)</span>
          </div>
          <div class="flex items-center space-x-2">
            <button
              :class="[
                'p-1.5 rounded-full transition-colors',
                voiceEnabled ? 'bg-white/20' : 'bg-white/10',
              ]"
              :title="voiceEnabled ? 'Voice ON - Click to disable' : 'Voice OFF - Click to enable'"
              @click="toggleVoice"
            >
              <svg
                v-if="voiceEnabled"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                />
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                />
              </svg>
            </button>
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
        </div>

        <!-- Voice Status -->
        <div
          v-if="voiceEnabled"
          class="bg-green-100 text-green-800 text-xs px-4 py-1 flex items-center space-x-1 flex-shrink-0"
        >
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>Voice enabled - responses will be read aloud</span>
        </div>

        <!-- Dify Iframe -->
        <iframe
          ref="difyIframe"
          :src="difyUrl"
          class="flex-1 border-none"
          allow="microphone; clipboard-write"
          @load="onIframeLoad"
        ></iframe>

        <!-- Read Aloud Button -->
        <div class="border-t border-gray-200 px-4 py-2 bg-gray-50 flex-shrink-0">
          <button
            :disabled="!lastMessage"
            class="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            @click="readLastMessage"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
            <span>{{ isSpeaking ? 'Stop Speaking' : 'Read Last Answer Aloud' }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onUnmounted, ref } from 'vue';

const isOpen = ref(false);
const voiceEnabled = ref(true);
const isSpeaking = ref(false);
const lastMessage = ref('');
const difyIframe = ref<HTMLIFrameElement | null>(null);
const difyUrl = 'https://udify.app/chatbot/q9cswZbNuQjCfNiv';

let speechSynthesis: SpeechSynthesis | null = null;
let femaleVoice: SpeechSynthesisVoice | null = null;

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const toggleVoice = () => {
  voiceEnabled.value = !voiceEnabled.value;
  if (!voiceEnabled.value) {
    stopSpeaking();
  }
};

const initVoice = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    speechSynthesis = window.speechSynthesis;

    const loadVoices = () => {
      const voices = speechSynthesis!.getVoices();
      femaleVoice =
        voices.find(
          (v) =>
            v.name.includes('Samantha') ||
            v.name.includes('Victoria') ||
            v.name.includes('Zira') ||
            v.name.includes('Hazel') ||
            v.name.includes('Google UK English Female') ||
            v.lang.startsWith('en')
        ) ||
        voices[0] ||
        null;
    };

    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }
};

const speak = (text: string) => {
  if (!speechSynthesis || !voiceEnabled.value) return;

  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1.0;
  if (femaleVoice) utterance.voice = femaleVoice;

  utterance.onstart = () => {
    isSpeaking.value = true;
  };
  utterance.onend = () => {
    isSpeaking.value = false;
  };

  speechSynthesis.speak(utterance);
};

const stopSpeaking = () => {
  if (speechSynthesis) {
    speechSynthesis.cancel();
    isSpeaking.value = false;
  }
};

const readLastMessage = () => {
  if (isSpeaking.value) {
    stopSpeaking();
  } else if (lastMessage.value) {
    speak(lastMessage.value);
  }
};

const onIframeLoad = () => {
  // Try to read the last message from the iframe
  // Note: This may not work due to cross-origin restrictions
  try {
    const iframe = difyIframe.value;
    if (iframe?.contentDocument) {
      const messages = iframe.contentDocument.querySelectorAll('[class*="message"]');
      if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        lastMessage.value = lastMsg.textContent || '';
      }
    }
  } catch {
    // Cross-origin - cannot access iframe content
    console.log('Cannot access iframe content due to cross-origin policy');
  }
};

// Initialize voice on mount
if (typeof window !== 'undefined') {
  initVoice();
}

onUnmounted(() => {
  stopSpeaking();
});
</script>
