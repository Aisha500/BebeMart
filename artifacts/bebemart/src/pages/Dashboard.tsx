import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { useGetMyTransactions, useGetUserListings, useUpdateTransactionStatus } from "@workspace/api-client-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Link } from "wouter";
import { Package, Truck, CheckCircle2, Box } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const { data: transactions, isLoading: txLoading } = useGetMyTransactions({
    query: { enabled: !!user }
  });
  const { data: listingsData, isLoading: listingsLoading } = useGetUserListings(user?.id || 0, {
    query: { enabled: !!user }
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateStatusMutation = useUpdateTransactionStatus({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
        toast({ title: "Status updated" });
      }
    }
  });

  if (!isAuthenticated) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-32 px-4">
          <h2 className="text-2xl font-bold mb-4">Please login to view dashboard</h2>
          <Link href="/auth"><Button className="rounded-full px-8 font-bold">Login</Button></Link>
        </div>
      </AppLayout>
    );
  }

  const purchases = transactions?.filter(t => t.buyerId === user?.id) || [];
  const sales = transactions?.filter(t => t.sellerId === user?.id) || [];

  return (
    <AppLayout>
      <div className="bg-primary/5 pb-12 pt-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-6 mb-10">
            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-display font-bold text-white shadow-lg">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-display font-bold text-foreground">{user?.name}</h1>
              <p className="text-muted-foreground text-lg">Member since {user && format(new Date(user.createdAt), "MMM yyyy")}</p>
            </div>
          </div>

          <Tabs defaultValue="purchases" className="w-full">
            <TabsList className="w-full sm:w-auto h-14 bg-white/50 backdrop-blur rounded-2xl p-1 mb-8 shadow-sm">
              <TabsTrigger value="purchases" className="rounded-xl text-base font-semibold px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Purchases</TabsTrigger>
              <TabsTrigger value="sales" className="rounded-xl text-base font-semibold px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">Sales</TabsTrigger>
              <TabsTrigger value="listings" className="rounded-xl text-base font-semibold px-6 data-[state=active]:bg-white data-[state=active]:shadow-sm">My Listings</TabsTrigger>
            </TabsList>

            <TabsContent value="purchases" className="mt-0">
              {txLoading ? <div className="animate-pulse h-40 bg-muted rounded-3xl" /> : 
               purchases.length === 0 ? (
                 <EmptyState message="You haven't bought anything yet." action="Browse Items" link="/browse" />
               ) : (
                <div className="space-y-4">
                  {purchases.map(tx => (
                    <TransactionCard 
                      key={tx.id} 
                      tx={tx} 
                      isBuyer={true} 
                      onUpdate={(status) => updateStatusMutation.mutate({ transactionId: tx.id, data: { status: status as any } })}
                      isUpdating={updateStatusMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="sales" className="mt-0">
              {txLoading ? <div className="animate-pulse h-40 bg-muted rounded-3xl" /> : 
               sales.length === 0 ? (
                 <EmptyState message="No sales yet. Keep listing!" action="Sell Item" link="/sell" />
               ) : (
                <div className="space-y-4">
                  {sales.map(tx => (
                    <TransactionCard 
                      key={tx.id} 
                      tx={tx} 
                      isBuyer={false}
                      onUpdate={(status) => updateStatusMutation.mutate({ transactionId: tx.id, data: { status: status as any } })}
                      isUpdating={updateStatusMutation.isPending}
                    />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="listings" className="mt-0">
              {listingsLoading ? <div className="animate-pulse h-40 bg-muted rounded-3xl" /> : 
               !listingsData?.listings.length ? (
                 <EmptyState message="You have no active listings." action="Create Listing" link="/sell" />
               ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {listingsData.listings.map(l => (
                    <Card key={l.id} className="rounded-3xl overflow-hidden border-2 hover:border-primary/30 transition-colors">
                      <div className="h-40 bg-muted relative">
                        <img src={l.images[0]} className="w-full h-full object-cover" alt="" />
                        <Badge className="absolute top-2 right-2 bg-white text-foreground">{l.status}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-bold truncate">{l.title}</h4>
                        <div className="text-primary font-bold">{l.price} NGN</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}

function TransactionCard({ tx, isBuyer, onUpdate, isUpdating }: { tx: any, isBuyer: boolean, onUpdate: (status: string) => void, isUpdating: boolean }) {
  const StatusIcon = {
    pending: Package,
    paid_escrow: Package,
    shipped: Truck,
    received: CheckCircle2,
    completed: CheckCircle2,
    cancelled: Box
  }[tx.escrowStatus as keyof typeof StatusIcon] || Box;

  return (
    <Card className="rounded-[2rem] overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row gap-6 p-6">
        <div className="w-24 h-24 rounded-2xl bg-muted overflow-hidden flex-shrink-0">
          <img src={tx.listingImages[0]} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                {format(new Date(tx.createdAt), "MMM dd, yyyy")} • Order #{tx.id}
              </div>
              <h3 className="font-display font-bold text-xl text-foreground">
                <Link href={`/listings/${tx.listingId}`} className="hover:text-primary transition-colors">
                  {tx.listingTitle}
                </Link>
              </h3>
            </div>
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-2 bg-secondary/10 text-secondary-foreground font-bold flex items-center gap-2">
              <StatusIcon className="w-4 h-4" />
              {tx.escrowStatus.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm mt-4 p-4 bg-muted/50 rounded-2xl">
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">Total Amount</span>
              <span className="font-bold text-lg">{tx.amount + tx.platformFee} NGN</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs uppercase tracking-wider mb-1">{isBuyer ? "Seller" : "Buyer"}</span>
              <span className="font-semibold">{isBuyer ? tx.sellerName : tx.buyerName}</span>
            </div>
          </div>
        </div>
        
        {/* Actions based on Escrow Status */}
        <div className="flex flex-col gap-2 justify-center sm:min-w-40 border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-6">
          {!isBuyer && tx.escrowStatus === 'paid_escrow' && (
            <Button 
              className="rounded-xl font-bold w-full shadow-sm hover-elevate" 
              onClick={() => onUpdate('shipped')}
              disabled={isUpdating}
            >
              Mark Shipped
            </Button>
          )}
          {isBuyer && tx.escrowStatus === 'shipped' && (
            <Button 
              className="rounded-xl font-bold w-full bg-emerald-500 hover:bg-emerald-600 shadow-sm hover-elevate"
              onClick={() => onUpdate('received')}
              disabled={isUpdating}
            >
              Confirm Received
            </Button>
          )}
          {tx.escrowStatus === 'completed' && (
            <div className="text-center text-emerald-600 font-bold flex flex-col items-center justify-center h-full">
              <CheckCircle2 className="w-8 h-8 mb-2" />
              Done
            </div>
          )}
          <Link href={`/messages/${isBuyer ? tx.sellerId : tx.buyerId}`}>
            <Button variant="outline" className="rounded-xl w-full border-2">Message</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

function EmptyState({ message, action, link }: { message: string, action: string, link: string }) {
  return (
    <div className="text-center py-16 bg-white rounded-3xl border border-border">
      <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
        <Package className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-4">{message}</h3>
      <Link href={link}>
        <Button className="rounded-full px-8 font-bold">{action}</Button>
      </Link>
    </div>
  );
}
