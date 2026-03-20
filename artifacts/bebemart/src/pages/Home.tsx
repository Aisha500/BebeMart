import { Link } from "wouter";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useGetListings } from "@workspace/api-client-react";
import { ListingCard } from "@/components/ListingCard";
import { Search, ArrowRight, Baby, Shirt, Puzzle, BookOpen, CarFront, ShoppingBag, ShieldCheck, Truck, BadgeCheck, HandCoins } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const CATEGORIES = [
  { name: "Clothes", icon: <Shirt className="w-6 h-6" />, color: "bg-pink-100 text-pink-600" },
  { name: "Shoes", icon: <Baby className="w-6 h-6" />, color: "bg-blue-100 text-blue-600" },
  { name: "Toys", icon: <Puzzle className="w-6 h-6" />, color: "bg-yellow-100 text-yellow-600" },
  { name: "Gear", icon: <CarFront className="w-6 h-6" />, color: "bg-green-100 text-green-600" },
  { name: "Books", icon: <BookOpen className="w-6 h-6" />, color: "bg-purple-100 text-purple-600" },
];

export default function Home() {
  const [_, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: listingsData, isLoading } = useGetListings({ limit: 8 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-24 md:pb-32 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Playful background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground mb-6 drop-shadow-sm leading-tight">
            Big Love for <span className="text-primary relative inline-block">
              Little Prices
              <svg className="absolute -bottom-2 w-full h-3 text-accent" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
            The friendliest kids' thrift marketplace in Nigeria. Everything under ₦5,000!
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative flex items-center group">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary group-focus-within:bg-primary group-focus-within:text-white transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <Input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What is your little one looking for today?" 
              className="w-full h-16 pl-16 pr-32 rounded-[2rem] border-4 border-white bg-white/90 backdrop-blur text-lg shadow-xl focus-visible:ring-primary focus-visible:border-primary focus-visible:bg-white transition-all"
            />
            <Button type="submit" className="absolute right-2 top-2 bottom-2 rounded-[1.5rem] px-6 font-bold shadow-md hover-elevate">
              Find It
            </Button>
          </form>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 px-4 bg-white relative z-20 -mt-8 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-8">
            <h2 className="text-3xl font-display font-bold text-foreground">Explore by Category</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            {CATEGORIES.map((cat) => (
              <Link key={cat.name} href={`/browse?category=${cat.name}`} className="group hover-elevate cursor-pointer">
                <div className="bg-background border border-border/50 rounded-3xl p-6 text-center shadow-sm group-hover:shadow-md transition-all flex flex-col items-center justify-center gap-4 h-full">
                  <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <span className="font-bold text-lg text-foreground">{cat.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-sky-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-primary/10 text-primary border-none font-bold px-4 py-1.5 text-sm rounded-full">
              Safe &amp; Secure Shopping
            </Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              How BebeMart Protects You
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Your money never goes directly to the seller. We hold it safely until you receive your item — that's our escrow promise.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
              {[
                {
                  icon: <ShoppingBag className="w-7 h-7" />,
                  color: "bg-sky-100 text-sky-600",
                  ring: "ring-sky-200",
                  step: "1",
                  title: "Browse & Buy",
                  desc: "Find a great item and tap \"Buy Now with Escrow\" to begin your purchase.",
                },
                {
                  icon: <ShieldCheck className="w-7 h-7" />,
                  color: "bg-emerald-100 text-emerald-600",
                  ring: "ring-emerald-200",
                  step: "2",
                  title: "We Hold Your Money",
                  desc: "Your payment is held securely by BebeMart — the seller cannot touch it yet.",
                },
                {
                  icon: <Truck className="w-7 h-7" />,
                  color: "bg-yellow-100 text-yellow-600",
                  ring: "ring-yellow-200",
                  step: "3",
                  title: "Seller Ships It",
                  desc: "The seller ships the item and marks it as sent. You'll be notified to watch out for it.",
                },
                {
                  icon: <HandCoins className="w-7 h-7" />,
                  color: "bg-orange-100 text-orange-600",
                  ring: "ring-orange-200",
                  step: "4",
                  title: "Confirm & Pay Released",
                  desc: "Once you confirm delivery, funds are released to the seller. Everyone wins!",
                },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center text-center group">
                  <div className={`relative w-24 h-24 rounded-full ${item.color} ring-4 ${item.ring} flex items-center justify-center shadow-md mb-5 group-hover:scale-105 transition-transform`}>
                    {item.icon}
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-foreground text-background text-xs font-black flex items-center justify-center shadow">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-base leading-relaxed max-w-[220px]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 bg-emerald-50 border border-emerald-200 rounded-3xl p-6">
            <BadgeCheck className="w-10 h-10 text-emerald-600 flex-shrink-0" />
            <p className="text-base text-emerald-800 font-medium text-center sm:text-left">
              <strong>BebeMart Buyer Guarantee:</strong> If your item never arrives or is significantly different from the listing, you get a full refund. No stress, no wahala.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground mb-2">Fresh Finds</h2>
              <p className="text-muted-foreground text-lg">Just listed by parents near you</p>
            </div>
            <Link href="/browse">
              <Button variant="ghost" className="hidden sm:flex rounded-full text-primary hover:text-primary hover:bg-primary/10 font-bold group">
                View All <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-3xl bg-white p-4 h-80 animate-pulse border border-border">
                  <div className="w-full h-48 bg-muted rounded-2xl mb-4"></div>
                  <div className="w-3/4 h-6 bg-muted rounded mb-2"></div>
                  <div className="w-1/2 h-4 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : listingsData?.listings && listingsData.listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listingsData.listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-border">
              <img src={`${import.meta.env.BASE_URL}images/empty-nursery.png`} alt="Empty" className="w-48 h-48 mx-auto opacity-80 mb-6" />
              <h3 className="text-2xl font-bold text-foreground mb-2">It's a bit quiet here</h3>
              <p className="text-muted-foreground mb-6">Be the first to list an item in the marketplace!</p>
              <Link href="/sell">
                <Button className="rounded-full px-8 py-6 text-lg font-bold hover-elevate shadow-lg">Start Selling</Button>
              </Link>
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href="/browse">
              <Button variant="outline" className="rounded-full w-full border-2">View All Listings</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Gift it Forward Banner */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-accent/20 via-orange-100 to-accent/40 rounded-[3rem] p-8 md:p-12 relative overflow-hidden border-2 border-accent/50 shadow-xl">
            <div className="relative z-10 md:w-2/3">
              <div className="flex items-center gap-3 mb-4">
                <img src={`${import.meta.env.BASE_URL}images/gift-badge.png`} className="w-12 h-12 drop-shadow-md" alt="" />
                <Badge className="bg-white text-orange-600 font-bold uppercase tracking-wider shadow-sm border-none">Community Program</Badge>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                Gift-It-Forward
              </h2>
              <p className="text-xl text-foreground/80 mb-8 font-medium">
                Got clothes your little one outgrew but are still in great condition? List them for 0 NGN. Buyers just pay a tiny 500 NGN platform fee + delivery.
              </p>
              <Link href="/browse?giftItForward=true">
                <Button className="rounded-full bg-orange-500 hover:bg-orange-600 text-white border-none text-lg px-8 py-6 font-bold shadow-lg shadow-orange-500/30 hover-elevate">
                  Browse Free Items
                </Button>
              </Link>
            </div>
            
            <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-accent/30 rounded-full blur-3xl z-0" />
            <div className="absolute right-10 top-10 hidden md:block z-10 animate-[bounce_3s_ease-in-out_infinite]">
              <img src={`${import.meta.env.BASE_URL}images/gift-badge.png`} className="w-48 h-48 drop-shadow-2xl opacity-90 rotate-12" alt="" />
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
