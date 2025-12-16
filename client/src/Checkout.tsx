import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { Microscope, Loader2, Gift } from "lucide-react";
import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { APP_TITLE } from "@/const";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import SquarePaymentForm from "@/components/SquarePaymentForm";

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const { data: shippingRates, isLoading: loadingRates } = trpc.shipping.getRates.useQuery();
  const createOrder = trpc.orders.create.useMutation();

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    shippingCity: "",
    shippingState: "",
    shippingZip: "",
    shippingCountry: "USA",
    customerNotes: "",
  });

  const [selectedShipping, setSelectedShipping] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"square" | "btc">("square");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [squareSourceId, setSquareSourceId] = useState<string | null>(null);
  const [showSquareForm, setShowSquareForm] = useState(false);
  
  const processSquarePayment = trpc.orders.processSquarePayment.useMutation();

  // Check if order qualifies for free shipping (3g, 5g, or 10g)
  const qualifiesForFreeShipping = useMemo(() => {
    return items.some(item => item.weightGrams && [3, 5, 10].includes(item.weightGrams));
  }, [items]);

  // Find UPS 2nd Day Air rate
  const ups2ndDayRate = useMemo(() => {
    return shippingRates?.find(rate => 
      rate.carrier === "UPS" && rate.serviceName === "UPS 2nd Day Air"
    );
  }, [shippingRates]);

  // Auto-select UPS 2nd Day Air if qualifies for free shipping
  useMemo(() => {
    if (qualifiesForFreeShipping && ups2ndDayRate && !selectedShipping) {
      setSelectedShipping(ups2ndDayRate.id);
    }
  }, [qualifiesForFreeShipping, ups2ndDayRate, selectedShipping]);

  const selectedRate = shippingRates?.find((r) => r.id === selectedShipping);
  const shippingCost = qualifiesForFreeShipping && selectedRate?.carrier === "UPS" && selectedRate?.serviceName === "UPS 2nd Day Air" 
    ? 0 
    : (selectedRate?.baseRate || 0);
  const total = subtotal + shippingCost;

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!selectedRate) {
      toast.error("Please select a shipping method");
      return;
    }

    // For Square payments, show the payment form instead of creating order immediately
    if (paymentMethod === "square") {
      setShowSquareForm(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // For Bitcoin, create order without payment processing
      const result = await createOrder.mutateAsync({
        ...formData,
        shippingCarrier: selectedRate.carrier,
        shippingService: selectedRate.serviceName,
        shippingCost,
        paymentMethod,
        subtotal,
        total,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: item.priceUsd,
        })),
      });

      clearCart();
      setLocation(`/order/${result.orderNumber}`);
    } catch (error) {
      toast.error("Failed to create order. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSquarePaymentSuccess = async (sourceId: string) => {
    setIsSubmitting(true);
    
    try {
      // First create the order
      const orderResult = await createOrder.mutateAsync({
        ...formData,
        shippingCarrier: selectedRate!.carrier,
        shippingService: selectedRate!.serviceName,
        shippingCost,
        paymentMethod: "square",
        subtotal,
        total,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          pricePerUnit: item.priceUsd,
        })),
      });

      // Then process the Square payment
      await processSquarePayment.mutateAsync({
        orderNumber: orderResult.orderNumber,
        sourceId: sourceId,
        amountCents: Math.round(total * 100), // Convert to cents
      });

      toast.success("Payment successful!");
      clearCart();
      setLocation(`/order/${orderResult.orderNumber}`);
    } catch (error: any) {
      toast.error(error.message || "Payment failed. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSquarePaymentError = (error: string) => {
    toast.error(error);
    setIsSubmitting(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <Microscope className="h-6 w-6 text-white" />
                <h1 className="text-xl font-bold">{APP_TITLE}</h1>
              </div>
            </Link>
          </div>
        </header>
        <div className="container py-12">
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-6">
                Add items to your cart before checking out
              </p>
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Microscope className="h-6 w-6 text-white" />
              <h1 className="text-xl font-bold">{APP_TITLE}</h1>
            </div>
          </Link>
        </div>
      </header>

      {/* Free Shipping Banner */}
      {qualifiesForFreeShipping && (
        <div className="border-b bg-primary/10 py-3">
          <div className="container flex items-center justify-center gap-2 text-sm">
            <Gift className="h-4 w-4 text-white" />
            <span className="font-medium text-white">
              Your order qualifies for FREE UPS 2nd Day Air shipping!
            </span>
          </div>
        </div>
      )}

      {/* Checkout Form */}
      <section className="container py-12">
        <h2 className="text-3xl font-bold mb-8">Checkout</h2>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email *</Label>
                      <Input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customerPhone">Phone</Label>
                    <Input
                      id="customerPhone"
                      name="customerPhone"
                      type="tel"
                      value={formData.customerPhone}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shippingAddress">Street Address *</Label>
                    <Input
                      id="shippingAddress"
                      name="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="shippingCity">City *</Label>
                      <Input
                        id="shippingCity"
                        name="shippingCity"
                        value={formData.shippingCity}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingState">State *</Label>
                      <Input
                        id="shippingState"
                        name="shippingState"
                        value={formData.shippingState}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingZip">ZIP Code *</Label>
                      <Input
                        id="shippingZip"
                        name="shippingZip"
                        value={formData.shippingZip}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Method</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingRates ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <RadioGroup
                      value={selectedShipping?.toString()}
                      onValueChange={(value) => setSelectedShipping(parseInt(value))}
                    >
                      <div className="space-y-3">
                        {shippingRates?.map((rate) => {
                          const isFreeShipping = qualifiesForFreeShipping && 
                            rate.carrier === "UPS" && 
                            rate.serviceName === "UPS 2nd Day Air";
                          
                          return (
                            <div
                              key={rate.id}
                              className={`flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer ${
                                isFreeShipping ? 'border-primary bg-primary/5' : ''
                              }`}
                              onClick={() => setSelectedShipping(rate.id)}
                            >
                              <RadioGroupItem value={rate.id.toString()} id={`rate-${rate.id}`} />
                              <Label
                                htmlFor={`rate-${rate.id}`}
                                className="flex-1 cursor-pointer flex items-start justify-between gap-4"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">
                                    {rate.carrier} - {rate.serviceName}
                                    {isFreeShipping && (
                                      <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                                        <Gift className="h-3 w-3" />
                                        FREE
                                      </span>
                                    )}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {rate.description}
                                  </p>
                                  {rate.estimatedDays && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {rate.estimatedDays}
                                    </p>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  {isFreeShipping ? (
                                    <div className="flex flex-col items-end">
                                      <span className="text-muted-foreground text-sm line-through">{formatPrice(rate.baseRate)}</span>
                                      <span className="text-primary font-bold">FREE</span>
                                    </div>
                                  ) : (
                                    <p className="font-semibold text-primary">{formatPrice(rate.baseRate)}</p>
                                  )}
                                </div>
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </RadioGroup>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as "square" | "btc")}
                  >
                    <div className="space-y-3">
                      <div
                        className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer border-primary bg-primary/5"
                        onClick={() => setPaymentMethod("square")}
                      >
                        <RadioGroupItem value="square" id="payment-square" />
                        <Label htmlFor="payment-square" className="flex-1 cursor-pointer">
                          <p className="font-medium">Square - Credit/Debit Card</p>
                          <p className="text-sm text-muted-foreground">
                            Secure payment via Square - Supports Apple Pay & Google Pay
                          </p>
                        </Label>
                      </div>
                      <div
                        className="flex items-center space-x-3 border rounded-lg p-4 hover:bg-accent cursor-pointer"
                        onClick={() => setPaymentMethod("btc")}
                      >
                        <RadioGroupItem value="btc" id="payment-btc" />
                        <Label htmlFor="payment-btc" className="flex-1 cursor-pointer">
                          <p className="font-medium">Bitcoin (BTC)</p>
                          <p className="text-sm text-muted-foreground">
                            Payment instructions will be provided after order confirmation
                          </p>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Notes (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    name="customerNotes"
                    value={formData.customerNotes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions or notes for your order..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium">
                          {formatPrice(item.priceUsd * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {!selectedRate ? (
                          "Select method"
                        ) : shippingCost === 0 ? (
                          <span className="text-primary font-semibold">FREE</span>
                        ) : (
                          formatPrice(shippingCost)
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(total)}</span>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || !selectedRate}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Place Order"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </section>

      {/* Square Payment Modal */}
      {showSquareForm && paymentMethod === "square" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-md w-full p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Complete Payment</h2>
              <p className="text-muted-foreground">
                Total: <span className="font-semibold text-foreground">{formatPrice(total)}</span>
              </p>
            </div>
            
            <SquarePaymentForm
              applicationId={import.meta.env.VITE_SQUARE_APPLICATION_ID || "sandbox-sq0idb-RX7ccaEmpsMvVo7rC7P4xA"}
              onPaymentSuccess={handleSquarePaymentSuccess}
              onPaymentError={handleSquarePaymentError}
              isProcessing={isSubmitting}
              total={total}
            />
            
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowSquareForm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
