import { describe, it, expect } from 'vitest';
import { SquareClient, SquareEnvironment } from 'square';

describe('Square Payment Integration', () => {
  it('should successfully connect to Square API with provided credentials', async () => {
    const client = new SquareClient({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: process.env.SQUARE_ENVIRONMENT === 'production' 
        ? SquareEnvironment.Production 
        : SquareEnvironment.Sandbox,
    });

    // Test that we can retrieve locations (basic API connectivity test)
    const response = await client.locations.list();
    
    expect(response.result).toBeDefined();
    expect(response.result.locations).toBeDefined();
    expect(Array.isArray(response.result.locations)).toBe(true);
    
    console.log('✅ Square API connection successful');
    console.log(`   Environment: ${process.env.SQUARE_ENVIRONMENT}`);
    console.log(`   Locations found: ${response.result.locations?.length || 0}`);
  });

  it('should create a test payment', async () => {
    const client = new SquareClient({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: process.env.SQUARE_ENVIRONMENT === 'production' 
        ? SquareEnvironment.Production 
        : SquareEnvironment.Sandbox,
    });

    // Get the first location ID (required for payments)
    const locationsResponse = await client.locations.list();
    const locationId = locationsResponse.result.locations?.[0]?.id;
    
    expect(locationId).toBeDefined();
    console.log(`   Using location ID: ${locationId}`);

    // Create a test payment using a Square test card token
    // In sandbox, we use a test source ID instead of a real card token
    const testSourceId = 'cnon:card-nonce-ok'; // Square's test card nonce
    
    const paymentResponse = await client.payments.create({
      sourceId: testSourceId,
      idempotencyKey: `test-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      amountMoney: {
        amount: BigInt(100), // $1.00 in cents
        currency: 'USD',
      },
      locationId: locationId!,
    });

    expect(paymentResponse.result).toBeDefined();
    expect(paymentResponse.result.payment).toBeDefined();
    expect(paymentResponse.result.payment?.status).toBe('COMPLETED');
    
    console.log('✅ Test payment created successfully');
    console.log(`   Payment ID: ${paymentResponse.result.payment?.id}`);
    console.log(`   Status: ${paymentResponse.result.payment?.status}`);
    console.log(`   Amount: $${Number(paymentResponse.result.payment?.amountMoney?.amount || 0) / 100}`);
  });
});
