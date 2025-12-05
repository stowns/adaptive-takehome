import express, { Request, Response } from 'express';
import { ChatOllama } from "@langchain/ollama";
import { ContentBlock, createAgent } from "langchain";
import client from 'prom-client';
import { prometheusMiddleware } from './middleware/prometheus';
import morgan from 'morgan';
import { createWriteStream } from 'fs';
import logger from './utils/logger';

const OLLAMA = new ChatOllama({
  model: process.env.OLLAMA_MODEL || 'llama3.1',
  baseUrl: process.env.OLLAMA_URL || 'http://localhost:11434'
});
const agent = createAgent({
    model: OLLAMA,
    systemPrompt: 'You are assisting and on-call engineer with root-cause analysis of a customer incident.'
});

const app = express();
const PORT = process.env.PORT || 3000;

// Create a Prometheus Registry
const register = new client.Registry();
// Add default metrics
client.collectDefaultMetrics({ register });

// Log directory (created by Kubernetes volume mount)
const logDir = process.env.LOG_DIR || './logs';

// Middleware
app.use(morgan('common', {
    stream: createWriteStream(`${logDir}/access.log`, {flags: 'a'})
}));
app.use(express.json());
app.use(prometheusMiddleware);


// Types
interface CompletionRequest {
  prompt: string;
}

interface CompletionResponse {
  completion:  string | (ContentBlock | ContentBlock.Text)[];
}

// In-memory storage for history
const conversationHistory: Array<{ role: string; content: any }> = [];

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});

// POST /completion endpoint
app.post('/completion', async (req: Request<{}, CompletionResponse, CompletionRequest>, res: Response<CompletionResponse | { error: string }>) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Generate a simple completion response
  const response = await agent.invoke({
    messages: prompt
  });

  const agentMessage = response.messages[response.messages.length - 1];
  const agentContent = agentMessage.content;

  // Store in history
  conversationHistory.push({ role: 'user', content: prompt });

  res.json({ completion: agentContent });
});

app.get('/history', (req: Request, res: Response) => {
  res.json({
    count: conversationHistory.length,
    history: conversationHistory
  });
});

app.get('/metrics', async (req: Request, res: Response) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

// Export for testing
export { app, server };
