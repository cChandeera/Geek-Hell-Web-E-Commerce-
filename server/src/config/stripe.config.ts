import Stripe from 'stripe';

export const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
});
