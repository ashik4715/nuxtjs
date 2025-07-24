<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-200 py-4">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-gray-200 rounded-lg shadow-lg p-6">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mt-20">
            Chat with Ashikur Rahman's AI Assistant
          </h1>
          <p class="text-gray-600">
            Ask me anything about Mohammed Ashikur Rahman's background,
            experience, and expertise.
          </p>
        </div>

        <!-- Chat Messages -->
        <div class="h-96 overflow-y-auto mb-6 p-4 bg-gray-50 rounded-lg">
          <div
            v-if="messages.length === 0"
            class="text-center text-gray-500 mt-8"
          >
            <p>
              👋 Hello! I'm Ashikur's AI assistant. Feel free to ask me about
              his:
            </p>
            <ul class="mt-4 space-y-2">
              <li>• Education and background</li>
              <li>• Work experience and current role</li>
              <li>• Technical skills and expertise</li>
              <li>• Projects and portfolio</li>
              <li>• Career journey and achievements</li>
            </ul>
          </div>

          <div v-for="(message, index) in messages" :key="index" class="mb-4">
            <div v-if="message.type === 'user'" class="flex justify-end">
              <div
                class="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-xs lg:max-w-md"
              >
                {{ message.content }}
              </div>
            </div>

            <div v-else class="flex justify-start">
              <div
                class="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg max-w-xs lg:max-w-md"
              >
                {{ message.content }}
                <div class="mt-2 flex space-x-2">
                  <button
                    @click="speakText(message.content)"
                    class="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    :disabled="isSpeaking"
                  >
                    <svg
                      class="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5 12a7 7 0 1014 0v0a7 7 0 00-14 0v0z"
                      ></path>
                    </svg>
                    {{ isSpeaking ? "Speaking..." : "Listen" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="flex space-x-2">
          <input
            v-model="currentMessage"
            @keypress.enter="sendMessage"
            type="text"
            placeholder="Ask me anything about Ashikur..."
            :disabled="isLoading"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:placeholder-gray-400"
          />
          <button
            @click="sendMessage"
            :disabled="isLoading || !currentMessage.trim()"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoading ? "Thinking..." : "Send" }}
          </button>
        </div>

        <!-- Voice Settings -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-3">
            🎙️ Voice Settings:
          </h3>
          <VoiceSettings
            ref="voiceSettings"
            @voice-changed="onVoiceChanged"
            @speed-changed="onSpeedChanged"
          />
        </div>

        <!-- Example Questions -->
        <div class="mt-6">
          <h3 class="text-sm font-medium text-gray-700 mb-3">Try asking:</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="example in exampleQuestions"
              :key="example"
              @click="askExample(example)"
              class="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700"
            >
              {{ example }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

// Add this for debugging
onMounted(() => {
  console.log("Public runtime config:", useRuntimeConfig().public);
  console.log("Full runtime config (server vars hidden):", useRuntimeConfig());
});

// Reactive data
const messages = ref([]);
const currentMessage = ref("");
const isLoading = ref(false);
const isSpeaking = ref(false);

// Example questions
const exampleQuestions = [
  "What is Ashikur's current job role?",
  "Where did Ashikur study computer science?",
  "Can you describe his experience with NestJS and Node.js?",
  "What companies has Ashikur worked at before WeGro Global?",
  "Tell me about Ashikur’s work as a Lead PHP Developer.",
  "What cloud platforms does he use?",
  "What technologies are in Ashikur’s tech stack?",
  "Does Ashikur have experience with Docker and CI/CD?",
  "What kind of projects has he worked on?",
  "What are his strengths in backend development?",
  "How did his education in AI influence his career?",
  "Can you explain his Laravel internship experience?",
  "Has he worked in both Bangladesh and the UK?",
  "What frontend technologies does Ashikur use?",
  "Is Ashikur open to collaborations or new opportunities?",
];

// Voice settings
const voiceSettings = ref(null);
const currentVoice = ref("alloy");
const currentSpeed = ref(1.0);

// Audio playback setup
let currentAudio = null;

onMounted(() => {
  // Audio setup is handled when needed
});

// Voice settings handlers
const onVoiceChanged = (voice) => {
  currentVoice.value = voice;
};

const onSpeedChanged = (speed) => {
  currentSpeed.value = speed;
};

// Methods
const sendMessage = async () => {
  if (!currentMessage.value.trim() || isLoading.value) return;

  const userMessage = currentMessage.value.trim();
  messages.value.push({ type: "user", content: userMessage });
  currentMessage.value = "";
  isLoading.value = true;

  try {
    const response = await $fetch("/api/ai-agent", {
      method: "POST",
      body: { query: userMessage },
    });

    messages.value.push({
      type: "assistant",
      content: response.response,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    messages.value.push({
      type: "assistant",
      content: "Sorry, I encountered an error. Please try again.",
    });
  } finally {
    isLoading.value = false;
  }
};

const askExample = (question) => {
  currentMessage.value = question;
  sendMessage();
};

const speakText = async (text) => {
  if (isSpeaking.value) return;

  try {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    isSpeaking.value = true;

    // Call the OpenAI TTS API with current voice settings
    const response = await fetch("/api/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        voice: currentVoice.value,
        speed: currentSpeed.value,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate speech");
    }

    // Create audio blob from response
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Create and play audio
    currentAudio = new Audio(audioUrl);

    currentAudio.onended = () => {
      isSpeaking.value = false;
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
    };

    currentAudio.onerror = () => {
      isSpeaking.value = false;
      URL.revokeObjectURL(audioUrl);
      currentAudio = null;
      console.error("Error playing audio");
    };

    await currentAudio.play();
  } catch (error) {
    console.error("Error in text-to-speech:", error);
    isSpeaking.value = false;

    // Fallback to browser speech synthesis if OpenAI TTS fails
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        isSpeaking.value = false;
      };

      window.speechSynthesis.speak(utterance);
    }
  }
};

// Meta tags
useHead({
  title: "AI Assistant - Mohammed Ashikur Rahman",
  meta: [
    {
      name: "description",
      content:
        "Chat with Mohammed Ashikur Rahman's AI assistant to learn about his background, experience, and expertise.",
    },
  ],
});
</script>

<style scoped>
/* Add any custom styles here */
</style>
