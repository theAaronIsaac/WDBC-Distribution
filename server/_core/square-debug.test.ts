import { describe, it, expect } from 'vitest';

describe('Square Environment Variables Debug', () => {
  it('should have Square environment variables set', () => {
    console.log('=== Square Environment Variables ===');
    console.log('SQUARE_APPLICATION_ID:', process.env.SQUARE_APPLICATION_ID ? `${process.env.SQUARE_APPLICATION_ID.substring(0, 20)}...` : 'NOT SET');
    console.log('SQUARE_ACCESS_TOKEN:', process.env.SQUARE_ACCESS_TOKEN ? `${process.env.SQUARE_ACCESS_TOKEN.substring(0, 10)}...` : 'NOT SET');
    console.log('SQUARE_ENVIRONMENT:', process.env.SQUARE_ENVIRONMENT || 'NOT SET');
    console.log('=====================================');
    
    expect(process.env.SQUARE_APPLICATION_ID).toBeDefined();
    expect(process.env.SQUARE_ACCESS_TOKEN).toBeDefined();
    expect(process.env.SQUARE_ENVIRONMENT).toBeDefined();
    
    expect(process.env.SQUARE_APPLICATION_ID).toContain('sandbox-sq0idb-');
    expect(process.env.SQUARE_ACCESS_TOKEN).toMatch(/^EAAA/);
    expect(process.env.SQUARE_ENVIRONMENT).toBe('sandbox');
  });
});
