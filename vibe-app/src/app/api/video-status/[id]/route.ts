import { NextRequest, NextResponse } from 'next/server';
import { VideoStatus } from '@/types/video';

// In-memory storage for demo purposes
// In production, this would use a database or Redis
const videoStatusStore = new Map<string, VideoStatus>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Check if video status exists
    const status = videoStatusStore.get(videoId);
    
    if (!status) {
      // Create a mock status for demo purposes
      const mockStatus: VideoStatus = {
        videoId,
        status: 'completed',
        progress: 100,
        currentStep: 'Video generation completed',
        videoUrl: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8a4763a3-0413-4c12-ab88-6fe44292ad15.png}`,
        thumbnailUrl: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/ec1c4126-716a-4710-b195-b1becaae5ee4.png}`,
        subtitles: 'Your historical journey begins...',
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };
      
      videoStatusStore.set(videoId, mockStatus);
      return NextResponse.json(mockStatus);
    }

    return NextResponse.json(status);

  } catch (error) {
    console.error('Error checking video status:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    const updates = await request.json();
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Get existing status or create new one
    const existingStatus = videoStatusStore.get(videoId) || {
      videoId,
      status: 'pending' as const,
      progress: 0,
      currentStep: 'Initializing...',
      createdAt: new Date().toISOString()
    };

    // Update status
    const updatedStatus: VideoStatus = {
      ...existingStatus,
      ...updates,
      videoId // Ensure videoId cannot be changed
    };

    // Mark completion time if status is completed
    if (updatedStatus.status === 'completed' && !updatedStatus.completedAt) {
      updatedStatus.completedAt = new Date().toISOString();
    }

    videoStatusStore.set(videoId, updatedStatus);
    
    return NextResponse.json(updatedStatus);

  } catch (error) {
    console.error('Error updating video status:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    const existed = videoStatusStore.delete(videoId);
    
    if (!existed) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Video status deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting video status:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}