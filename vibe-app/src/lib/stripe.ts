import { SubscriptionPlan, PaymentSession } from '@/types/subscription';

// Subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'pro-monthly',
    name: 'POV Pro Monthly',
    price: 10,
    currency: 'eur',
    interval: 'month',
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

// Video generation costs (in credits)
export const VIDEO_COSTS = {
  duration10s: 1,
  duration20s: 2,
  duration30s: 3
};

export class StripeService {
  /**
   * Create a checkout session for subscription
   */
  static async createCheckoutSession(
    planId: string,
    userId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<PaymentSession> {
    try {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
      if (!plan) {
        throw new Error('Invalid plan ID');
      }

      // For demo purposes, return a mock session
      return {
        sessionId: `cs_demo_${Date.now()}`,
        url: `https://checkout.stripe.com/demo?plan=${planId}`,
        planId: planId,
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error('Failed to create checkout session');
    }
  }

  /**
   * Create a customer portal session
   */
  static async createPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<string> {
    try {
      // For demo purposes, return a mock portal URL
      return `https://billing.stripe.com/demo?customer=${customerId}&return=${returnUrl}`;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw new Error('Failed to create portal session');
    }
  }

  /**
   * Get subscription by ID
   */
  static async getSubscription(subscriptionId: string) {
    try {
      // For demo purposes, return a mock subscription
      return {
        id: subscriptionId,
        status: 'active',
        current_period_end: Date.now() + 30 * 24 * 60 * 60 * 1000
      };
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw new Error('Failed to retrieve subscription');
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(subscriptionId: string) {
    try {
      console.log('Canceling subscription:', subscriptionId);
      return { id: subscriptionId, cancel_at_period_end: true };
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Reactivate subscription
   */
  static async reactivateSubscription(subscriptionId: string) {
    try {
      console.log('Reactivating subscription:', subscriptionId);
      return { id: subscriptionId, cancel_at_period_end: false };
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw new Error('Failed to reactivate subscription');
    }
  }

  /**
   * Calculate video generation cost
   */
  static calculateVideoCost(duration: 10 | 20 | 30): number {
    switch (duration) {
      case 10:
        return VIDEO_COSTS.duration10s;
      case 20:
        return VIDEO_COSTS.duration20s;
      case 30:
        return VIDEO_COSTS.duration30s;
      default:
        return VIDEO_COSTS.duration20s;
    }
  }
}