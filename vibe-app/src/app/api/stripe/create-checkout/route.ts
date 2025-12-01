import { NextRequest, NextResponse } from 'next/server';
import { StripeService } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { planId, userId } = await request.json();

    if (!planId || !userId) {
      return NextResponse.json(
        { error: 'Plan ID and User ID are required' },
        { status: 400 }
      );
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const successUrl = `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/subscription/cancel`;

    const session = await StripeService.createCheckoutSession(
      planId,
      userId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}