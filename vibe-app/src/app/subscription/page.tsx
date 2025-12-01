"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check, 
  ArrowLeft, 
  Zap, 
  Download, 
  Shield,
  Headphones,
  Sparkles
} from "lucide-react";
import Link from "next/link";

// Define subscription plans locally to avoid import issues
const SUBSCRIPTION_PLANS = [
  {
    id: 'pro-monthly',
    name: 'POV Pro Monthly',
    price: 10,
    currency: 'eur',
    interval: 'month' as const,
    features: [
      '100 vídeos POV por mês',
      'Todas as durações (10s, 20s, 30s)',
      'Download em HD',
      'Sem marca d\'água',
      'Suporte prioritário',
      'Acesso a novos períodos históricos'
    ],
    videoCredits: 100,
    stripePriceId: 'price_1234567890'
  }
];

export default function SubscriptionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubscribe = async (planId: string) => {
    setIsLoading(true);
    setSelectedPlan(planId);

    try {
      // Generate a user ID for demo purposes
      const userId = `user_${Date.now()}`;
      
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Erro ao criar subscrição. Tente novamente.');
    } finally {
      setIsLoading(false);
      setSelectedPlan(null);
    }
  };

  const plan = SUBSCRIPTION_PLANS[0]; // Pro Monthly plan

  return (
    <div className="min-h-screen p-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pt-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-yellow-400" />
          <h1 className="text-2xl font-bold text-white">POV Pro</h1>
        </div>
        <div></div>
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Crie Vídeos POV Históricos Ilimitados
          </h2>
        </div>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Transforme suas ideias em vídeos POV históricos cinematográficos com IA avançada. 
          Estilo TikTok profissional, qualidade de cinema.
        </p>
      </div>

      {/* Pricing Card */}
      <div className="max-w-md mx-auto mb-12">
        <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30 relative overflow-hidden">
          {/* Popular Badge */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
              MAIS POPULAR
            </Badge>
          </div>

          <CardHeader className="pb-4">
            <div className="flex items-center gap-3 mb-2">
              <Crown className="w-8 h-8 text-yellow-400" />
              <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">€{plan.price}</span>
              <span className="text-gray-400">/{plan.interval === 'month' ? 'mês' : 'ano'}</span>
            </div>
            <p className="text-gray-400 text-sm">
              Apenas €0,10 por vídeo POV histórico
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Features */}
            <div className="space-y-3">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Video Credits */}
            <div className="bg-black/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold text-white">Créditos Mensais</span>
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {plan.videoCredits} vídeos
              </div>
              <div className="text-sm text-gray-400">
                • 10s = 1 crédito • 20s = 2 créditos • 30s = 3 créditos
              </div>
            </div>

            {/* Subscribe Button */}
            <Button
              onClick={() => handleSubscribe(plan.id)}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 text-lg"
            >
              {isLoading && selectedPlan === plan.id ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processando...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Subscrever Agora
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              Cancele a qualquer momento. Sem compromissos.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="bg-gray-900/50 border-gray-800 text-center">
          <CardContent className="pt-6">
            <Download className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">Download HD</h3>
            <p className="text-sm text-gray-400">
              Vídeos em alta qualidade 1080x1920 prontos para TikTok
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 text-center">
          <CardContent className="pt-6">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">Sem Marca d'Água</h3>
            <p className="text-sm text-gray-400">
              Vídeos limpos, profissionais, prontos para publicar
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 text-center">
          <CardContent className="pt-6">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">IA Avançada</h3>
            <p className="text-sm text-gray-400">
              GPT-5, Flux e Veo-3 para máxima qualidade
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-gray-800 text-center">
          <CardContent className="pt-6">
            <Headphones className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="font-semibold text-white mb-2">Suporte VIP</h3>
            <p className="text-sm text-gray-400">
              Atendimento prioritário e suporte técnico
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="bg-gray-900/50 border-gray-800 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl text-white text-center">
            Perguntas Frequentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">
              Como funcionam os créditos?
            </h4>
            <p className="text-gray-400 text-sm">
              Cada vídeo consome créditos baseado na duração: 10s = 1 crédito, 20s = 2 créditos, 30s = 3 créditos. 
              Os créditos renovam mensalmente.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-2">
              Posso cancelar a qualquer momento?
            </h4>
            <p className="text-gray-400 text-sm">
              Sim! Pode cancelar a subscrição a qualquer momento. Continuará a ter acesso até ao final do período pago.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-2">
              Que tipo de vídeos posso criar?
            </h4>
            <p className="text-gray-400 text-sm">
              Vídeos POV históricos de qualquer época: piratas, cavaleiros, vikings, faraós, samurais, etc. 
              Estilo cinematográfico profissional.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}