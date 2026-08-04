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
          <div class="flex items-center space-x-3">
            <!-- Voice Selector -->
            <select
              v-model="selectedVoice"
              class="bg-white/20 text-white text-xs px-2 py-1 rounded border border-white/30 focus:outline-none focus:ring-1 focus:ring-white/50 cursor-pointer"
            >
              <option value="female" class="text-gray-900">Female</option>
              <option value="male" class="text-gray-900">Male</option>
              <option value="off" class="text-gray-900">Voice Off</option>
            </select>
            <!-- Close Button -->
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
          v-if="selectedVoice !== 'off'"
          class="bg-green-100 text-green-800 text-xs px-4 py-1 flex items-center space-x-1 flex-shrink-0"
        >
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span>{{ selectedVoice === 'female' ? 'Female' : 'Male' }} voice enabled</span>
        </div>

        <!-- Messages Area -->
        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          <div v-if="messages.length === 0" class="text-center text-gray-500 mt-8">
            <span class="text-4xl block mb-2">👩‍🏫</span>
            <p class="text-sm font-medium">Hi! I'm your Study Counselor</p>
            <p class="text-xs text-gray-400 mt-1">
              Ask me about programs, applications, visas, or scholarships
            </p>
          </div>

          <div
            v-for="(msg, index) in messages"
            :key="index"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              :class="[
                'max-w-[85%] px-4 py-2 rounded-lg text-sm',
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-900 shadow border border-gray-200 rounded-bl-none',
              ]"
            >
              {{ msg.content }}
            </div>
          </div>

          <div v-if="isLoading" class="flex justify-start">
            <div
              class="bg-white px-4 py-2 rounded-lg rounded-bl-none shadow border border-gray-200"
            >
              <div class="flex space-x-1">
                <div
                  class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style="animation-delay: 0ms"
                ></div>
                <div
                  class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style="animation-delay: 150ms"
                ></div>
                <div
                  class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style="animation-delay: 300ms"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="border-t border-gray-200 p-3 bg-white flex-shrink-0">
          <div class="flex space-x-2">
            <input
              v-model="userInput"
              type="text"
              placeholder="Type your question..."
              :disabled="isLoading"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm text-gray-900 disabled:opacity-50"
              @keypress.enter="sendMessage"
            />
            <button
              :disabled="isLoading || !userInput.trim()"
              class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="sendMessage"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onUnmounted, ref, watch } from 'vue';

const isOpen = ref(false);
const selectedVoice = ref('female');
const isSpeaking = ref(false);
const isLoading = ref(false);
const userInput = ref('');
const messages = ref<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
const messagesContainer = ref<HTMLElement | null>(null);

// Use environment variables that will be available after hydration
const DIFY_API_URL = ref('');
const DIFY_API_KEY = ref('');

if (import.meta.client) {
  const config = useRuntimeConfig();
  DIFY_API_URL.value = config.public.difyApiUrl;
  DIFY_API_KEY.value = config.public.difyApiKey;
}

let speechSynthesis: SpeechSynthesis | null = null;
let femaleVoice: SpeechSynthesisVoice | null = null;
let maleVoice: SpeechSynthesisVoice | null = null;

const toggleChat = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && messages.value.length === 0) {
    messages.value.push({
      role: 'assistant',
      content:
        "Hi! I'm your Study Counselor. I can help with applications, visas, scholarships, and more. What would you like to know?",
    });
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
            v.name.includes('Google UK English Female')
        ) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0] ||
        null;
      maleVoice =
        voices.find(
          (v) =>
            v.name.includes('Daniel') ||
            v.name.includes('James') ||
            v.name.includes('Google UK English Male')
        ) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0] ||
        null;
    };
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
  }
};

const speak = (text: string) => {
  if (!speechSynthesis || selectedVoice.value === 'off') return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = selectedVoice.value === 'female' ? 1.1 : 0.9;
  const voice = selectedVoice.value === 'female' ? femaleVoice : maleVoice;
  if (voice) utterance.voice = voice;
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

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const sendMessage = async () => {
  if (!userInput.value.trim() || isLoading.value) return;

  const userMessage = userInput.value.trim();
  messages.value.push({ role: 'user', content: userMessage });
  userInput.value = '';
  isLoading.value = true;

  try {
    const response = await fetch(`${DIFY_API_URL.value}/chat-messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {},
        query: userMessage,
        response_mode: 'blocking',
        conversation_id: '',
        user: 'nuxt-user-' + Date.now(),
      }),
    });

    const data = await response.json();

    if (data.answer) {
      messages.value.push({ role: 'assistant', content: data.answer });
      speak(data.answer);
    } else {
      messages.value.push({
        role: 'assistant',
        content: 'Sorry, I could not process your request. Please try again.',
      });
    }
  } catch (error) {
    console.error('Dify API error:', error);
    messages.value.push({
      role: 'assistant',
      content: 'Sorry, there was an error. Please try again.',
    });
  } finally {
    isLoading.value = false;
    scrollToBottom();
  }
};

watch(
  () => messages.value.length,
  () => {
    scrollToBottom();
  }
);

if (typeof window !== 'undefined') initVoice();
onUnmounted(() => stopSpeaking());
</script>
