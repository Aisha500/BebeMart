import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Heart, MapPin } from "lucide-react";
import type { Listing } from "@workspace/api-client-react";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const mainImage = listing.images && listing.images.length > 0 
    ? listing.images[0] 
    : "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&h=500&fit=crop"; 
    // Fallback cute toys/clothes image

  return (
    <Link href={`/listings/${listing.id}`} className="block group hover-elevate">
      <Card className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all duration-300 rounded-3xl bg-white shadow-sm hover:shadow-xl">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img 
            src={mainImage} 
            alt={listing.title} 
            loading="lazy"
            decoding="async"
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {listing.status !== 'available' && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
              <Badge variant="secondary" className="text-lg px-4 py-1 uppercase tracking-wider bg-foreground text-white border-none shadow-lg">
                {listing.status}
              </Badge>
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {listing.giftItForward ? (
              <Badge className="bg-gradient-to-r from-accent to-orange-400 text-foreground font-bold border-none shadow-md flex items-center gap-1 px-3 py-1">
                <img src={`${import.meta.env.BASE_URL}images/gift-badge.png`} className="w-4 h-4 object-contain" alt="" />
                Gift It Forward
              </Badge>
            ) : null}
          </div>

          <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur text-muted-foreground flex items-center justify-center hover:text-red-500 hover:bg-white transition-colors shadow-sm">
            <Heart className="w-4 h-4" />
          </button>
        </div>

        <CardContent className="p-4 pb-2">
          <div className="flex justify-between items-start mb-1 gap-2">
            <h3 className="font-display font-semibold text-lg line-clamp-1 text-foreground">
              {listing.title}
            </h3>
            <span className="font-bold text-lg text-primary whitespace-nowrap">
              {listing.giftItForward ? "0 NGN" : `₦${listing.price}`}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1.5 mb-3">
            <Badge variant="outline" className="text-xs bg-secondary/10 border-secondary/30 text-secondary-foreground">{listing.ageGroup}</Badge>
            <Badge variant="outline" className="text-xs bg-muted border-muted-foreground/20">{listing.condition}</Badge>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{listing.city}, {listing.state}</span>
        </CardFooter>
      </Card>
    </Link>
  );
}
