import { Router } from 'express';
import { config } from '../config';
import { ApiResponse } from '../types';
import axios from 'axios';

export const kimiRouter = Router();

// POST /api/kimi/chat - Kimi chat proxy
kimiRouter.post('/chat', async (req, res) => {
  const { message, context } = req.body;
  
  if (!message) {
    return res.status(400).json({
      success: false,
      error: 'message is required',
    });
  }
  
  if (!config.kimi.apiKey) {
    return res.status(503).json({
      success: false,
      error: 'Kimi API key not configured',
    });
  }
  
  try {
    // TODO: Implement streaming response in future enhancement
    const response = await axios.post(
      `${config.kimi.baseUrl}/chat/completions`,
      {
        model: 'moonshot-v1-8k',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for the Open Artel Dashboard project.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
        stream: false,
      },
      {
        headers: {
          'Authorization': `Bearer ${config.kimi.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    const kimiResponse: ApiResponse<{ response: string }> = {
      success: true,
      data: {
        response: response.data.choices[0]?.message?.content || '',
      },
    };
    
    res.json(kimiResponse);
  } catch (error) {
    console.error('Kimi API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to communicate with Kimi API',
    });
  }
});

