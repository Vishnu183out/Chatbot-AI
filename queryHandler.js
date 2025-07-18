import { embedText } from './embedder.js';
import { querySimilarVectors } from './vectorStore.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function handleQuery(userQuestion) {
  const questionEmbedding = await embedText(userQuestion);
  const topDocs = await querySimilarVectors(questionEmbedding);

  const context = topDocs.map(d => `Title: ${d.title}\nText: ${d.text}`).join("\n\n");

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful website assistant. Use the context below to answer." },
      { role: "user", content: `Context:\n${context}\n\nQuestion:\n${userQuestion}` }
    ]
  });

  return completion.choices[0].message.content;
}
