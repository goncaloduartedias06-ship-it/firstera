import { SubtitleSegment, VideoMetadata } from '@/types/video';

/**
 * Utility functions for video processing and subtitle handling
 */

export class VideoUtils {
  /**
   * Parse subtitle text into timed segments
   */
  static parseSubtitles(subtitleText: string): SubtitleSegment[] {
    // For demo purposes, create a simple subtitle segment
    return [
      {
        start: 0,
        end: 6,
        text: subtitleText
      }
    ];
  }

  /**
   * Format subtitle segments into WebVTT format
   */
  static formatSubtitlesToWebVTT(segments: SubtitleSegment[]): string {
    let webvtt = 'WEBVTT\n\n';
    
    segments.forEach((segment, index) => {
      const startTime = this.formatTime(segment.start);
      const endTime = this.formatTime(segment.end);
      
      webvtt += `${index + 1}\n`;
      webvtt += `${startTime} --> ${endTime}\n`;
      webvtt += `${segment.text}\n\n`;
    });
    
    return webvtt;
  }

  /**
   * Format time in seconds to WebVTT time format (HH:MM:SS.mmm)
   */
  private static formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const milliseconds = Math.floor((seconds % 1) * 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${milliseconds
      .toString()
      .padStart(3, '0')}`;
  }

  /**
   * Generate video metadata
   */
  static generateVideoMetadata(
    title: string,
    description: string,
    duration: number = 6
  ): VideoMetadata {
    return {
      title,
      description,
      duration,
      format: 'mp4',
      resolution: '1080x1920',
      fileSize: Math.floor(Math.random() * 10000000) + 5000000, // 5-15MB
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Generate download filename based on prompt
   */
  static generateFilename(prompt: string): string {
    // Extract key words from prompt for filename
    const cleanPrompt = prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 4)
      .join('-');
    
    const timestamp = new Date().toISOString().slice(0, 10);
    return `pov-${cleanPrompt}-${timestamp}.mp4`;
  }

  /**
   * Validate video URL format
   */
  static isValidVideoUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Calculate estimated generation time based on prompt complexity
   */
  static estimateGenerationTime(prompt: string): number {
    const baseTime = 25; // Base 25 seconds
    const complexityFactors = [
      'storm', 'battle', 'crowd', 'fire', 'magic', 'dragon', 'army'
    ];
    
    let additionalTime = 0;
    complexityFactors.forEach(factor => {
      if (prompt.toLowerCase().includes(factor)) {
        additionalTime += 5;
      }
    });
    
    return Math.min(baseTime + additionalTime, 60); // Max 60 seconds
  }

  /**
   * Extract historical period from prompt
   */
  static extractHistoricalPeriod(prompt: string): string {
    const periods = {
      'pirate': 'Golden Age of Piracy (1650-1730)',
      'knight': 'Medieval Period (500-1500)',
      'viking': 'Viking Age (793-1066)',
      'pharaoh': 'Ancient Egypt (3100-30 BC)',
      'gladiator': 'Roman Empire (27 BC-476 AD)',
      'gunslinger': 'American Old West (1800s)',
      'samurai': 'Feudal Japan (1185-1868)',
      'crusader': 'Crusades Era (1095-1291)'
    };

    const lowerPrompt = prompt.toLowerCase();
    for (const [keyword, period] of Object.entries(periods)) {
      if (lowerPrompt.includes(keyword)) {
        return period;
      }
    }
    
    return 'Historical Period';
  }

  /**
   * Create video blob URL for preview
   */
  static createVideoBlob(videoData: ArrayBuffer): string {
    const blob = new Blob([videoData], { type: 'video/mp4' });
    return URL.createObjectURL(blob);
  }

  /**
   * Download video file
   */
  static downloadVideo(videoUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}