import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

declare global {
  interface Window {
    Square?: any;
  }
}

interface SquarePaymentFormProps {
  applicationId: string;
  locationId?: string;
  onPaymentSuccess: (sourceId: string) => void;
  onPaymentError: (error: string) => void;
  isProcessing: boolean;
  total: number;
}

export default function SquarePaymentForm({
  applicationId,
  onPaymentSuccess,
  onPaymentError,
  isProcessing,
  total,
}: SquarePaymentFormProps) {
  const [isSquareLoaded, setIsSquareLoaded] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [card, setCard] = useState<any>(null);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  // Step 1: Load Square SDK script
  useEffect(() => {
    if (window.Square) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
    script.async = true;
    script.onload = () => {
      setIsScriptLoaded(true);
    };
    script.onerror = () => {
      onPaymentError('Failed to load Square payment form');
    };
    document.head.appendChild(script);
  }, [onPaymentError]);

  // Step 2: Initialize Square payment form after both script and DOM are ready
  useEffect(() => {
    if (!isScriptLoaded || !cardContainerRef.current) {
      return;
    }

    const initializeSquare = async () => {
      try {
        if (!window.Square) {
          throw new Error('Square SDK not loaded');
        }

        const payments = window.Square.payments(applicationId, 'sandbox');
        const cardElement = await payments.card();
        await cardElement.attach(cardContainerRef.current);
        
        setCard(cardElement);
        setIsSquareLoaded(true);
      } catch (error: any) {
        console.error('Square initialization error:', error);
        onPaymentError('Failed to initialize payment form');
      }
    };

    initializeSquare();

    return () => {
      if (card) {
        card.destroy();
      }
    };
  }, [isScriptLoaded, applicationId, onPaymentError]);

  const handlePayment = async () => {
    if (!card || isTokenizing) return;

    setIsTokenizing(true);

    try {
      const result = await card.tokenize();
      
      if (result.status === 'OK') {
        onPaymentSuccess(result.token);
      } else {
        let errorMessage = 'Payment failed';
        
        if (result.errors) {
          errorMessage = result.errors.map((error: any) => error.message).join(', ');
        }
        
        onPaymentError(errorMessage);
      }
    } catch (error: any) {
      console.error('Tokenization error:', error);
      onPaymentError('Payment processing failed');
    } finally {
      setIsTokenizing(false);
    }
  };

  if (!isSquareLoaded) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading payment form...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Card Information</label>
          <div 
            ref={cardContainerRef}
            className="border rounded-md p-3 min-h-[60px] bg-background"
            style={{
              // Square card styling
              '--sq-input-border-radius': '6px',
              '--sq-input-border-color': 'hsl(var(--border))',
              '--sq-input-background-color': 'hsl(var(--background))',
              '--sq-input-text-color': 'hsl(var(--foreground))',
              '--sq-input-font-family': 'inherit',
            } as React.CSSProperties}
          />
        </div>
        
        <div className="text-xs text-muted-foreground">
          <p>• Test with card number: 4111 1111 1111 1111</p>
          <p>• Use any future expiry date and any 3-digit CVV</p>
          <p>• Your payment information is secure and encrypted</p>
        </div>

        <Button 
          onClick={handlePayment}
          disabled={isTokenizing || isProcessing}
          className="w-full"
          size="lg"
        >
          {isTokenizing || isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isTokenizing ? 'Processing...' : 'Completing Order...'}
            </>
          ) : (
            `Pay $${total.toFixed(2)}`
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
