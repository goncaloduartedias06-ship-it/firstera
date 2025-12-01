import { NextRequest, NextResponse } from 'next/server';

const webhookSecret = 'demo_webhook_secret';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe signature' },
        { status: 400 }
      );
    }

    // For demo purposes, parse the body as JSON
    let event: any;

    try {
      event = JSON.parse(body);
    } catch (err) {
      console.error('Webhook body parsing failed:', err);
      return NextResponse.json(
        { error: 'Invalid body' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handleCheckoutCompleted(session);
        break;

      case 'customer.subscription.created':
        const createdSubscription = event.data.object;
        await handleSubscriptionCreated(createdSubscription);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object;
        await handleSubscriptionUpdated(updatedSubscription);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object;
        await handleSubscriptionDeleted(deletedSubscription);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object;
        await handlePaymentSucceeded(invoice);
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object;
        await handlePaymentFailed(failedInvoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: any) {
  console.log('Checkout completed:', session.id);
  
  // Here you would typically:
  // 1. Create user subscription record in database
  // 2. Grant user access to premium features
  // 3. Reset user credits for the new billing period
  
  const userId = session.client_reference_id;
  const planId = session.metadata?.planId;
  
  if (userId && planId) {
    // Save subscription to localStorage for demo
    const subscription = {
      userId,
      planId,
      status: 'active',
      stripeSubscriptionId: session.subscription,
      stripeCustomerId: session.customer,
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    console.log('Created subscription:', subscription);
  }
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('Subscription created:', subscription.id);
  // Handle subscription creation
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('Subscription updated:', subscription.id);
  // Handle subscription updates
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('Subscription deleted:', subscription.id);
  // Handle subscription cancellation
}

async function handlePaymentSucceeded(invoice: any) {
  console.log('Payment succeeded:', invoice.id);
  // Handle successful payment - reset credits, extend subscription
}

async function handlePaymentFailed(invoice: any) {
  console.log('Payment failed:', invoice.id);
  // Handle failed payment - notify user, suspend access
}