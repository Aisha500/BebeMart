import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { useLocation } from "wouter";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, loginAsGuest, isAuthenticated } = useAuth();
  const [_, setLocation] = useLocation();

  if (isAuthenticated) {
    setLocation("/dashboard");
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = fd.get("email") as string;
    const password = fd.get("password") as string;
    const name = fd.get("name") as string;

    if (isLogin) {
      login({ data: { email, password } });
    } else {
      register({ data: { email, password, name, role: "both", state: "Lagos", city: "Ikeja" } });
    }
  };

  const handleGuest = () => {
    loginAsGuest({ data: { name: "Guest User", role: "buyer" } });
  };

  return (
    <AppLayout>
      <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-3xl" />
        </div>

        <Card className="w-full max-w-md p-8 rounded-[3rem] shadow-2xl bg-white/90 backdrop-blur relative z-10 border-white">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg rotate-3">
              <Heart className="text-white w-8 h-8 fill-white" />
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              {isLogin ? "Welcome Back!" : "Join the Community"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? "Log in to find amazing deals." : "Create an account to start thrifting."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Input name="name" placeholder="Full Name" required className="h-14 rounded-2xl bg-muted/50 border-transparent focus-visible:border-primary" />
              </div>
            )}
            <div>
              <Input type="email" name="email" placeholder="Email Address" required className="h-14 rounded-2xl bg-muted/50 border-transparent focus-visible:border-primary" />
            </div>
            <div>
              <Input type="password" name="password" placeholder="Password" required className="h-14 rounded-2xl bg-muted/50 border-transparent focus-visible:border-primary" />
            </div>

            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg hover-elevate">
              {isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>

          <div className="my-8 relative text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <span className="relative bg-white px-4 text-sm text-muted-foreground">or</span>
          </div>

          <Button variant="outline" onClick={handleGuest} className="w-full h-14 rounded-2xl font-bold border-2 text-foreground hover:bg-secondary/10 hover:text-secondary-foreground hover-elevate">
            Explore as Guest
          </Button>

          <p className="text-center mt-8 text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="font-bold text-primary hover:underline">
              {isLogin ? "Sign up here" : "Log in"}
            </button>
          </p>
        </Card>
      </div>
    </AppLayout>
  );
}
