import { NextRequest, NextResponse } from 'next/server';
import { sendChatMessage, analyzeImage } from '@/lib/api-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, systemPrompt, images } = body;

    if (!messages || !systemPrompt) {
      return NextResponse.json(
        { error: 'Messages and system prompt are required' },
        { status: 400 }
      );
    }

    let response;
    
    // Check if this is an image analysis request
    if (images && images.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const imageBase64 = images[0].base64; // Use first image for analysis
      
      response = await analyzeImage(
        imageBase64,
        lastMessage.content,
        systemPrompt
      );
    } else {
      // Regular chat message
      response = await sendChatMessage(messages, systemPrompt);
    }

    return NextResponse.json({
      success: true,
      message: response.message,
      confidence: response.confidence
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'AI Radiology Chat API is running',
    endpoints: {
      chat: 'POST /api/chat - Send chat messages',
      'image-analysis': 'POST /api/image-analysis - Analyze medical images',
      cases: 'GET/POST /api/cases - Manage radiology cases'
    }
  });
}