<template>
  <div class="voice-settings">
    <div class="flex items-center space-x-4 text-sm">
      <label class="font-medium text-gray-700">Voice:</label>
      <select 
        v-model="selectedVoice" 
        @change="updateVoice"
        class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="alloy">Alloy (Neutral)</option>
        <option value="echo">Echo (Male)</option>
        <option value="fable">Fable (British Male)</option>
        <option value="onyx">Onyx (Deep Male)</option>
        <option value="nova">Nova (Female)</option>
        <option value="shimmer">Shimmer (Female)</option>
      </select>
      
      <label class="font-medium text-gray-700">Speed:</label>
      <select 
        v-model="selectedSpeed" 
        @change="updateSpeed"
        class="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="0.75">0.75x (Slow)</option>
        <option value="1.0">1.0x (Normal)</option>
        <option value="1.25">1.25x (Fast)</option>
        <option value="1.5">1.5x (Very Fast)</option>
      </select>
      
      <button 
        @click="testVoice"
        :disabled="isTesting"
        class="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm disabled:opacity-50"
      >
        {{ isTesting ? 'Testing...' : 'Test Voice' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const emit = defineEmits(['voice-changed', 'speed-changed']);

const selectedVoice = ref('alloy');
const selectedSpeed = ref('1.0');
const isTesting = ref(false);

// Load saved preferences
onMounted(() => {
  if (process.client) {
    const savedVoice = localStorage.getItem('ai-agent-voice');
    const savedSpeed = localStorage.getItem('ai-agent-speed');
    
    if (savedVoice) selectedVoice.value = savedVoice;
    if (savedSpeed) selectedSpeed.value = savedSpeed;
  }
});

const updateVoice = () => {
  if (process.client) {
    localStorage.setItem('ai-agent-voice', selectedVoice.value);
  }
  emit('voice-changed', selectedVoice.value);
};

const updateSpeed = () => {
  if (process.client) {
    localStorage.setItem('ai-agent-speed', selectedSpeed.value);
  }
  emit('speed-changed', parseFloat(selectedSpeed.value));
};

const testVoice = async () => {
  if (isTesting.value) return;
  
  try {
    isTesting.value = true;
    
    const testText = "Hello! This is how I sound with the current voice settings.";
    
    const response = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: testText,
        voice: selectedVoice.value,
        speed: parseFloat(selectedSpeed.value)
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate test speech');
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      isTesting.value = false;
    };
    
    audio.onerror = () => {
      URL.revokeObjectURL(audioUrl);
      isTesting.value = false;
    };
    
    await audio.play();
    
  } catch (error) {
    console.error('Error testing voice:', error);
    isTesting.value = false;
  }
};

// Expose current settings
defineExpose({
  voice: selectedVoice,
  speed: selectedSpeed
});
</script>
