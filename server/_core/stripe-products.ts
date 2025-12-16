/**
 * Stripe Products Configuration
 * 
 * This file defines the SR17018 products for Stripe integration.
 * Products are created in Stripe and referenced here by their price IDs.
 */

export interface StripeProduct {
  id: string;
  name: string;
  weight: string;
  priceInCents: number;
  stripePriceId?: string; // Will be set after creating in Stripe
  freeShipping: boolean;
}

export const SR17018_PRODUCTS: StripeProduct[] = [
  {
    id: '1g',
    name: 'SR17018 - 1 Gram',
    weight: '1g',
    priceInCents: 6000, // $60.00
    freeShipping: false,
  },
  {
    id: '3g',
    name: 'SR17018 - 3 Grams',
    weight: '3g',
    priceInCents: 18000, // $180.00
    freeShipping: true,
  },
  {
    id: '5g',
    name: 'SR17018 - 5 Grams',
    weight: '5g',
    priceInCents: 29000, // $290.00
    freeShipping: true,
  },
  {
    id: '10g',
    name: 'SR17018 - 10 Grams',
    weight: '10g',
    priceInCents: 49000, // $490.00
    freeShipping: true,
  },
];

/**
 * Get product by weight
 */
export function getProductByWeight(weight: string): StripeProduct | undefined {
  return SR17018_PRODUCTS.find(p => p.weight === weight);
}

/**
 * Get product by ID
 */
export function getProductById(id: string): StripeProduct | undefined {
  return SR17018_PRODUCTS.find(p => p.id === id);
}
