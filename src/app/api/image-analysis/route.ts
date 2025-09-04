import { NextRequest, NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/api-client';
import { getDefaultSystemPrompt } from '@/lib/radiology-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageBase64, prompt, systemPrompt } = body;

    if (!imageBase64 || !prompt) {
      return NextResponse.json(
        { error: 'Image data and analysis prompt are required' },
        { status: 400 }
      );
    }

    // Use provided system prompt or default radiology prompt
    const analysisSystemPrompt = systemPrompt || getDefaultSystemPrompt().prompt;
    
    const response = await analyzeImage(
      imageBase64,
      prompt,
      analysisSystemPrompt
    );

    return NextResponse.json({
      success: true,
      analysis: response.message,
      confidence: response.confidence,
      model: 'openrouter/anthropic/claude-sonnet-4'
    });

  } catch (error) {
    console.error('Image Analysis API Error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to analyze image',
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'AI Radiology Image Analysis API',
    description: 'Upload medical images for AI-powered analysis and interpretation',
    supportedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/tiff'],
    maxFileSize: '10MB',
    model: 'Claude 3.5 Sonnet with multimodal capabilities'
  });
}