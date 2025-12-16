import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope, Construction } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";

export default function Equipment() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Microscope className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">{APP_TITLE}</h1>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="ghost">Chemicals</Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost">Cart</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto text-center py-12">
          <CardHeader>
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mx-auto">
              <Construction className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-3xl mb-4">Lab Equipment Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-muted-foreground mb-8">
              We're currently building our lab equipment catalog. Check back soon for a wide selection of 
              professional-grade laboratory equipment and supplies.
            </p>
            <p className="text-muted-foreground mb-8">
              In the meantime, browse our research chemicals catalog.
            </p>
            <Link href="/products">
              <Button size="lg">
                Browse Research Chemicals
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
