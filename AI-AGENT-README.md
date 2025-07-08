# AI Agent Implementation for Mohammed Ashikur Rahman's Website

This implementation adds an AI-powered chatbot to your website that can answer questions about your background, experience, and expertise using Claude AI with audio narration capabilities.

## Features

✅ **RAG-based AI Agent** - Uses Retrieval-Augmented Generation with Claude 3 Sonnet
✅ **Premium Audio Narration** - High-quality text-to-speech using OpenAI TTS API
✅ **Voice Customization** - 6 different voice options (Alloy, Echo, Fable, Onyx, Nova, Shimmer)
✅ **Speed Control** - Adjustable speech speed from 0.75x to 1.5x
✅ **Contextual Responses** - Intelligent context retrieval based on user queries
✅ **Real-time Chat** - Interactive chat interface with your website visitors
✅ **Mobile Responsive** - Works on all devices

## Files Added/Modified

### New Files:
- `static/ai-agent-data.json` - Your structured personal/professional data
- `server/api/ai-agent.post.ts` - Main AI agent API endpoint
- `server/api/text-to-speech.post.ts` - Text-to-speech API endpoint
- `pages/ai-agent.vue` - Chat interface page
- `.env.example` - Environment variables template

### Modified Files:
- `app.vue` - Added "AI Assistant" navigation link
- `package.json` - Added Anthropic SDK dependency

## Setup Instructions

### 1. Install Dependencies
```bash
yarn install
```

### 2. Set Up Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Get your API keys:
   
   **Anthropic API Key (for AI responses):**
   - Visit [https://console.anthropic.com/](https://console.anthropic.com/)
   - Create an account and get your API key
   
   **OpenAI API Key (for text-to-speech):**
   - Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create an account and get your API key
   
   Add both to your `.env` file:
   ```env
   ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here
   OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

### 3. Update Vercel Environment Variables
For deployment on Vercel, add your environment variables:
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add: `ANTHROPIC_API_KEY` with your Anthropic API key

### 4. Test Locally
```bash
yarn dev
```
Visit `http://localhost:3000/ai-agent` to test the chat interface.

## How It Works

### 1. Data Structure
Your personal information is stored in `static/ai-agent-data.json` with structured sections:
- Personal Information
- Education
- Work Experience
- Skills
- Personality Traits
- Portfolio
- Contact Information

### 2. Query Processing
1. User submits a question via the chat interface
2. The system analyzes the query to find relevant context from your data
3. Claude AI generates a personalized response using your information
4. The response is displayed with an option to hear it spoken aloud

### 3. Context Matching
The system intelligently matches user queries to relevant sections of your data:
- Education queries → Education section
- Work/career queries → Work experience
- Skills queries → Technical skills
- Personal queries → Personal info & traits

## Usage Examples

Users can ask questions like:
- "What is Ashikur's current role?"
- "Tell me about his education"
- "What are his technical skills?"
- "Where did he work before?"
- "What is his experience in AI?"
- "Tell me about his cyber security background"

## Customization

### Adding More Information
Edit `static/ai-agent-data.json` to add more details about yourself.

### Upgrading Text-to-Speech
For higher quality audio, you can integrate premium TTS services:

#### Option 1: ElevenLabs (Recommended)
1. Get API key from [ElevenLabs](https://elevenlabs.io/)
2. Add to `.env`: `ELEVENLABS_API_KEY=your_key`
3. Uncomment the ElevenLabs code in `server/api/text-to-speech.post.ts`

#### Option 2: OpenAI TTS
1. Get API key from OpenAI
2. Add to `.env`: `OPENAI_API_KEY=your_key`
3. Implement OpenAI TTS in the text-to-speech endpoint

### Improving Context Matching
For better context retrieval, consider implementing:
- Vector embeddings with Pinecone or Weaviate
- Semantic search capabilities
- More sophisticated keyword matching

## Deployment

### Vercel (Current Setup)
Your site is already on Vercel. After setting up environment variables:
```bash
git add .
git commit -m "Add AI agent functionality"
git push
```

The changes will auto-deploy to https://jholok.vercel.app/ai-agent

## Cost Considerations

- **Claude API**: Pay-per-use, approximately $0.015 per 1K tokens
- **ElevenLabs TTS**: Free tier available, then $5/month for 30K characters
- **Vercel Hosting**: Free tier should be sufficient for personal use

## Security Notes

- Environment variables are safely stored on Vercel
- API keys are never exposed to client-side code
- No personal data is stored in databases - only in static files

## Future Enhancements

Consider adding:
- 📊 Analytics to track popular questions
- 🎨 Custom voice training for more personal audio
- 🔍 Integration with your blog/portfolio content
- 📱 Mobile app version
- 🌐 Multi-language support

## Support

If you encounter any issues:
1. Check that your API key is correctly set in Vercel
2. Verify the API endpoint is working: `/api/ai-agent`
3. Check browser console for any JavaScript errors
4. Ensure your Claude API account has sufficient credits

## Next Steps

1. Set up your Anthropic API key
2. Test the functionality locally
3. Deploy to Vercel
4. Share the link: https://jholok.vercel.app/ai-agent
5. Consider upgrading to premium TTS for better audio quality

Your AI agent is now ready to help visitors learn more about you! 🚀
