import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Home, Search, PlusCircle, MessageCircle, User, LogOut, Heart, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("q");
    if (query) setLocation(`/browse?search=${encodeURIComponent(query as string)}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20 md:pb-0">
      {/* Desktop Header */}
      <header className="sticky top-0 z-50 glass-card border-b border-white/50 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <Heart className="text-white w-6 h-6 fill-white" />
            </div>
            <span className="font-display font-bold text-2xl text-foreground hidden sm:block">
              Bebe<span className="text-primary">Mart</span>
            </span>
          </Link>

          <div className="flex-1 max-w-xl mx-auto hidden md:block">
            <form onSubmit={handleSearch} className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
              <Input 
                name="q"
                placeholder="Search for clothes, toys, gear..." 
                className="w-full pl-12 pr-4 h-12 rounded-full border-2 border-border bg-white shadow-sm focus-visible:ring-primary focus-visible:border-primary text-base"
              />
            </form>
          </div>

          <nav className="hidden md:flex items-center gap-3">
            <Link href="/browse">
              <Button variant="ghost" className="rounded-full font-semibold hover:bg-secondary/20 hover:text-secondary-foreground text-foreground">
                Browse
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link href="/messages">
                  <Button variant="ghost" size="icon" className="rounded-full relative text-foreground hover:bg-secondary/20">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="rounded-full font-semibold text-foreground hover:bg-secondary/20">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/sell">
                  <Button className="rounded-full font-bold shadow-lg shadow-primary/30 hover-elevate bg-primary text-primary-foreground">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Sell Item
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => logout()} className="rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <LogOut className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <Link href="/auth">
                <Button className="rounded-full font-bold shadow-lg shadow-primary/30 hover-elevate bg-primary text-primary-foreground">
                  Login / Sign Up
                </Button>
              </Link>
            )}
          </nav>
          
          {/* Mobile Search Icon Only */}
          <div className="md:hidden">
            <Link href="/browse">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          key={location}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-white/50 px-6 py-3 flex items-center justify-between z-50 safe-area-pb">
        <MobileNavLink href="/" icon={<Home />} label="Home" current={location} />
        <MobileNavLink href="/browse" icon={<ShoppingBag />} label="Browse" current={location} />
        <div className="-mt-8">
          <Link href={isAuthenticated ? "/sell" : "/auth"}>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl shadow-primary/30 text-white hover:scale-105 transition-transform">
              <PlusCircle className="w-7 h-7" />
            </div>
          </Link>
        </div>
        <MobileNavLink href={isAuthenticated ? "/messages" : "/auth"} icon={<MessageCircle />} label="Messages" current={location} />
        <MobileNavLink href={isAuthenticated ? "/dashboard" : "/auth"} icon={<User />} label="Profile" current={location} />
      </nav>
    </div>
  );
}

function MobileNavLink({ href, icon, label, current }: { href: string, icon: React.ReactNode, label: string, current: string }) {
  const isActive = current === href || (href !== '/' && current.startsWith(href));
  
  return (
    <Link href={href} className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
      <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-primary/10' : ''}`}>
        {icon}
      </div>
      <span className="text-[10px] font-semibold">{label}</span>
    </Link>
  );
}
