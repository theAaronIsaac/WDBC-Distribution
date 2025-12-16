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
import { Microscope, Mail, Loader2, Search, Phone, MessageSquare } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/useAuth";
import { useEffect } from "react";

export default function AdminContacts() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== "admin")) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, user?.role, setLocation]);
  const [selectedContact, setSelectedContact] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [adminNotes, setAdminNotes] = useState("");

  const { data: contacts, isLoading, refetch } = trpc.contact.list.useQuery();

  const updateStatus = trpc.contact.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("Contact status updated successfully");
      refetch();
      setSelectedContact(null);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "read":
        return "bg-yellow-500";
      case "replied":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const filteredContacts = contacts?.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.phone && contact.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const selectedContactData = contacts?.find((c) => c.id === selectedContact);

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
            <Link href="/admin/contacts">
              <Button variant="ghost" className="text-white hover:text-white/80">
                Contacts
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Contacts Management */}
      <section className="container py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold text-white">Contact Management</h2>
          </div>
          <p className="text-white/80">
            View and manage customer inquiries from the contact form
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="search">Search Contacts</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Name, email, phone, or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Filter by Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Contacts</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="replied">Replied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contacts List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredContacts && filteredContacts.length > 0 ? (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{contact.name}</CardTitle>
                        <Badge className={getStatusColor(contact.status)}>
                          {contact.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-semibold text-primary mb-2">
                        {contact.subject}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(contact.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-sm hover:underline"
                      >
                        {contact.email}
                      </a>
                    </div>
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={`tel:${contact.phone}`}
                          className="text-sm hover:underline"
                        >
                          {contact.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <p className="text-sm whitespace-pre-wrap">{contact.message}</p>
                  </div>

                  {contact.adminNotes && (
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-4">
                      <p className="text-sm font-medium mb-1">Admin Notes:</p>
                      <p className="text-sm whitespace-pre-wrap">{contact.adminNotes}</p>
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Select
                      value={contact.status}
                      onValueChange={(value) =>
                        updateStatus.mutate({
                          id: contact.id,
                          status: value as any,
                        })
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="replied">Replied</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedContact(contact.id);
                        setAdminNotes(contact.adminNotes || "");
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {contact.adminNotes ? "Edit Notes" : "Add Notes"}
                    </Button>

                    <Button
                      variant="default"
                      onClick={() => {
                        window.location.href = `mailto:${contact.email}?subject=Re: ${contact.subject}`;
                        updateStatus.mutate({
                          id: contact.id,
                          status: "replied",
                        });
                      }}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Reply via Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Contacts Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Contact submissions will appear here when customers use the contact form"}
              </p>
            </div>
          </Card>
        )}
      </section>

      {/* Add/Edit Admin Notes Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Admin Notes</DialogTitle>
            <DialogDescription>
              Add internal notes about this contact submission
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedContact) {
                updateStatus.mutate({
                  id: selectedContact,
                  status: selectedContactData?.status as any,
                  adminNotes,
                });
              }
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminNotes">Notes</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={5}
                  placeholder="Add notes about this inquiry, follow-up actions, etc..."
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedContact(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateStatus.isPending}>
                  {updateStatus.isPending ? "Saving..." : "Save Notes"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
