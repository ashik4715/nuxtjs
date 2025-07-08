import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});

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
    const dataPath = path.join(process.cwd(), 'static', 'ai-agent-data.json');
    const aiData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Find relevant context
    const context = findRelevantContext(query, aiData);

    // Create the prompt for OpenAI
    const prompt = `You are Mohammed Ashikur Rahman's AI assistant. Based on the following information about him, answer the user's question naturally and conversationally. If you're asked about something not in the data, politely say you don't have that information.

Context about Mohammed Ashikur Rahman:
${JSON.stringify(context, null, 2)}

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

function findRelevantContext(query: string, data: any) {
  const queryLower = query.toLowerCase();
  const relevantData: any = {};

  // Check for relevant sections based on query keywords
  if (queryLower.includes('education') || queryLower.includes('university') || queryLower.includes('degree')) {
    relevantData.education = data.education;
  }

  if (queryLower.includes('work') || queryLower.includes('job') || queryLower.includes('experience') || queryLower.includes('career')) {
    relevantData.work_experience = data.work_experience;
  }

  if (queryLower.includes('skill') || queryLower.includes('technical') || queryLower.includes('programming')) {
    relevantData.skills = data.skills;
  }

  if (queryLower.includes('about') || queryLower.includes('who') || queryLower.includes('personal')) {
    relevantData.personal_info = data.personal_info;
    relevantData.personality_traits = data.personality_traits;
  }

  if (queryLower.includes('contact') || queryLower.includes('reach') || queryLower.includes('collaboration')) {
    relevantData.contact_info = data.contact_info;
  }

  if (queryLower.includes('project') || queryLower.includes('portfolio')) {
    relevantData.portfolio = data.portfolio;
  }

  // If no specific context found, return general information
  if (Object.keys(relevantData).length === 0) {
    return {
      personal_info: data.personal_info,
      skills: data.skills,
      work_experience: data.work_experience.slice(0, 1) // Just current job
    };
  }

  return relevantData;
}
