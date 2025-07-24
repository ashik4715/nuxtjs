import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

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

function findRelevantContext(query: string, aiData: any) {
  const lowerQuery = query.toLowerCase();
  let context = '';
  
  if (lowerQuery.includes('skill') || lowerQuery.includes('technology')) {
    context += `Skills: ${aiData.skills?.join(', ') || 'Various technical skills'}. `;
  }
  
  if (lowerQuery.includes('experience') || lowerQuery.includes('work')) {
    context += `Experience: ${aiData.experience?.map((exp: any) => 
      `${exp.position} at ${exp.company} (${exp.duration})`
    ).join(', ') || 'Professional experience in software development'}. `;
  }
  
  if (lowerQuery.includes('project')) {
    context += `Projects: ${aiData.projects?.map((proj: any) => 
      `${proj.name} - ${proj.description}`
    ).join(', ') || 'Various development projects'}. `;
  }
  
  return context || `About: ${aiData.personal?.bio || 'Full-stack developer with expertise in modern web technologies'}`;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { query } = body;

    if (!query) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Query is required'
      });
    }

    // Load AI agent data
    const dataPath = path.join(process.cwd(), 'public', 'ai-agent-data.json');
    let aiData;
    
    try {
      aiData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (error) {
      // Fallback data if file doesn't exist
      aiData = {
        personal: {
          name: "Mohammed Ashikur Rahman",
          bio: "Full-stack developer with expertise in modern web technologies"
        },
        skills: ["JavaScript", "Vue.js", "Node.js", "Python"],
        experience: [],
        projects: []
      };
    }

    // Find relevant context
    const context = findRelevantContext(query, aiData);

    // Create the prompt for OpenAI
    const prompt = `You are Mohammed Ashikur Rahman's AI assistant. Based on the following information about him, answer the user's question naturally and conversationally. If you're asked about something not in the data, politely say you don't have that information.

Context about Mohammed Ashikur Rahman:
${context}

User Question: ${query}

Please provide a helpful, friendly, and informative response as if you're representing Mohammed Ashikur Rahman:`;

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return {
      response: response.choices[0].message.content,
      context: context
    };

  } catch (error) {
    console.error('Error in AI agent:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process query'
    });
  }
});