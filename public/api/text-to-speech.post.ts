import OpenAI from 'openai';

const config = useRuntimeConfig();
if (!config.openaiApiKey) {
  throw createError({
    statusCode: 500,
    statusMessage: 'OpenAI API key not configured'
  });
}
const openai = new OpenAI({
  apiKey: config.openaiApiKey as string
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { text, voice = 'alloy', speed = 1.0 } = body;

    if (!text) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Text is required'
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      throw createError({
        statusCode: 500,
        statusMessage: 'OpenAI API key not configured'
      });
    }

    // Validate voice parameter
    const validVoices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
    const selectedVoice = validVoices.includes(voice) ? voice : 'alloy';

    // Validate speed parameter (0.25 to 4.0)
    const selectedSpeed = Math.max(0.25, Math.min(4.0, parseFloat(speed) || 1.0));

    // Generate speech using OpenAI TTS
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1', // or 'tts-1-hd' for higher quality
      voice: selectedVoice,
      input: text,
      response_format: 'mp3',
      speed: selectedSpeed
    });

    // Convert the response to a buffer
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // Set appropriate headers for audio response
    setHeader(event, 'Content-Type', 'audio/mpeg');
    setHeader(event, 'Content-Length', buffer.length);
    setHeader(event, 'Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    return buffer;

  } catch (error) {
    console.error('Error in OpenAI text-to-speech:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to generate speech'
    });
  }
});
