import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Microscope, CheckCircle, CheckCircle2, Copy, Loader2, Package, MapPin, CreditCard, Mail, Phone } from "lucide-react";
import { Link, useParams } from "wouter";
import { APP_TITLE } from "@/const";
import Footer from "@/components/Footer";
import { toast } from "sonner";

export default function OrderConfirmation() {
  const params = useParams<{ orderNumber: string }>();
  const orderNumber = params.orderNumber || "";

  const { data, isLoading } = trpc.orders.getByOrderNumber.useQuery(
    { orderNumber },
    { enabled: !!orderNumber }
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "square":
        return "Credit/Debit Card (Square)";
      case "btc":
        return "Bitcoin (BTC)";
      default:
        return method;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
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
              <h3 className="text-xl font-semibold mb-2">Order not found</h3>
              <p className="text-muted-foreground mb-6">
                The order number you provided could not be found
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

  const { order, items } = data;

  // Payment instructions based on method
  const btcAddress = "bc1qln37wa3029gwvka8p24pn8gjneu9kfffhlq04v";

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

      {/* Order Confirmation */}
      <section className="container py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Success Message */}
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-8 w-8 text-primary flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                  <p className="text-muted-foreground">
                    Thank you for your order. We've received your order and will process it shortly.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Number:</span>
                  <span className="font-mono font-semibold">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Date:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <span className="capitalize">{order.paymentStatus}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment {order.paymentMethod === "square" ? "Confirmation" : "Instructions"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.paymentMethod === "square" ? (
                <div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <p className="font-semibold text-green-700 dark:text-green-400">Payment Successful</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your payment has been processed successfully via {getPaymentMethodDisplay(order.paymentMethod)}.
                    </p>
                  </div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-medium">{getPaymentMethodDisplay(order.paymentMethod)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount Paid:</span>
                      <span className="font-semibold text-primary">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Please send your Bitcoin payment to complete your order:
                  </p>
                  <div className="bg-muted p-4 rounded-lg space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Bitcoin Address:</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-xs break-all">{btcAddress}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(btcAddress, "Bitcoin address")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Amount (USD):</p>
                      <p className="font-mono font-semibold text-lg text-primary">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">
                    Please send the equivalent amount in Bitcoin. Your order will be processed once payment is confirmed on the blockchain.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName || `Product #${item.productId}`}</p>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × {formatPrice(item.pricePerUnit)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(item.pricePerUnit * item.quantity)}</p>
                    </div>
                  </div>
                ))}
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Shipping ({order.shippingCarrier} - {order.shippingService})
                    </span>
                    <span>{formatPrice(order.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(order.total)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-semibold">{order.customerName}</p>
                {order.customerEmail && (
                  <p className="text-muted-foreground">{order.customerEmail}</p>
                )}
                {order.customerPhone && (
                  <p className="text-muted-foreground">{order.customerPhone}</p>
                )}
                <div className="pt-2">
                  <p>{order.shippingAddress}</p>
                  <p>
                    {order.shippingCity}, {order.shippingState} {order.shippingZip}
                  </p>
                  <p>{order.shippingCountry}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href="mailto:wesley@wdbcenterprises.com"
                    className="text-sm text-primary hover:underline"
                  >
                    wesley@wdbcenterprises.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a href="tel:+16551234567" className="text-sm text-primary hover:underline">
                    +1 (655) 123-4567
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/" className="flex-1">
              <Button className="w-full">
                Continue Shopping
              </Button>
            </Link>
            <Link href={`/order/${order.orderNumber}`} className="flex-1">
              <Button variant="outline" className="w-full">
                View Order Status
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
