import { VercelRequest, VercelResponse } from '@vercel/node';
import { Anthropic } from '@anthropic-ai/sdk';
import fs from 'fs';

const aiAgentDataPath = './static/ai-agent-data.json';
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'No query provided' });
    }

    const data = JSON.parse(fs.readFileSync(aiAgentDataPath, 'utf8'));

    // Process the query using Claude API
    const context = await getContextForQuery(query, data);
    const response = await anthropic.complete({
      prompt: `${context}
Question: ${query}
Answer:`,
      stop: ['
', "\n"]
    });

    // Return the response
    res.status(200).json({ response: response.choices[0].text.trim() });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
}

async function getContextForQuery(query, data) {
  // Simplified context retrieval - in practice, use embeddings and similarity search
  for (const key in data) {
    if (data[key].some((item) => typeof item === 'string' && item.toLowerCase().includes(query.toLowerCase()))) {
      return JSON.stringify(data[key]);
    }
  }
  return 'No context found';
}

