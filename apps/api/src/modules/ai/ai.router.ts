import { Router, Request, Response } from 'express';
import { AIService } from './ai.service';

export const aiRouter = Router();

aiRouter.post('/screen-prompt', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Natural language prompt is required.' });
    }

    const result = await AIService.promptToDSL(prompt);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to parse natural language prompt.' });
  }
});

aiRouter.post('/query', async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for AI Terminal query.' });
    }

    const response = await AIService.executeAITerminalCommand(prompt);
    return res.json(response);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'AI Terminal query execution failed.' });
  }
});
