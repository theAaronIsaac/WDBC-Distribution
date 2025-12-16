import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getSessionId } from "@/lib/session";
import { ShoppingCart, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function RecentlyViewedItems() {
  const sessionId = getSessionId();
  const { data: recentlyViewed, isLoading } = trpc.recentlyViewed.getItems.useQuery({ sessionId });
  const { addItem } = useCart();

  const handleAddToCart = (product: NonNullable<typeof recentlyViewed>[0]) => {
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

  // Don't show the section if there are no recently viewed items
  if (isLoading || !recentlyViewed || recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <div className="flex items-center gap-2 mb-8">
          <Clock className="h-6 w-6 text-primary" />
          <h2 className="text-3xl font-bold">Recently Viewed</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recentlyViewed.map((product) => (
            <Card key={product.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {product.description}
                  </p>
                )}
                <div className="space-y-1 text-sm">
                  {product.weightGrams && (
                    <p className="text-muted-foreground">Weight: {product.weightGrams}g</p>
                  )}
                  {product.quantityPerUnit && product.quantityPerUnit > 1 && (
                    <p className="text-muted-foreground">
                      Quantity: {product.quantityPerUnit}/{product.unit}
                    </p>
                  )}
                  <p className="text-2xl font-bold text-primary mt-2">
                    {formatPrice(product.priceUsd)}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock || product.stockQuantity === 0}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {!product.inStock || product.stockQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
