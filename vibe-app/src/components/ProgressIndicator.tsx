"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Brain, 
  Image, 
  Video, 
  Type,
  CheckCircle,
  Clock
} from "lucide-react";

interface ProgressIndicatorProps {
  progress: number;
  currentStep: string;
  estimatedTime?: number;
}

const getStepIcon = (step: string) => {
  if (step.includes('GPT-5') || step.includes('prompt')) return Brain;
  if (step.includes('image') || step.includes('Flux')) return Image;
  if (step.includes('video') || step.includes('Veo-3')) return Video;
  if (step.includes('subtitle')) return Type;
  if (step.includes('completed') || step.includes('ready')) return CheckCircle;
  return Loader2;
};

const getStepColor = (progress: number) => {
  if (progress >= 100) return 'text-green-400';
  if (progress >= 75) return 'text-blue-400';
  if (progress >= 50) return 'text-purple-400';
  if (progress >= 25) return 'text-yellow-400';
  return 'text-gray-400';
};

export default function ProgressIndicator({ 
  progress, 
  currentStep, 
  estimatedTime = 30 
}: ProgressIndicatorProps) {
  const StepIcon = getStepIcon(currentStep);
  const iconColor = getStepColor(progress);
  const isCompleted = progress >= 100;
  const isAnimating = !isCompleted && progress > 0;

  const steps = [
    { name: 'Prompt Analysis', range: [0, 25], icon: Brain, description: 'GPT-5 enhancing your prompt' },
    { name: 'Image Generation', range: [25, 50], icon: Image, description: 'Flux creating cinematic scene' },
    { name: 'Video Creation', range: [50, 85], icon: Video, description: 'Veo-3 animating your story' },
    { name: 'Subtitle Addition', range: [85, 95], icon: Type, description: 'Adding contextual subtitles' },
    { name: 'Finalization', range: [95, 100], icon: CheckCircle, description: 'Preparing your video' }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => 
      progress >= step.range[0] && progress <= step.range[1]
    );
  };

  const currentStepIndex = getCurrentStepIndex();
  const remainingTime = Math.max(0, Math.round(estimatedTime * (100 - progress) / 100));

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StepIcon 
                className={`w-5 h-5 ${iconColor} ${isAnimating ? 'animate-spin' : ''}`} 
              />
              <span className="text-gray-300 font-medium">Generating Video</span>
            </div>
            <Badge 
              variant="secondary" 
              className={`${isCompleted ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-purple-500/20 text-purple-400 border-purple-500/30'}`}
            >
              {progress}%
            </Badge>
          </div>

          {/* Current Step */}
          <div className="text-center">
            <p className="text-gray-300 text-sm mb-1">{currentStep}</p>
            {!isCompleted && remainingTime > 0 && (
              <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>~{remainingTime}s remaining</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress 
              value={progress} 
              className="h-2 bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step, index) => {
              const StepIconComponent = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = progress > step.range[1];
              const isUpcoming = progress < step.range[0];

              return (
                <div 
                  key={step.name}
                  className={`text-center p-2 rounded-lg border transition-all duration-300 ${
                    isActive 
                      ? 'border-purple-500/50 bg-purple-500/10' 
                      : isCompleted
                      ? 'border-green-500/50 bg-green-500/10'
                      : isUpcoming
                      ? 'border-gray-700 bg-gray-800/50'
                      : 'border-gray-700 bg-gray-800/50'
                  }`}
                >
                  <StepIconComponent 
                    className={`w-4 h-4 mx-auto mb-1 ${
                      isActive 
                        ? 'text-purple-400 animate-pulse' 
                        : isCompleted
                        ? 'text-green-400'
                        : 'text-gray-500'
                    }`} 
                  />
                  <p className={`text-xs font-medium ${
                    isActive 
                      ? 'text-purple-300' 
                      : isCompleted
                      ? 'text-green-300'
                      : 'text-gray-500'
                  }`}>
                    {step.name}
                  </p>
                </div>
              );
            })}
          </div>

          {/* AI Models Info */}
          <div className="flex justify-center gap-4 pt-2 border-t border-gray-800">
            <div className="text-center">
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                GPT-5
              </Badge>
              <p className="text-xs text-gray-500 mt-1">Text</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                Flux
              </Badge>
              <p className="text-xs text-gray-500 mt-1">Image</p>
            </div>
            <div className="text-center">
              <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                Veo-3
              </Badge>
              <p className="text-xs text-gray-500 mt-1">Video</p>
            </div>
          </div>

          {/* Completion Message */}
          {isCompleted && (
            <div className="text-center p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
              <p className="text-green-300 font-medium">Video Generated Successfully!</p>
              <p className="text-green-400/80 text-xs mt-1">
                Your POV historical video is ready to view and download
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}