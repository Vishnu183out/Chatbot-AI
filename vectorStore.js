import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const index = pinecone.index(process.env.PINECONE_INDEX);

export async function upsertVectors(documents) {
  const vectors = documents.map(doc => ({
    id: doc.path,
    values: doc.embedding,
    metadata: {
      title: doc.title,
      path: doc.path,
      text: doc.text,
    }
  }));

  await index.upsert(vectors);
}

export async function querySimilarVectors(embedding, topK = 5) {
  const queryResult = await index.query({
    vector: embedding,
    topK,
    includeMetadata: true,
  });

  return queryResult.matches.map(m => m.metadata);
}
