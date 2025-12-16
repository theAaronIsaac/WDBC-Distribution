import { describe, it, expect } from 'vitest';
import { SquareClient, SquareEnvironment } from 'square';

describe('Square Simple API Test', () => {
  it('should connect to Square and retrieve merchant info', async () => {
    const client = new SquareClient({
      accessToken: process.env.SQUARE_ACCESS_TOKEN,
      environment: process.env.SQUARE_ENVIRONMENT === 'production' 
        ? SquareEnvironment.Production 
        : SquareEnvironment.Sandbox,
    });

    console.log('Testing Square API connection...');
    console.log('Environment:', process.env.SQUARE_ENVIRONMENT);
    console.log('App ID:', process.env.SQUARE_APPLICATION_ID?.substring(0, 30) + '...');
    
    try {
      // Try to retrieve merchant/account info (simpler endpoint)
      const response = await client.merchants.list();
      
      console.log('✅ API call successful!');
      console.log('Response:', JSON.stringify(response, null, 2));
      
      expect(response).toBeDefined();
    } catch (error: any) {
      console.log('❌ API call failed');
      console.log('Error:', error.message);
      console.log('Status:', error.statusCode);
      console.log('Body:', JSON.stringify(error.errors || error.body, null, 2));
      throw error;
    }
  });
});
