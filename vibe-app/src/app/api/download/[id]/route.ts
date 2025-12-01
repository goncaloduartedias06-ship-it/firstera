import { NextRequest, NextResponse } from 'next/server';
import { VideoUtils } from '@/lib/video-utils';

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

    // In production, this would fetch the actual video file from storage
    // For demo purposes, we'll return a download URL
    const videoUrl = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/707f23d8-e665-4d86-b3d6-66e8c414a24d.png}`;
    
    // Generate appropriate filename
    const filename = VideoUtils.generateFilename(`historical-video-${videoId}`);
    
    // Get query parameters for format and quality
    const searchParams = request.nextUrl.searchParams;
    const format = searchParams.get('format') || 'mp4';
    const quality = searchParams.get('quality') || 'hd';
    
    // Validate format
    if (!['mp4', 'webm'].includes(format)) {
      return NextResponse.json(
        { error: 'Invalid format. Supported formats: mp4, webm' },
        { status: 400 }
      );
    }
    
    // Validate quality
    if (!['hd', 'sd'].includes(quality)) {
      return NextResponse.json(
        { error: 'Invalid quality. Supported qualities: hd, sd' },
        { status: 400 }
      );
    }

    // In production, this would stream the actual video file
    // For demo, return download information
    return NextResponse.json({
      success: true,
      downloadUrl: videoUrl,
      filename: filename.replace('.mp4', `.${format}`),
      format,
      quality,
      fileSize: quality === 'hd' ? '12.5 MB' : '6.8 MB',
      resolution: quality === 'hd' ? '1080x1920' : '720x1280',
      duration: '6 seconds',
      message: 'Video ready for download'
    });

  } catch (error) {
    console.error('Error preparing video download:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    const body = await request.json();
    
    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Extract download preferences from request body
    const { format = 'mp4', quality = 'hd', customFilename } = body;
    
    // Generate filename
    const filename = customFilename || VideoUtils.generateFilename(`pov-historical-${videoId}`);
    
    // In production, this would initiate the download preparation process
    // For demo, return immediate download information
    const downloadInfo = {
      success: true,
      videoId,
      downloadUrl: `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/729ab9b2-920c-4056-bb4c-bbfa7ac65033.png}`,
      filename: filename.replace(/\.[^/.]+$/, `.${format}`),
      format,
      quality,
      estimatedSize: quality === 'hd' ? '12.5 MB' : '6.8 MB',
      preparationTime: '2-3 seconds',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    return NextResponse.json(downloadInfo);

  } catch (error) {
    console.error('Error creating custom download:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}