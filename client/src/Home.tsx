import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Microscope, ShieldCheck, Truck, FlaskConical, PackageOpen, TestTube2, Tag, Award } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";
import Footer from "@/components/Footer";
import RecentlyViewedItems from "@/components/RecentlyViewedItems";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Microscope className="h-6 w-6 text-white" />
            <h1 className="text-xl font-bold text-white">WDBC Distribution</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="ghost">Products</Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost">Cart</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-20">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-white">
            <AlertCircle className="h-4 w-4 text-white" />
            For Research Purposes Only
          </div>
          <img 
            src="/wdbc-logo.png" 
            alt="WDBC Distribution - Supplying Inquiring Minds" 
            className="mx-auto max-w-2xl w-full h-auto"
          />
        </div>
      </section>

      {/* Four Category Blocks */}
      <section className="container py-12">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {/* Lab Ware */}
          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <TestTube2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Lab Ware</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Professional laboratory glassware and equipment.
              </p>
              <Link href="/labware">
                <Button className="w-full">
                  Shop Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Chemicals */}
          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <FlaskConical className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Chemicals</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                High-purity research compounds for laboratory use.
              </p>
              <Link href="/products">
                <Button className="w-full">
                  Shop Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Consumables */}
          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <PackageOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Consumables</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Essential lab supplies and consumable materials.
              </p>
              <Link href="/consumables">
                <Button className="w-full">
                  Shop Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Clearance */}
          <Card className="border-2 hover:border-red-300 transition-colors bg-red-50">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <Tag className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="mb-4 text-xl font-bold">Clearance</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Special offers and discounted laboratory products.
              </p>
              <Link href="/clearance">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  Shop Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Research Disclaimer */}
      <section className="container py-12">
        <Card className="border-destructive bg-white">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-destructive flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold mb-2 text-destructive">
                  Important Research Notice
                </h3>
                <p className="text-sm text-muted-foreground">
                  All products are intended strictly for research and laboratory use only. These products are not for human consumption, 
                  medical use, or any other application outside of controlled scientific research environments. By purchasing 
                  from us, you acknowledge that you are a qualified researcher and will use these products in accordance 
                  with all applicable laws and regulations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recently Viewed Items */}
      <RecentlyViewedItems />

      {/* Features */}
      <section className="container py-16">
        <div className="grid gap-8 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">High Quality</h3>
              <p className="text-sm text-muted-foreground">
                Laboratory-grade equipment and compounds suitable for scientific research applications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Multiple Shipping Options</h3>
              <p className="text-sm text-muted-foreground">
                Choose from USPS and UPS shipping methods to meet your delivery needs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Secure Payment</h3>
              <p className="text-sm text-muted-foreground">
                Accept payments via Square and Bitcoin for your convenience and security.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
