export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  videoCredits: number;
  stripePriceId: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
}

export interface UserCredits {
  userId: string;
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  lastReset: string;
  nextReset: string;
}

export interface VideoGenerationCost {
  duration10s: number;
  duration20s: number;
  duration30s: number;
}

export interface PaymentSession {
  sessionId: string;
  url: string;
  planId: string;
}