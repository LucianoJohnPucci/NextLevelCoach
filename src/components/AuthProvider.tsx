
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isVerified: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isVerified: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      
      try {
        // Check if this is a password recovery flow
        const path = window.location.pathname;
        const hash = window.location.hash;
        const urlParams = new URLSearchParams(window.location.search);
        
        // Check for recovery parameters in both hash and search params
        const hashParams = new URLSearchParams(hash.substring(1));
        const isRecoveryFlow = 
          hashParams.get("type") === "recovery" ||
          urlParams.get("type") === "recovery" ||
          hashParams.has("access_token") ||
          urlParams.has("access_token");
        
        console.log("[Auth Provider] Checking for recovery flow:", { 
          isRecoveryFlow, 
          path, 
          hash,
          search: window.location.search
        });
        
        // If this is a recovery flow, redirect to reset password page
        if (isRecoveryFlow && path !== "/reset-password") {
          console.log("[Auth Provider] Recovery flow detected, redirecting to /reset-password");
          // Preserve the hash/search params for the reset password page
          const currentUrl = window.location.href;
          const newUrl = currentUrl.replace(window.location.pathname, "/reset-password");
          window.location.href = newUrl;
          return;
        }
        
        // Skip session checks for special routes
        const isResetPasswordRoute = path.includes('/reset-password');
        const isConfirmAccountRoute = path.includes('/confirm-account');
        const isOnboardingRoute = path.includes('/onboarding');
        const isAuthRoute = path.includes('/auth');
        
        if (isResetPasswordRoute || isConfirmAccountRoute || isOnboardingRoute || isAuthRoute) {
          console.log("[Auth Provider] On special route, skipping automatic redirects");
          setLoading(false);
          return;
        }
        
        // For normal routes, proceed with session check
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        if (data.session?.user) {
          setUser(data.session.user);
          
          // Check if email is verified
          const isEmailVerified = data.session.user.email_confirmed_at !== null;
          setIsVerified(isEmailVerified);
          console.log("[Auth Provider] Email verification status:", isEmailVerified);
        } else {
          setUser(null);
          setIsVerified(false);
        }
      } catch (error) {
        console.error("[Auth Provider] Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[Auth Provider] Auth state change event:", event);
        
        // Check for special routes and recovery events
        const path = window.location.pathname;
        const isResetPasswordRoute = path.includes('/reset-password');
        const isConfirmAccountRoute = path.includes('/confirm-account');
        const isOnboardingRoute = path.includes('/onboarding');
        const isAuthRoute = path.includes('/auth');
        const isRecoveryEvent = event === 'PASSWORD_RECOVERY';
        
        // Skip session updates for special routes or recovery events
        if (isResetPasswordRoute || isConfirmAccountRoute || isOnboardingRoute || isAuthRoute || isRecoveryEvent) {
          console.log("[Auth Provider] Skipping session update during special flow");
          return;
        }
        
        // For all other events, update the session state
        console.log("[Auth Provider] Updating session state for event:", event);
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          
          // Update email verification status on auth state change
          const isEmailVerified = session.user.email_confirmed_at !== null;
          setIsVerified(isEmailVerified);
          console.log("[Auth Provider] Updated email verification status:", isEmailVerified);
          
          // Redirect authenticated users to dashboard if they're on the home page
          if (window.location.pathname === "/") {
            console.log("[Auth Provider] Redirecting authenticated user to dashboard");
            navigate("/dashboard");
          }
        } else {
          setUser(null);
          setIsVerified(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // Redirect to auth page after sign out
      navigate("/auth");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    session,
    user,
    loading,
    isVerified,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
