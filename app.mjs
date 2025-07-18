import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fetchContent } from './aemFetcher.js';
import { embedText } from './embedder.js';
import { upsertVectors } from './vectorStore.js';
import { handleQuery } from './queryHandler.js';

dotenv.config();
const app = express();

// ✅ Apply CORS middleware globally
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.options('/query', cors());

// ✅ JSON body parser
app.use(express.json());

// ✅ Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// ✅ GET query test
app.get('/query', (req, res) => {
  res.json({ success: true });
});

// ✅ Ingest content
app.post('/ingest', async (req, res) => {
  const contentList = await fetchContent();

  const withEmbeddings = await Promise.all(
    contentList.map(async (item) => {
      const text = `${item.title}\n${item.description || ''}\nPath: ${item.path}\nTags: ${item.tags?.join(', ')}`;
      const embedding = await embedText(text);
      return { ...item, text, embedding };
    })
  );

  await upsertVectors(withEmbeddings);
  res.send({ status: 'Content ingested successfully', count: withEmbeddings.length });
});

// ✅ POST query endpoint
app.post('/query', async (req, res) => {
  const { question } = req.body;
  const answer = await handleQuery(question);
  res.send({ answer });
});

// ✅ Start server
app.listen(3000, () => console.log('✅ Agentic AI server running on port 3000'));
