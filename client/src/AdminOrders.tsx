import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Microscope, Package, Loader2, Search, Download, Filter } from "lucide-react";
import { exportToCSV } from "@/lib/csv-export";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/useAuth";
import { useEffect } from "react";

export default function AdminOrders() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, user?.role, setLocation]);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [useFilters, setUseFilters] = useState(false);

  const { data: orders, isLoading, refetch } = trpc.orders.list.useQuery(undefined, {
    enabled: !useFilters,
  });

  const { data: filteredOrders, isLoading: isFilterLoading } = trpc.orders.filter.useQuery(
    {
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      paymentStatus: paymentStatusFilter !== "all" ? paymentStatusFilter as any : undefined,
      status: statusFilter !== "all" ? statusFilter as any : undefined,
    },
    {
      enabled: useFilters,
    }
  );

  const displayOrders = useFilters ? filteredOrders : orders;


  const updateStatus = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Order status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update order status");
    },
  });

  const updatePaymentStatus = trpc.orders.updatePaymentStatus.useMutation({
    onSuccess: () => {
      toast.success("Payment status updated successfully");
      refetch();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update payment status");
    },
  });



  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const searchFilteredOrders = displayOrders?.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <Microscope className="h-6 w-6 text-white" />
              <h1 className="text-xl font-bold text-white">{APP_TITLE}</h1>
            </div>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="text-white hover:text-white/80">
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="ghost" className="text-white hover:text-white/80">
                Products
              </Button>
            </Link>
            <Link href="/admin/orders">
              <Button variant="ghost" className="text-white hover:text-white/80">
                Orders
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Orders Management */}
      <section className="container py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-white">Order Management</h2>
          </div>
          <p className="text-white/80">
            View and manage all customer orders, update statuses, and add tracking information
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <div className="space-y-2">
                <Label htmlFor="search">Search Orders</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Order number, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setUseFilters(true);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setUseFilters(true);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Filter by Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">Payment Status</Label>
                <Select value={paymentStatusFilter} onValueChange={(val) => {
                  setPaymentStatusFilter(val);
                  setUseFilters(true);
                }}>
                  <SelectTrigger id="paymentStatus">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Payments</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setStatusFilter("all");
                  setPaymentStatusFilter("all");
                  setSearchTerm("");
                  setUseFilters(false);
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (!searchFilteredOrders || searchFilteredOrders.length === 0) {
                    toast.error("No orders to export");
                    return;
                  }
                  const csvData = searchFilteredOrders.map(order => ({
                    OrderNumber: order.orderNumber,
                    CustomerName: order.customerName,
                    CustomerEmail: order.customerEmail,
                    Total: (order.total / 100).toFixed(2),
                    PaymentMethod: order.paymentMethod,
                    PaymentStatus: order.paymentStatus,
                    OrderStatus: order.status,
                    Date: new Date(order.createdAt).toLocaleDateString(),
                  }));
                  exportToCSV(csvData, `orders-${new Date().toISOString().split('T')[0]}.csv`);
                  toast.success("Orders exported to CSV");
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : searchFilteredOrders && searchFilteredOrders.length > 0 ? (
          <div className="space-y-4">
            {searchFilteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.orderNumber}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Customer</p>
                      <p className="text-sm">{order.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total</p>
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Shipping</p>
                      <p className="text-sm">
                        {order.shippingCarrier} - {order.shippingService}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {order.trackingNumber}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Payment</p>
                      <p className="text-sm capitalize">{order.paymentMethod}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 flex-wrap">
                    <Select
                      value={order.status}
                      onValueChange={(value) =>
                        updateStatus.mutate({
                          orderId: order.id,
                          status: value as any,
                        })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={order.paymentStatus}
                      onValueChange={(value) =>
                        updatePaymentStatus.mutate({
                          orderId: order.id,
                          paymentStatus: value as any,
                        })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Payment Pending</SelectItem>
                        <SelectItem value="completed">Payment Completed</SelectItem>
                        <SelectItem value="failed">Payment Failed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => setSelectedOrder(order.id)}
                    >
                      {order.trackingNumber ? "Update Tracking" : "Add Tracking"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Orders will appear here when customers place them"}
              </p>
            </div>
          </Card>
        )}
      </section>

      {/* Add/Update Tracking Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tracking Number</DialogTitle>
            <DialogDescription>
              Enter the tracking number for this shipment
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const trackingNumber = formData.get("trackingNumber") as string;
              if (selectedOrder && trackingNumber) {
                updateStatus.mutate({
                  orderId: selectedOrder,
                  status: orders?.find(o => o.id === selectedOrder)?.status as any,
                  trackingNumber,
                });
                setSelectedOrder(null);
              }
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Tracking Number</Label>
                <Input
                  id="trackingNumber"
                  name="trackingNumber"
                  defaultValue={orders?.find(o => o.id === selectedOrder)?.trackingNumber || ""}
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedOrder(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateStatus.isPending}>
                  {updateStatus.isPending ? "Saving..." : "Save Tracking"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
