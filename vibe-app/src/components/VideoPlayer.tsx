"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Download, 
  RotateCcw, 
  Volume2, 
  VolumeX,
  Maximize,
  Share2,
  Heart
} from "lucide-react";
import { VideoGenerationResponse } from "@/types/video";
import { VideoUtils } from "@/lib/video-utils";

interface VideoPlayerProps {
  video: VideoGenerationResponse;
  onReset?: () => void;
}

export default function VideoPlayer({ video, onReset }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(6); // 6 seconds default
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleMuteToggle = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleDownload = useCallback(async () => {
    if (!video.videoId || !video.videoUrl) return;

    try {
      // Check if it's a real video file
      if (video.videoUrl.includes('.mp4') || video.videoUrl.includes('video')) {
        // Direct download of video file
        const filename = VideoUtils.generateFilename(video.videoId || 'pov-video');
        
        const response = await fetch(video.videoUrl);
        const blob = await response.blob();
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
      } else {
        // Generate a video-like file from image with subtitles
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        // Set canvas dimensions for vertical video (9:16 aspect ratio)
        canvas.width = 1080;
        canvas.height = 1920;
        
        // Create a simple video frame with the generated image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        
        img.onload = () => {
          // Draw the image on canvas
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Add subtitle overlay
          if (video.subtitles) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(50, canvas.height - 200, canvas.width - 100, 100);
            
            ctx.fillStyle = 'white';
            ctx.font = '32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(video.subtitles, canvas.width / 2, canvas.height - 140);
          }
          
          // Convert canvas to blob and download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const filename = VideoUtils.generateFilename(video.videoId || 'pov-video');
              
              const link = document.createElement('a');
              link.href = url;
              link.download = filename.replace('.mp4', '.png');
              link.style.display = 'none';
              
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // Clean up
              URL.revokeObjectURL(url);
            }
          }, 'image/png');
        };
        
        img.src = video.videoUrl;
      }
      
    } catch (error) {
      console.error('Download failed:', error);
      
      // Fallback: direct download of the image/video
      if (video.videoUrl) {
        const filename = VideoUtils.generateFilename(video.videoId || 'pov-video');
        VideoUtils.downloadVideo(video.videoUrl, filename);
      }
    }
  }, [video.videoId, video.videoUrl, video.subtitles]);

  const handleShare = useCallback(async () => {
    if (navigator.share && video.videoUrl) {
      try {
        await navigator.share({
          title: 'POV Historical Video',
          text: 'Check out this amazing POV historical video!',
          url: video.videoUrl,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Fallback: copy to clipboard
      if (video.videoUrl) {
        navigator.clipboard.writeText(video.videoUrl);
      }
    }
  }, [video.videoUrl]);

  const handleFullscreen = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Your POV Historical Video</CardTitle>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            Ready
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Video Container */}
        <div className="relative aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden max-w-sm mx-auto group">
          {/* Video Element */}
          <div className="relative w-full h-full">
            {video.videoUrl?.includes('.mp4') || video.videoUrl?.includes('video') ? (
              <video
                ref={videoRef}
                src={video.videoUrl}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                poster={video.thumbnailUrl}
              />
            ) : (
              <img
                src={video.videoUrl}
                alt="Generated POV historical video"
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Video Overlay Controls */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Center Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full w-16 h-16"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </Button>
              </div>

              {/* Top Controls */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  onClick={handleMuteToggle}
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 backdrop-blur-sm border-0 rounded-full w-10 h-10 p-0"
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-white" />
                  )}
                </Button>
                <Button
                  onClick={handleFullscreen}
                  size="sm"
                  className="bg-black/50 hover:bg-black/70 backdrop-blur-sm border-0 rounded-full w-10 h-10 p-0"
                >
                  <Maximize className="w-4 h-4 text-white" />
                </Button>
              </div>

              {/* Bottom Progress Bar */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/20 rounded-full h-1 mb-2">
                  <div 
                    className="bg-white rounded-full h-1 transition-all duration-300"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
            
            {/* Subtitle Overlay */}
            {video.subtitles && (
              <div className="absolute bottom-16 left-4 right-4">
                <div className="bg-black/70 rounded px-3 py-2 text-center backdrop-blur-sm">
                  <p className="text-white text-sm font-medium">
                    {video.subtitles}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Info */}
        <div className="text-center space-y-2">
          <p className="text-gray-300 text-sm">
            6-second POV historical video • 1080x1920 • MP4
          </p>
          {video.progress === 100 && (
            <p className="text-green-400 text-xs">
              Generated with Blackbox AI (GPT-5 + Flux + Veo-3)
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Secondary Actions */}
        <div className="flex justify-between items-center pt-2">
          <Button
            onClick={() => setIsLiked(!isLiked)}
            variant="ghost"
            size="sm"
            className={`${isLiked ? 'text-red-400' : 'text-gray-400'} hover:text-red-400`}
          >
            <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Liked' : 'Like'}
          </Button>
          
          <Button
            onClick={onReset}
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            New Video
          </Button>
        </div>

        {/* Video Metadata */}
        {video.videoId && (
          <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-800">
            Video ID: {video.videoId}
          </div>
        )}
      </CardContent>
    </Card>
  );
}