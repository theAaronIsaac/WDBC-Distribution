import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { AlertCircle, Microscope, ShoppingCart, Tag } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import Footer from "@/components/Footer";

export default function Clearance() {
  const { data: allProducts, isLoading } = trpc.products.list.useQuery();
  const { addItem, totalItems } = useCart();

  // Filter for clearance category products
  const products = allProducts?.filter(p => p.category === 'clearance');

  const handleAddToCart = (product: NonNullable<typeof products>[0]) => {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Microscope className="h-6 w-6 text-white" />
              <h1 className="text-xl font-bold text-white">WDBC Distribution</h1>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="ghost" className="text-white hover:text-white/80">Products</Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" className="relative text-white hover:text-white/80">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-white text-primary text-xs flex items-center justify-center">
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

      {/* Clearance Section */}
      <section className="container py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Tag className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold text-white">Clearance</h2>
          </div>
          <p className="text-white/80">
            Special offers and discounted laboratory products - limited quantities available
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse bg-red-50">
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
        ) : products && products.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col bg-red-50 border-red-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full px-2 py-1">
                      <Tag className="h-3 w-3" />
                      SALE
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  <div className="space-y-2">
                    {product.unit && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Unit:</span>
                        <span className="font-medium">{product.unit}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="text-2xl font-bold text-red-600">
                        {formatPrice(product.priceUsd)}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
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
        ) : (
          <Card className="p-12 bg-red-50 border-red-200">
            <div className="text-center">
              <Tag className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Clearance Items Available</h3>
              <p className="text-muted-foreground mb-6">
                Check back soon for special offers and discounted laboratory products.
              </p>
              <Link href="/">
                <Button className="bg-red-600 hover:bg-red-700 text-white">Return to Home</Button>
              </Link>
            </div>
          </Card>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
