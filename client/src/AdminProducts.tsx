import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/useAuth";
import { APP_TITLE } from "@/const";
import { Microscope, Loader2, Package, PlusCircle, MoreHorizontal, Trash2, Edit, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminProducts() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, user?.role, setLocation]);

  const { data: products, isLoading, refetch } = trpc.products.list.useQuery();
  const createProduct = trpc.products.create.useMutation({
    onSuccess: () => {
      toast.success("Product created successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create product");
    },
  });
  const updateProduct = trpc.products.update.useMutation({
    onSuccess: () => {
      toast.success("Product updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update product");
    },
  });
  const deleteProduct = trpc.products.delete.useMutation({
    onSuccess: () => {
      toast.success("Product deleted successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete product");
    },
  });

  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  const handleCreateProduct = () => {
    createProduct.mutate({ name, description, price: parseFloat(price), category, stock: parseInt(stock) });
    setCreateDialogOpen(false);
  };

  const handleUpdateProduct = () => {
    if (selectedProduct) {
      updateProduct.mutate({ id: selectedProduct.id, name, description, price: parseFloat(price), category, stock: parseInt(stock) });
      setEditDialogOpen(false);
    }
  };

  const handleDeleteProduct = () => {
    if (selectedProduct) {
      deleteProduct.mutate({ id: selectedProduct.id });
      setDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Microscope className="h-6 w-6 text-white" />
              <h1 className="text-xl font-bold text-white">{APP_TITLE}</h1>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin"><Button variant="ghost">Dashboard</Button></Link>
            <Link href="/admin/orders"><Button variant="ghost">Orders</Button></Link>
            <Link href="/admin/contacts"><Button variant="ghost">Contacts</Button></Link>
          </nav>
        </div>
      </header>

      <section className="container py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold">Product Management</h2>
            <p className="text-muted-foreground">Create, edit, and manage your products.</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusCircle className="h-4 w-4 mr-2" />Add Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD)</Label>
                  <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={setCategory} defaultValue={category}>
                    <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chemicals">Chemicals</SelectItem>
                      <SelectItem value="labware">Labware</SelectItem>
                      <SelectItem value="consumables">Consumables</SelectItem>
                      <SelectItem value="clearance">Clearance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                </div>
                <Button onClick={handleCreateProduct} disabled={createProduct.isPending}>Add Product</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
        ) : products && products.length > 0 ? (
          <Card>
            <CardHeader><CardTitle>All Products</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>${(product.priceUsd / 100).toFixed(2)}</TableCell>
                      <TableCell>{product.stockQuantity}</TableCell>
                      <TableCell>
                        <Dialog open={isEditDialogOpen && selectedProduct?.id === product.id} onOpenChange={setEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => { setSelectedProduct(product); setName(product.name); setDescription(product.description); setPrice(String(product.priceUsd / 100)); setCategory(product.category); setStock(String(product.stockQuantity)); }}><Edit className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Product Name</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="price">Price (USD)</Label>
                                <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select onValueChange={setCategory} defaultValue={category}>
                                  <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="chemicals">Chemicals</SelectItem>
                                    <SelectItem value="labware">Labware</SelectItem>
                                    <SelectItem value="consumables">Consumables</SelectItem>
                                    <SelectItem value="clearance">Clearance</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="stock">Stock Quantity</Label>
                                <Input id="stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} />
                              </div>
                              <Button onClick={handleUpdateProduct} disabled={updateProduct.isPending}>Save Changes</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={isDeleteDialogOpen && selectedProduct?.id === product.id} onOpenChange={setDeleteDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(product)}><Trash2 className="h-4 w-4" /></Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader><DialogTitle>Delete Product</DialogTitle></DialogHeader>
                            <p>Are you sure you want to delete this product?</p>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                              <Button variant="destructive" onClick={handleDeleteProduct} disabled={deleteProduct.isPending}>Delete</Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No products yet</h3>
              <p className="text-muted-foreground">Create your first product to get started.</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
