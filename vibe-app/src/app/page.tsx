"use client";

import { Film, Images, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import VideoGenerator from "@/components/VideoGenerator";
import { VideoGenerationResponse } from "@/types/video";
import Link from "next/link";

export default function HomePage() {
  const handleVideoGenerated = (video: VideoGenerationResponse) => {
    console.log('Video generated:', video);
    // Additional handling if needed
  };

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className="text-center mb-8 pt-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1"></div>
          <div className="flex items-center gap-2">
            <Film className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              POV Historical Videos
            </h1>
          </div>
          <div className="flex-1 flex justify-end gap-2">
            <Link href="/subscription">
              <Button size="sm" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold">
                <Crown className="w-4 h-4 mr-2" />
                Pro €10/mês
              </Button>
            </Link>
            <Link href="/gallery">
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Images className="w-4 h-4 mr-2" />
                Galeria
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Generate cinematic first-person historical videos with AI. Experience history through your own eyes.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            GPT-5 Enhanced
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            Flux Imaging
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            Veo-3 Animation
          </span>
        </div>
      </div>

      {/* Main Video Generator Component */}
      <VideoGenerator onVideoGenerated={handleVideoGenerated} />
    </div>
  );
}