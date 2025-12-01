"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Loader2, 
  Sparkles, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  Film,
  Wand2,
  Zap,
  Crown
} from "lucide-react";
import { VideoGenerationRequest, VideoGenerationResponse } from "@/types/video";
import { VideoUtils } from "@/lib/video-utils";
import VideoPlayer from "./VideoPlayer";
import ProgressIndicator from "./ProgressIndicator";

interface VideoGeneratorProps {
  onVideoGenerated?: (video: VideoGenerationResponse) => void;
}

export default function VideoGenerator({ onVideoGenerated }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState<10 | 20 | 30>(20);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<VideoGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");

  const examplePrompts = [
    "You wake up as a pirate in 1700, wooden ship cabin, stormy night",
    "You're a knight in medieval castle, dawn breaking through stone windows",
    "You're an Egyptian pharaoh in ancient tomb, golden treasures gleaming",
    "You're a Viking warrior on longship, approaching mysterious coastline",
    "You're a Wild West gunslinger in saloon, tension fills the air",
    "You're a Roman gladiator in Colosseum, crowd roaring above",
    "You're a samurai in feudal Japan, cherry blossoms falling around you",
    "You're a crusader knight approaching Jerusalem, holy city in distance"
  ];

  const historicalPeriods = [
    { name: "Medieval", era: "500-1500 AD", color: "bg-amber-500" },
    { name: "Renaissance", era: "1400-1600 AD", color: "bg-purple-500" },
    { name: "Pirate Age", era: "1650-1730 AD", color: "bg-blue-500" },
    { name: "Wild West", era: "1800s AD", color: "bg-orange-500" },
    { name: "Ancient Rome", era: "27 BC-476 AD", color: "bg-red-500" },
    { name: "Viking Age", era: "793-1066 AD", color: "bg-gray-500" },
    { name: "Ancient Egypt", era: "3100-30 BC", color: "bg-yellow-500" },
    { name: "Feudal Japan", era: "1185-1868 AD", color: "bg-pink-500" }
  ];

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    setCurrentStep("Initializing video generation...");
    setGeneratedVideo(null);

    try {
      const request: VideoGenerationRequest = {
        prompt: prompt.trim(),
        duration: duration,
        sessionId: `session_${Date.now()}`
      };

      // Simulate progressive updates
      const progressSteps = [
        { step: "Analyzing your prompt with GPT-5...", progress: 10 },
        { step: "Enhancing narrative elements...", progress: 25 },
        { step: "Generating cinematic image with Flux...", progress: 45 },
        { step: "Creating 6-second video with Veo-3...", progress: 75 },
        { step: "Adding automatic subtitles...", progress: 90 },
        { step: "Finalizing your POV video...", progress: 100 }
      ];

      // Real step-by-step progress with proper timing
      for (const { step, progress: stepProgress } of progressSteps) {
        setCurrentStep(step);
        setProgress(stepProgress);
        
        let stepTime = 2000; // Default 2 seconds
        
        if (stepProgress === 45) {
          stepTime = 15000; // Image generation: 15 seconds
        } else if (stepProgress === 75) {
          // Video generation: 2-5 minutes based on duration
          stepTime = (duration * 4000) + 60000; // 1-4 minutes base + duration factor
        } else if (stepProgress === 90) {
          stepTime = 5000; // Subtitle generation: 5 seconds
        }
        
        await new Promise(resolve => setTimeout(resolve, stepTime));
      }

      // Make API call
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate video');
      }

      const result: VideoGenerationResponse = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Video generation failed');
      }

      setGeneratedVideo(result);
      setCurrentStep("Video generation completed!");
      
      // Save video to localStorage for gallery
      if (result.success && result.videoId) {
        const savedVideos = JSON.parse(localStorage.getItem('pov-videos') || '[]');
        const newVideo = {
          id: result.videoId,
          prompt: prompt.trim(),
          duration: duration,
          thumbnailUrl: result.thumbnailUrl || result.videoUrl,
          videoUrl: result.videoUrl,
          createdAt: new Date().toISOString(),
          historicalPeriod: VideoUtils.extractHistoricalPeriod(prompt),
          status: 'completed' as const
        };
        
        savedVideos.unshift(newVideo); // Add to beginning
        localStorage.setItem('pov-videos', JSON.stringify(savedVideos.slice(0, 50))); // Keep only last 50
      }
      
      onVideoGenerated?.(result);

    } catch (err) {
      console.error('Video generation error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setCurrentStep("Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, onVideoGenerated]);

  const handlePromptSelect = useCallback((selectedPrompt: string) => {
    setPrompt(selectedPrompt);
    setError(null);
  }, []);

  const handleReset = useCallback(() => {
    setGeneratedVideo(null);
    setPrompt("");
    setProgress(0);
    setCurrentStep("");
    setError(null);
  }, []);

  const estimatedTime = VideoUtils.estimateGenerationTime(prompt);
  const historicalPeriod = VideoUtils.extractHistoricalPeriod(prompt);

  return (
    <div className="space-y-6">
      {/* Historical Periods */}
      <div>
        <h3 className="text-sm font-medium text-gray-300 mb-3">Popular Time Periods</h3>
        <div className="flex flex-wrap gap-2">
          {historicalPeriods.map((period) => (
            <Badge
              key={period.name}
              variant="secondary"
              className={`${period.color} text-white border-0 text-xs cursor-pointer hover:opacity-80 transition-opacity`}
              onClick={() => {
                const periodPrompt = `You're in ${period.name.toLowerCase()} times, ${period.era}`;
                setPrompt(periodPrompt);
              }}
            >
              {period.name} ({period.era})
            </Badge>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            Describe Your POV Scene
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="You wake up as a pirate in 1700, wooden ship cabin, stormy night..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 min-h-[100px] resize-none"
            maxLength={200}
            disabled={isGenerating}
          />
          
          {/* Duration Selector with Credits */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300">Duração do Vídeo</label>
              <div className="flex items-center gap-1 text-xs text-yellow-400">
                <Zap className="w-3 h-3" />
                <span>5 créditos restantes</span>
              </div>
            </div>
            <div className="flex gap-2">
              {[10, 20, 30].map((dur) => {
                const credits = dur === 10 ? 1 : dur === 20 ? 2 : 3;
                return (
                  <Button
                    key={dur}
                    type="button"
                    onClick={() => setDuration(dur as 10 | 20 | 30)}
                    variant={duration === dur ? "default" : "outline"}
                    size="sm"
                    className={`flex-1 flex-col h-auto py-2 ${
                      duration === dur 
                        ? "bg-purple-600 hover:bg-purple-700 text-white" 
                        : "border-gray-600 text-gray-300 hover:bg-gray-800"
                    }`}
                    disabled={isGenerating}
                  >
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{dur}s</span>
                    </div>
                    <div className="text-xs opacity-75">
                      {credits} crédito{credits > 1 ? 's' : ''}
                    </div>
                  </Button>
                );
              })}
            </div>
            <div className="text-xs text-gray-500 text-center">
              Precisa de mais créditos? 
              <a href="/subscription" className="text-yellow-400 hover:text-yellow-300 ml-1">
                Upgrade para Pro
              </a>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>{prompt.length}/200 characters</span>
            <div className="flex items-center gap-4">
              {prompt && (
                <span className="text-purple-400">
                  Período: {historicalPeriod}
                </span>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>~{Math.round((estimatedTime * (duration / 20)) + (duration * 4))} segundos para gerar</span>
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate POV Video
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert className="border-red-500/50 bg-red-500/10">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-200">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Generation Progress */}
      {isGenerating && (
        <ProgressIndicator
          progress={progress}
          currentStep={currentStep}
          estimatedTime={estimatedTime}
        />
      )}

      {/* Success Message */}
      {generatedVideo && generatedVideo.success && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription className="text-green-200">
            Your POV historical video has been generated successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Generated Video */}
      {generatedVideo && generatedVideo.videoUrl && (
        <VideoPlayer
          video={generatedVideo}
          onReset={handleReset}
        />
      )}

      {/* Example Prompts */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Film className="w-5 h-5 text-blue-400" />
            Example Prompts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {examplePrompts.map((example, index) => (
              <button
                key={index}
                onClick={() => handlePromptSelect(example)}
                disabled={isGenerating}
                className="w-full text-left p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="text-sm text-gray-300">{example}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}