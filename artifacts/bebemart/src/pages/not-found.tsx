import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <AppLayout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-9xl font-display font-black text-primary/20 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-foreground mb-4">Oops! Page not found.</h2>
        <p className="text-muted-foreground mb-8 text-lg max-w-md">
          Looks like this page crawled away. Let's get you back to finding great deals.
        </p>
        <Link href="/">
          <Button className="rounded-full px-8 py-6 text-lg font-bold shadow-lg hover-elevate">
            Back to Home
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}
