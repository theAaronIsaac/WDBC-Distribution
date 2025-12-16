import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/contexts/CartContext";
import { trpc } from "@/lib/trpc";
import { AlertCircle, Microscope, ShoppingCart, TestTube2, Filter } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LabWare() {
  const { data: allProducts, isLoading } = trpc.products.list.useQuery();
  const { addItem, totalItems } = useCart();
  const [selectedType, setSelectedType] = useState<string>("all");

  // Filter for labware category products
  const labwareProducts = allProducts?.filter(p => p.category === 'labware');

  // Get unique product types
  const productTypes = useMemo(() => {
    if (!labwareProducts) return [];
    const types = new Set(labwareProducts.map(p => p.productType).filter(Boolean));
    return Array.from(types).sort();
  }, [labwareProducts]);

  // Apply product type filter
  const products = useMemo(() => {
    if (!labwareProducts) return [];
    if (selectedType === "all") return labwareProducts;
    return labwareProducts.filter(p => p.productType === selectedType);
  }, [labwareProducts, selectedType]);

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

      {/* Lab Ware Section */}
      <section className="container py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <TestTube2 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">Lab Ware</h2>
          </div>
          <p className="text-white/80">
            Professional laboratory glassware and equipment for your research needs
          </p>
        </div>

        {/* Product Type Filter */}
        {productTypes.length > 0 && (
          <div className="mb-6 flex items-center gap-3">
            <Filter className="h-5 w-5 text-white" />
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px] bg-white">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {productTypes.map((type) => (
                  <SelectItem key={type as string} value={type as string}>
                    {(type as string).split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedType !== "all" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedType("all")}
                className="bg-white"
              >
                Clear Filter
              </Button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
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
        ) : products && products.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
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
                      <span className="text-2xl font-bold text-primary">
                        {formatPrice(product.priceUsd)}
                      </span>
                    </div>
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
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <TestTube2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Lab Ware Products Available</h3>
              <p className="text-muted-foreground mb-6">
                We're currently updating our lab ware inventory. Please check back soon.
              </p>
              <Link href="/">
                <Button>Return to Home</Button>
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
