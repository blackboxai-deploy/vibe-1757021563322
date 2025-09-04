import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for demo purposes
// In production, this would use a proper database
let radiologyCases: any[] = [];

export async function GET() {
  return NextResponse.json({
    success: true,
    cases: radiologyCases,
    count: radiologyCases.length
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newCase = {
      id: `case-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    radiologyCases.push(newCase);
    
    return NextResponse.json({
      success: true,
      case: newCase,
      message: 'Case created successfully'
    });
    
  } catch (error) {
    console.error('Cases API Error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to create case',
        success: false
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }
    
    const caseIndex = radiologyCases.findIndex(c => c.id === id);
    if (caseIndex === -1) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }
    
    radiologyCases[caseIndex] = {
      ...radiologyCases[caseIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      case: radiologyCases[caseIndex],
      message: 'Case updated successfully'
    });
    
  } catch (error) {
    console.error('Cases API Error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to update case',
        success: false
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Case ID is required' },
        { status: 400 }
      );
    }
    
    const caseIndex = radiologyCases.findIndex(c => c.id === id);
    if (caseIndex === -1) {
      return NextResponse.json(
        { error: 'Case not found' },
        { status: 404 }
      );
    }
    
    const deletedCase = radiologyCases.splice(caseIndex, 1)[0];
    
    return NextResponse.json({
      success: true,
      deletedCase,
      message: 'Case deleted successfully'
    });
    
  } catch (error) {
    console.error('Cases API Error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to delete case',
        success: false
      },
      { status: 500 }
    );
  }
}