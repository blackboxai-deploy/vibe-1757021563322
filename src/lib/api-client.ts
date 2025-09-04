// API client for AI chat functionality

import { Message, ImageAttachment, AIResponse } from './types';

const API_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const API_HEADERS = {
  'customerId': 'cus_S16jfiBUH2cc7P',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

export interface ChatRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string | Array<{
      type: 'text';
      text: string;
    } | {
      type: 'image_url';
      image_url: { url: string };
    }>;
  }>;
  max_tokens?: number;
  temperature?: number;
}

export class AIClientError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'AIClientError';
  }
}

export async function sendChatMessage(
  messages: Message[], 
  systemPrompt: string,
  images?: ImageAttachment[]
): Promise<AIResponse> {
  try {
    const chatMessages = formatMessagesForAPI(messages, systemPrompt, images);
    
    const request: ChatRequest = {
      model: 'openrouter/anthropic/claude-sonnet-4',
      messages: chatMessages,
      max_tokens: 2000,
      temperature: 0.3
    };

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new AIClientError(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new AIClientError('Invalid API response format');
    }

    return {
      message: data.choices[0].message.content,
      confidence: data.usage ? calculateConfidence(data.usage) : undefined
    };
  } catch (error) {
    console.error('AI API Error:', error);
    if (error instanceof AIClientError) {
      throw error;
    }
    throw new AIClientError(`Failed to send chat message: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzeImage(
  imageBase64: string, 
  prompt: string,
  systemPrompt: string
): Promise<AIResponse> {
  try {
    const request: ChatRequest = {
      model: 'openrouter/anthropic/claude-sonnet-4',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: imageBase64 } }
          ]
        }
      ],
      max_tokens: 3000,
      temperature: 0.2
    };

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new AIClientError(
        `Image analysis failed: ${response.status} ${response.statusText} - ${errorText}`,
        response.status
      );
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new AIClientError('Invalid API response format');
    }

    return {
      message: data.choices[0].message.content,
      confidence: data.usage ? calculateConfidence(data.usage) : undefined
    };
  } catch (error) {
    console.error('Image Analysis Error:', error);
    if (error instanceof AIClientError) {
      throw error;
    }
    throw new AIClientError(`Failed to analyze image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function formatMessagesForAPI(
  messages: Message[], 
  systemPrompt: string,
  images?: ImageAttachment[]
): ChatRequest['messages'] {
  const apiMessages: ChatRequest['messages'] = [
    {
      role: 'system',
      content: systemPrompt
    }
  ];

  // Add conversation history
  messages.slice(-10).forEach(msg => { // Keep last 10 messages for context
    if (msg.role === 'user' || msg.role === 'assistant') {
      apiMessages.push({
        role: msg.role,
        content: msg.content
      });
    }
  });

  // Handle images in the latest user message
  if (images && images.length > 0) {
    const lastMessage = apiMessages[apiMessages.length - 1];
    if (lastMessage && lastMessage.role === 'user') {
      const content: Array<{
        type: 'text';
        text: string;
      } | {
        type: 'image_url';
        image_url: { url: string };
      }> = [
        { type: 'text', text: lastMessage.content as string }
      ];
      
      images.forEach(img => {
        content.push({
          type: 'image_url',
          image_url: { url: img.base64 }
        });
      });
      
      lastMessage.content = content;
    }
  }

  return apiMessages;
}

function calculateConfidence(usage: any): number {
  // Simple confidence calculation based on token usage
  // This is a placeholder - in production you might want more sophisticated metrics
  if (!usage.total_tokens) return 0.8;
  
  const ratio = usage.completion_tokens / usage.total_tokens;
  return Math.min(0.95, 0.5 + (ratio * 0.5));
}

export async function testAPIConnection(): Promise<boolean> {
  try {
    const response = await sendChatMessage(
      [],
      'You are a test assistant. Respond with "Connection successful" if you receive this message.',
    );
    return response.message.includes('Connection successful');
  } catch (error) {
    console.error('API connection test failed:', error);
    return false;
  }
}