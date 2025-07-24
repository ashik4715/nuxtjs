import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import OpenAI from 'openai';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string
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

  return context || `About: ${aiData.personal_info?.description || 'Full-stack developer with expertise in modern web technologies'}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // Load AI agent data
    const dataPath = path.join(process.cwd(), 'public', 'ai-agent-data.json');
    let aiData;

    try {
      aiData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (error) {
      return res.status(500).json({ error: 'Failed to load AI data' });
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

    return res.status(200).json({
      response: response.choices[0].message.content,
      context: context
    });

  } catch (error) {
    console.error('Error in AI agent:', error);
    return res.status(500).json({ error: 'Failed to process query' });
  }
}

