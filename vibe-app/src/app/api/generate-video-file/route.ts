import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, duration } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Generate real video using Veo-3 model
    const videoResponse = await fetch('https://api.blackbox.ai/v1/video/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.BLACKBOX_API_KEY || 'demo-key'}`
      },
      body: JSON.stringify({
        model: 'google/veo-3',
        prompt: prompt,
        duration: duration,
        aspect_ratio: '9:16',
        quality: 'high',
        fps: 24
      })
    });

    if (!videoResponse.ok) {
      // Fallback: Use our video generation tool
      const fallbackResponse = await generateVideoFallback(prompt, duration);
      return NextResponse.json(fallbackResponse);
    }

    const videoData = await videoResponse.json();
    
    return NextResponse.json({
      success: true,
      videoUrl: videoData.url,
      duration: duration,
      format: 'mp4'
    });

  } catch (error) {
    console.error('Error in video generation:', error);
    
    // Fallback to our video generation tool
    try {
      const { prompt, duration } = await request.json();
      const fallbackResponse = await generateVideoFallback(prompt, duration);
      return NextResponse.json(fallbackResponse);
    } catch (fallbackError) {
      return NextResponse.json(
        { error: 'Failed to generate video' },
        { status: 500 }
      );
    }
  }
}

async function generateVideoFallback(prompt: string, duration: number) {
  try {
    // Use the generateVideo tool for real video generation
    const videoResponse = await fetch('http://localhost:3000/api/tools/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: `Create a ${duration}-second vertical POV historical video: ${prompt}. First-person perspective, cinematic quality, slow forward motion, immersive experience.`
      })
    });

    if (videoResponse.ok) {
      const videoData = await videoResponse.json();
      return {
        success: true,
        videoUrl: videoData.url,
        duration: duration,
        format: 'mp4'
      };
    }
    
    throw new Error('Video generation failed');
  } catch (error) {
    console.error('Fallback video generation failed:', error);
    throw error;
  }
}