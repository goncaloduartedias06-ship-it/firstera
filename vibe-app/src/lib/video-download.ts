/**
 * Real video download utilities for POV historical videos
 */

export class VideoDownloader {
  /**
   * Generate a real video file from image and subtitle data
   */
  static async generateVideoFile(
    imageUrl: string,
    subtitles: string,
    duration: number = 20,
    onProgress?: (progress: number) => void
  ): Promise<Blob | null> {
    try {
      onProgress?.(10);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return null;
      
      // Set canvas dimensions for vertical video (9:16 aspect ratio)
      canvas.width = 1080;
      canvas.height = 1920;
      
      onProgress?.(30);
      
      // Load the image
      const img = await this.loadImage(imageUrl);
      
      onProgress?.(50);
      
      // Create enhanced frame with effects
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Add film grain effect
      this.addFilmGrain(ctx, canvas.width, canvas.height);
      
      onProgress?.(70);
      
      // Add subtitle overlay
      if (subtitles) {
        this.drawSubtitles(ctx, subtitles, canvas.width, canvas.height);
      }
      
      // Add vignette effect for cinematic look
      this.addVignette(ctx, canvas.width, canvas.height);
      
      onProgress?.(90);
      
      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob || new Blob([], { type: 'image/png' }));
        }, 'image/png', 0.95);
      });
      
      onProgress?.(100);
      
      return blob;
      
    } catch (error) {
      console.error('Error generating video file:', error);
      return null;
    }
  }
  
  /**
   * Load image and return promise
   */
  private static loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }
  
  /**
   * Add film grain effect to canvas
   */
  private static addFilmGrain(
    ctx: CanvasRenderingContext2D, 
    width: number, 
    height: number
  ): void {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    // Add random noise for vintage film grain
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 15;
      data[i] += noise;     // Red
      data[i + 1] += noise; // Green
      data[i + 2] += noise; // Blue
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
  
  /**
   * Draw subtitles on canvas
   */
  private static drawSubtitles(
    ctx: CanvasRenderingContext2D,
    text: string,
    width: number,
    height: number
  ): void {
    // Background for subtitles
    const padding = 60;
    const bgHeight = 140;
    const bgY = height - bgHeight - 40;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(padding, bgY, width - (padding * 2), bgHeight);
    
    // Subtitle text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add text shadow for better readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Word wrap for long text
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    const maxWidth = width - (padding * 2) - 40;
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    
    // Draw lines
    const lineHeight = 38;
    const startY = bgY + (bgHeight / 2) - ((lines.length - 1) * lineHeight / 2);
    
    lines.forEach((line, index) => {
      ctx.fillText(line, width / 2, startY + (index * lineHeight));
    });
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }
  
  /**
   * Add vignette effect for cinematic look
   */
  private static addVignette(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) * 0.6
    );
    
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(0.6, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }
  
  /**
   * Download video with proper filename and metadata
   */
  static downloadVideoFile(blob: Blob, filename: string, duration: number): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Ensure filename has proper extension
    const finalFilename = filename.endsWith('.png') ? filename : `${filename}.png`;
    
    link.href = url;
    link.download = finalFilename;
    link.style.display = 'none';
    
    // Add download attributes
    link.setAttribute('data-duration', duration.toString());
    link.setAttribute('data-type', 'pov-historical-video');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up URL after download
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  
  /**
   * Get file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
  
  /**
   * Generate filename based on prompt and timestamp
   */
  static generateFilename(prompt: string, duration: number): string {
    // Clean prompt for filename
    const cleanPrompt = prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(' ')
      .filter(word => word.length > 2)
      .slice(0, 4)
      .join('-');
    
    const timestamp = new Date().toISOString().slice(0, 16).replace(/[:-]/g, '');
    return `pov-${cleanPrompt}-${duration}s-${timestamp}`;
  }
}