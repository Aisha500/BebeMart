import { useGetMe, useLoginUser, useRegisterUser, useLogoutUser, useLoginAsGuest } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: user, isLoading, error } = useGetMe({
    query: {
      retry: false,
    }
  });

  const loginMutation = useLoginUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
        toast({ title: "Welcome back!", description: "Successfully logged in." });
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Login failed", description: err.error || "Invalid credentials." });
      }
    }
  });

  const registerMutation = useRegisterUser({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
        toast({ title: "Welcome to BebeMart!", description: "Your account has been created." });
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Registration failed", description: err.error || "Could not create account." });
      }
    }
  });

  const guestLoginMutation = useLoginAsGuest({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/api/users/me"] });
        toast({ title: "Playing as Guest", description: "You are exploring as a guest user." });
      },
      onError: () => {
        toast({ variant: "destructive", title: "Guest login failed" });
      }
    }
  });

  const logoutMutation = useLogoutUser({
    mutation: {
      onSuccess: () => {
        queryClient.setQueryData(["/api/users/me"], null);
        toast({ title: "Logged out", description: "See you next time!" });
      }
    }
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    loginAsGuest: guestLoginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
