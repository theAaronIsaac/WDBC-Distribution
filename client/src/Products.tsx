import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { AlertCircle, Microscope, ShoppingCart } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { getSessionId } from "@/lib/session";

export default function Products() {
  const { data: products, isLoading } = trpc.products.list.useQuery();
  const { addItem, totalItems } = useCart();
  const recordView = trpc.recentlyViewed.record.useMutation();

  const handleAddToCart = (product: NonNullable<typeof products>[0]) => {
    // Track product view
    const sessionId = getSessionId();
    recordView.mutate({ sessionId, productId: product.id });
    
    addItem({
      productId: product.id,
      name: product.name,
      weightGrams: product.weightGrams,
      priceUsd: product.priceUsd,
    });
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

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
          <nav className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="ghost">Products</Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Research Disclaimer Banner */}
      <div className="border-b bg-destructive/10 py-3">
        <div className="container flex items-center justify-center gap-2 text-sm">
          <AlertCircle className="h-4 w-4 text-white" />
          <span className="font-medium text-white">For Research Purposes Only</span>
        </div>
      </div>

      {/* Products Section */}
      <section className="container py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">SR17018 Research Compound</h2>
          <p className="text-muted-foreground">
            Available in multiple quantities for your research needs
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-muted rounded" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="h-10 bg-muted rounded w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {products?.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  <div className="space-y-2">
                    {product.name.includes('SR17018') && product.weightGrams && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Weight:</span>
                        <span className="font-medium">{product.weightGrams}g</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.priceUsd)}
                      </span>
                    </div>
                    {product.name.includes('SR17018') && product.weightGrams && product.weightGrams > 1 && (
                      <div className="text-xs text-muted-foreground text-right">
                        ${(product.priceUsd / 100 / product.weightGrams).toFixed(2)}/gram
                      </div>
                    )}
                    {product.weightGrams && [3, 5, 10].includes(product.weightGrams) && (
                      <div className="flex items-center justify-center gap-1 text-xs font-semibold text-primary bg-primary/10 rounded px-2 py-1 mt-2">
                        <span>🎁</span>
                        <span>FREE UPS 2nd Day Air</span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    ) : (
                      "Out of Stock"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
