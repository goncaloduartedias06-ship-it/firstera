export interface VideoGenerationRequest {
  prompt: string;
  duration: 10 | 20 | 30; // Video duration in seconds
  userId?: string;
  sessionId?: string;
}

export interface VideoGenerationResponse {
  success: boolean;
  videoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  subtitles?: string;
  error?: string;
  progress?: number;
  currentStep?: string;
  estimatedTime?: number;
}

export interface VideoStatus {
  videoId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  currentStep: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  subtitles?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface GenerationStep {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  startTime?: string;
  endTime?: string;
  error?: string;
}

export interface HistoricalPeriod {
  name: string;
  era: string;
  color: string;
  description?: string;
  keywords?: string[];
}

export interface VideoMetadata {
  title: string;
  description: string;
  duration: number;
  format: string;
  resolution: string;
  fileSize: number;
  createdAt: string;
}

export interface SubtitleSegment {
  start: number;
  end: number;
  text: string;
}

export interface VideoDownload {
  url: string;
  filename: string;
  format: 'mp4' | 'webm';
  quality: 'hd' | 'sd';
  blob?: Blob;
  size: number;
}

export interface VideoGalleryItem {
  id: string;
  prompt: string;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  createdAt: string;
  historicalPeriod: string;
  status: 'completed' | 'processing' | 'failed';
}