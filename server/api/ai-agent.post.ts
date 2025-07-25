import fs from 'fs';
import OpenAI from 'openai';
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
    context += `Experience: ${aiData.work_experience?.map((exp: any) =>
      `${exp.position} at ${exp.company} (${exp.duration})`
    ).join(', ') || 'Professional experience in software development'}. `;
  }

  if (lowerQuery.includes('project')) {
    context += `Projects: ${aiData.projects?.map((proj: any) =>
      `${proj.name} - ${proj.description}`
    ).join(', ') || 'Various development projects'}. `;
  }

  return context || `About: ${aiData.personal_info?.description || 'Full-stack developer with expertise in modern web technologies'}`;
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

    // Try multiple paths for the data file
    let aiData;
    const possiblePaths = [
      path.join(process.cwd(), 'static', 'ai-agent-data.json'),
      path.join(process.cwd(), 'public', 'ai-agent-data.json'),
      './static/ai-agent-data.json',
      './public/ai-agent-data.json'
    ];

    for (const dataPath of possiblePaths) {
      try {
        if (fs.existsSync(dataPath)) {
          aiData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
          break;
        }
      } catch (error) {
        continue;
      }
    }

    // Fallback data if file not found
    if (!aiData) {
      aiData = {
        personal_info: {
          name: "Mohammed Ashikur Rahman",
          description: "Senior Software Engineer with expertise in modern web technologies"
        },
        skills: ["JavaScript", "Vue.js", "Node.js", "Python"],
        work_experience: []
      };
    }

    const context = findRelevantContext(query, aiData);

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are Mohammed Ashikur Rahman's AI assistant. Based on the following information about him, answer the user's question naturally and conversationally.

Context: ${context}

User Question: ${query}

Please provide a helpful, friendly response:`
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
      statusMessage: `Failed to process query}`
    });
  }
});
