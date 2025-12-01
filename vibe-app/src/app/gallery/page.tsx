"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Play, 
  Download, 
  Clock,
  Calendar,
  Film,
  Trash2,
  Eye
} from "lucide-react";
import Link from "next/link";
import { VideoGalleryItem } from "@/types/video";
import { VideoUtils } from "@/lib/video-utils";

export default function GalleryPage() {
  const [videos, setVideos] = useState<VideoGalleryItem[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<VideoGalleryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  const historicalPeriods = [
    "all",
    "Medieval",
    "Renaissance", 
    "Pirate Age",
    "Wild West",
    "Ancient Rome",
    "Viking Age",
    "Ancient Egypt",
    "Feudal Japan"
  ];

  const durations = [
    { value: "all", label: "Todas as durações" },
    { value: "10", label: "10 segundos" },
    { value: "20", label: "20 segundos" },
    { value: "30", label: "30 segundos" }
  ];

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterVideos();
  }, [videos, searchTerm, selectedPeriod, selectedDuration]);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      // Simulate loading videos from localStorage or API
      const savedVideos = localStorage.getItem('pov-videos');
      if (savedVideos) {
        const parsedVideos = JSON.parse(savedVideos);
        setVideos(parsedVideos);
      } else {
        // Create some demo videos for showcase
        const demoVideos: VideoGalleryItem[] = [
          {
            id: "demo_1",
            prompt: "You wake up as a pirate in 1700, wooden ship cabin, stormy night",
            duration: 20,
            thumbnailUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/82f3f840-64e2-4e99-bebe-2038ab2fdadd.png",
            videoUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/96d8e0ee-c46e-44bf-9be0-01ad0e6f51a5.png",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            historicalPeriod: "Pirate Age",
            status: "completed"
          },
          {
            id: "demo_2", 
            prompt: "You're a knight in medieval castle, dawn breaking through stone windows",
            duration: 15,
            thumbnailUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cdddde1e-d10e-4375-801d-e2d224717c35.png",
            videoUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cd6ce521-fa8b-4cf7-a291-828f67f046ce.png",
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            historicalPeriod: "Medieval",
            status: "completed"
          },
          {
            id: "demo_3",
            prompt: "You're an Egyptian pharaoh in ancient tomb, golden treasures gleaming",
            duration: 30,
            thumbnailUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/57597abc-6108-418c-a9ba-c71caf199386.png",
            videoUrl: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/98b1c1cf-e169-41eb-898e-afcf46d69e0d.png",
            createdAt: new Date(Date.now() - 259200000).toISOString(),
            historicalPeriod: "Ancient Egypt",
            status: "completed"
          }
        ];
        setVideos(demoVideos);
        localStorage.setItem('pov-videos', JSON.stringify(demoVideos));
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterVideos = () => {
    let filtered = videos;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(video => 
        video.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.historicalPeriod.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by historical period
    if (selectedPeriod !== "all") {
      filtered = filtered.filter(video => 
        video.historicalPeriod === selectedPeriod
      );
    }

    // Filter by duration
    if (selectedDuration !== "all") {
      const duration = parseInt(selectedDuration);
      filtered = filtered.filter(video => 
        Math.abs(video.duration - duration) <= 5 // Allow 5 second tolerance
      );
    }

    setFilteredVideos(filtered);
  };

  const handleDownload = async (video: VideoGalleryItem) => {
    try {
      const response = await fetch(`/api/download/${video.id}`);
      const downloadInfo = await response.json();
      
      if (downloadInfo.success) {
        const filename = VideoUtils.generateFilename(video.prompt);
        VideoUtils.downloadVideo(downloadInfo.downloadUrl, filename);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleDelete = (videoId: string) => {
    const updatedVideos = videos.filter(v => v.id !== videoId);
    setVideos(updatedVideos);
    localStorage.setItem('pov-videos', JSON.stringify(updatedVideos));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">Meus Vídeos</h1>
          </div>
        </div>
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400 border-purple-500/30">
          {filteredVideos.length} vídeos
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gray-900/50 border-gray-800 mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por prompt ou período histórico..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Filtros:</span>
              </div>
              
              {/* Period Filter */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
              >
                {historicalPeriods.map(period => (
                  <option key={period} value={period}>
                    {period === "all" ? "Todos os períodos" : period}
                  </option>
                ))}
              </select>

              {/* Duration Filter */}
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm text-white"
              >
                {durations.map(duration => (
                  <option key={duration.value} value={duration.value}>
                    {duration.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Videos Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="bg-gray-900/50 border-gray-800 animate-pulse">
              <CardContent className="p-4">
                <div className="aspect-[9/16] bg-gray-700 rounded-lg mb-3"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredVideos.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="pt-12 pb-12 text-center">
            <Film className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {videos.length === 0 ? "Nenhum vídeo criado ainda" : "Nenhum vídeo encontrado"}
            </h3>
            <p className="text-gray-500 mb-6">
              {videos.length === 0 
                ? "Crie seu primeiro vídeo POV histórico!" 
                : "Tente ajustar os filtros de busca."
              }
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                <Film className="w-4 h-4 mr-2" />
                Criar Vídeo
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="bg-gray-900/50 border-gray-800 hover:border-gray-700 transition-colors">
              <CardContent className="p-4">
                {/* Video Thumbnail */}
                <div className="relative aspect-[9/16] bg-gray-800 rounded-lg overflow-hidden mb-3 group">
                  <img
                    src={video.thumbnailUrl}
                    alt={`Thumbnail: ${video.prompt}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="lg"
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-full"
                    >
                      <Play className="w-6 h-6 text-white ml-1" />
                    </Button>
                  </div>
                  
                  {/* Duration Badge */}
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-black/70 text-white border-0 text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      {video.duration}s
                    </Badge>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-2 left-2">
                    <Badge 
                      variant="secondary" 
                      className={`border-0 text-xs ${
                        video.status === 'completed' 
                          ? 'bg-green-500/20 text-green-400' 
                          : video.status === 'processing'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {video.status === 'completed' ? 'Pronto' : 
                       video.status === 'processing' ? 'Processando' : 'Erro'}
                    </Badge>
                  </div>
                </div>

                {/* Video Info */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed">
                    {video.prompt}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(video.createdAt)}</span>
                    </div>
                    <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                      {video.historicalPeriod}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleDownload(video)}
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Ver
                  </Button>
                  <Button
                    onClick={() => handleDelete(video.id)}
                    size="sm"
                    variant="outline"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}