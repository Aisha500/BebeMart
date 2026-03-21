import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetListings } from "@workspace/api-client-react";
import { ListingCard } from "@/components/ListingCard";
import { Filter, SlidersHorizontal, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { filterStaticListings } from "@/data/static-listings";

export default function Browse() {
  const [params, setParams] = useState<Record<string, any>>({});
  
  // Parse query params on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const initialParams: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      if (key === 'giftItForward') initialParams[key] = value === 'true';
      else initialParams[key] = value;
    });
    setParams(initialParams);
  }, []);

  const { data, isLoading, isError } = useGetListings(params);
  const staticData = filterStaticListings(params);
  const displayData = (data?.listings && data.listings.length > 0) ? data : staticData;

  const updateParam = (key: string, value: any) => {
    setParams(prev => {
      const next = { ...prev, [key]: value };
      if (!value || value === 'all') delete next[key];
      return next;
    });
  };

  const clearFilters = () => setParams({});

  const hasFilters = Object.keys(params).filter(k => k !== 'page' && k !== 'limit').length > 0;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground">
              {params.giftItForward ? "Gift It Forward Items" : "Browse Market"}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {displayData.total || 0} wonderful finds waiting for a new home
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="rounded-full font-bold bg-white border-2 border-border hover:bg-secondary/10 hover:border-secondary">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters {hasFilters && <Badge className="ml-2 bg-primary text-white">!</Badge>}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-background overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle className="font-display text-2xl flex justify-between items-center">
                    Filters
                    {hasFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-destructive font-bold text-sm">
                        Clear All
                      </Button>
                    )}
                  </SheetTitle>
                </SheetHeader>
                
                <div className="space-y-8">
                  <div className="space-y-3">
                    <label className="font-bold text-foreground">Category</label>
                    <Select value={params.category || "all"} onValueChange={(v) => updateParam("category", v)}>
                      <SelectTrigger className="h-12 rounded-xl border-2">
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="Clothes">Clothes</SelectItem>
                        <SelectItem value="Shoes">Shoes</SelectItem>
                        <SelectItem value="Toys">Toys</SelectItem>
                        <SelectItem value="Gear">Baby Gear</SelectItem>
                        <SelectItem value="Books">Books</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="font-bold text-foreground">Age Group</label>
                    <Select value={params.ageGroup || "all"} onValueChange={(v) => updateParam("ageGroup", v)}>
                      <SelectTrigger className="h-12 rounded-xl border-2">
                        <SelectValue placeholder="Any Age" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any Age</SelectItem>
                        <SelectItem value="0-6m">0-6 months</SelectItem>
                        <SelectItem value="6-12m">6-12 months</SelectItem>
                        <SelectItem value="1-3y">1-3 years</SelectItem>
                        <SelectItem value="4-6y">4-6 years</SelectItem>
                        <SelectItem value="7y+">7+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <label className="font-bold text-foreground">Location (State)</label>
                    <Select value={params.state || "all"} onValueChange={(v) => updateParam("state", v)}>
                      <SelectTrigger className="h-12 rounded-xl border-2">
                        <SelectValue placeholder="Anywhere in Nigeria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Anywhere in Nigeria</SelectItem>
                        <SelectItem value="Lagos">Lagos</SelectItem>
                        <SelectItem value="Abuja">Abuja</SelectItem>
                        <SelectItem value="Rivers">Rivers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3 p-4 bg-orange-50 rounded-2xl border border-orange-200">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-orange-800 flex items-center gap-2">
                        <img src={`${import.meta.env.BASE_URL}images/gift-badge.png`} alt="" className="w-5 h-5"/>
                        Gift-It-Forward Only
                      </label>
                      <button 
                        onClick={() => updateParam("giftItForward", !params.giftItForward)}
                        className={`w-12 h-6 rounded-full transition-colors relative ${params.giftItForward ? 'bg-orange-500' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${params.giftItForward ? 'translate-x-6' : ''}`} />
                      </button>
                    </div>
                    <p className="text-xs text-orange-700/80">Show only free items (just pay 500 NGN platform fee)</p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t">
                  <SheetClose asChild>
                    <Button className="w-full h-12 rounded-full font-bold text-lg shadow-lg hover-elevate">Show Results</Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters Row */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.entries(params).map(([key, value]) => {
              if (key === 'page' || key === 'limit') return null;
              if (key === 'giftItForward' && !value) return null;
              
              let displayValue = value;
              if (key === 'giftItForward') displayValue = "Gift It Forward";
              
              return (
                <Badge key={key} className="px-3 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground font-semibold border-secondary/30 flex items-center gap-1">
                  {displayValue}
                  <X className="w-3.5 h-3.5 ml-1 cursor-pointer hover:text-destructive" onClick={() => updateParam(key, null)} />
                </Badge>
              );
            })}
          </div>
        )}

        {/* Grid */}
        {isLoading && !isError ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="rounded-3xl bg-white p-4 h-80 animate-pulse border border-border">
                <div className="w-full h-48 bg-muted rounded-2xl mb-4"></div>
                <div className="w-3/4 h-6 bg-muted rounded mb-2"></div>
                <div className="w-1/2 h-4 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        ) : displayData.listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayData.listings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-3xl border border-border">
            <img src={`${import.meta.env.BASE_URL}images/empty-nursery.png`} alt="Empty" className="w-48 h-48 mx-auto opacity-80 mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
            <Button variant="outline" onClick={clearFilters} className="rounded-full border-2 font-bold hover-elevate">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
