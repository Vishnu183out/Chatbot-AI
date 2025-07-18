import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text) {
  const res = await openai.embeddings.create({
    input: text,
    model: "text-embedding-3-small"
  });
  return res.data[0].embedding;
}
