import { useRoute } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { useGetListingById, useCreateTransaction } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart, MapPin, MessageCircle, Star, ShieldCheck, ChevronLeft, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "wouter";
import { getStaticListingDetail } from "@/data/static-listings";

export default function ListingDetail() {
  const [, params] = useRoute("/listings/:id");
  const listingId = params?.id ? parseInt(params.id) : 0;
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  
  const [buyDialogOpen, setBuyDialogOpen] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const { data: apiListing, isLoading, isError } = useGetListingById(listingId);
  const staticListing = getStaticListingDetail(listingId);
  const listing = apiListing || staticListing;

  const buyMutation = useCreateTransaction({
    mutation: {
      onSuccess: () => {
        setBuyDialogOpen(false);
        toast({ title: "Purchase successful!", description: "Track it in your dashboard." });
        setLocation("/dashboard");
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Failed to purchase", description: err.error || "An error occurred." });
      }
    }
  });

  const handleBuy = () => {
    if (!isAuthenticated) {
      toast({ title: "Please login", description: "You need an account to buy items.", variant: "destructive" });
      setLocation("/auth");
      return;
    }
    if (!deliveryAddress) {
      toast({ title: "Address required", description: "Please provide a delivery address.", variant: "destructive" });
      return;
    }
    buyMutation.mutate({ data: { listingId, deliveryAddress } });
  };

  if ((isLoading && !isError) || !listing) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto p-4 py-8 animate-pulse">
          <div className="h-10 w-32 bg-muted rounded mb-8"></div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="aspect-square bg-muted rounded-[3rem]"></div>
            <div className="space-y-6">
              <div className="h-12 bg-muted rounded w-3/4"></div>
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="h-32 bg-muted rounded w-full"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const isOwner = user?.id === listing.sellerId;
  const isAvailable = listing.status === 'available';

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => history.back()} className="mb-6 -ml-4 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-5 h-5 mr-1" /> Back
        </Button>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-muted border-4 border-white shadow-xl">
              <img 
                src={listing.images[0] || "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800"} 
                className="w-full h-full object-cover"
                alt={listing.title} 
              />
              {!isAvailable && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center">
                  <span className="text-4xl font-display font-bold uppercase tracking-widest text-foreground rotate-[-15deg] border-4 border-foreground p-4">
                    {listing.status}
                  </span>
                </div>
              )}
            </div>
            {listing.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 px-2 snap-x">
                {listing.images.map((img, i) => (
                  <div key={i} className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 snap-start border-2 border-transparent hover:border-primary cursor-pointer transition-colors">
                    <img src={img} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {listing.giftItForward && (
              <Badge className="w-fit mb-4 bg-gradient-to-r from-accent to-orange-400 text-foreground font-bold border-none shadow-md flex items-center gap-2 px-4 py-2 text-sm rounded-full">
                <img src={`${import.meta.env.BASE_URL}images/gift-badge.png`} className="w-6 h-6 object-contain" alt="" />
                Gift-It-Forward Program
              </Badge>
            )}
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 leading-tight">
              {listing.title}
            </h1>
            
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-4xl font-extrabold text-primary">
                {listing.giftItForward ? "0 NGN" : `₦${listing.price}`}
              </span>
              {listing.giftItForward && (
                <span className="text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full text-sm">
                  + 500 NGN Platform Fee
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <Badge variant="outline" className="text-sm py-1.5 px-4 bg-secondary/10 border-secondary/30 text-secondary-foreground rounded-full">
                Size/Age: {listing.ageGroup}
              </Badge>
              <Badge variant="outline" className="text-sm py-1.5 px-4 bg-muted border-muted-foreground/20 rounded-full">
                Condition: {listing.condition}
              </Badge>
              <Badge variant="outline" className="text-sm py-1.5 px-4 bg-muted border-muted-foreground/20 rounded-full">
                {listing.category}
              </Badge>
            </div>

            <div className="prose prose-p:text-lg text-muted-foreground mb-10 max-w-none">
              <p>{listing.description}</p>
            </div>

            {/* Action Area */}
            <div className="mt-auto bg-card rounded-3xl p-6 border-2 border-border/50 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10" />
              
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner">
                    {listing.seller.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground">{listing.seller.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {listing.city}, {listing.state}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-500 font-bold mb-0.5">
                    <Star className="w-4 h-4 fill-current" />
                    {listing.seller.rating?.toFixed(1) || "New"}
                  </div>
                  <div className="text-xs text-muted-foreground">{listing.seller.reviewCount} reviews</div>
                </div>
              </div>

              {isOwner ? (
                <Button className="w-full h-14 rounded-2xl font-bold text-lg" variant="secondary">
                  Manage Listing
                </Button>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
                  <Button 
                    className="sm:col-span-3 h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 hover-elevate"
                    onClick={() => setBuyDialogOpen(true)}
                    disabled={!isAvailable}
                  >
                    {isAvailable ? (listing.giftItForward ? "Claim for 500 NGN Fee" : "Buy Now with Escrow") : "Sold Out"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="sm:col-span-2 h-14 rounded-2xl font-bold border-2 hover:bg-secondary/10 hover:text-secondary-foreground"
                    onClick={() => {
                      if (!isAuthenticated) setLocation("/auth");
                      else setLocation(`/messages/${listing.sellerId}`);
                    }}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" /> Message
                  </Button>
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 py-2 rounded-xl">
                <ShieldCheck className="w-4 h-4" /> Buyer Protection Included
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={buyDialogOpen} onOpenChange={setBuyDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-[2rem] p-6">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Confirm Purchase</DialogTitle>
            <DialogDescription className="text-base pt-2">
              You are about to buy <strong className="text-foreground">{listing.title}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted p-4 rounded-2xl space-y-2 mb-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Item Price</span>
              <span className="font-medium">{listing.giftItForward ? "0" : listing.price} NGN</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee</span>
              <span className="font-medium">{listing.giftItForward ? "500" : "0"} NGN</span>
            </div>
            <div className="border-t border-border pt-2 mt-2 flex justify-between font-bold text-lg">
              <span>Total to Pay</span>
              <span className="text-primary">{listing.giftItForward ? 500 : listing.price} NGN</span>
            </div>
          </div>

          <div className="space-y-3 mt-4">
            <label className="font-bold text-sm text-foreground">Delivery Address</label>
            <Input 
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter full shipping address..." 
              className="h-12 rounded-xl border-2"
            />
          </div>

          <DialogFooter className="mt-6 sm:justify-between flex-row">
            <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setBuyDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="rounded-xl font-bold px-8 shadow-md"
              onClick={handleBuy}
              disabled={buyMutation.isPending}
            >
              {buyMutation.isPending ? "Processing..." : "Pay Securely"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
