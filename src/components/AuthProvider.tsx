
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
        const path = window.location.pathname;
        console.log("[Auth Provider] Current path:", path);
        
        // COMPLETELY IGNORE password reset - don't do anything
        if (path === "/reset-password") {
          console.log("[Auth Provider] Ignoring reset-password page completely");
          setLoading(false);
          return;
        }
        
        // For other special routes, don't redirect
        const isSpecialRoute = 
          path.includes('/confirm-account') ||
          path.includes('/onboarding') ||
          path.includes('/auth');
        
        if (isSpecialRoute) {
          console.log("[Auth Provider] On special route, skipping session check");
          setLoading(false);
          return;
        }
        
        // Normal session check for all other routes
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        if (data.session?.user) {
          setUser(data.session.user);
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
        
        const path = window.location.pathname;
        
        // COMPLETELY IGNORE password reset page
        if (path === "/reset-password") {
          console.log("[Auth Provider] Ignoring auth state change on reset-password page");
          return;
        }
        
        const isSpecialRoute = 
          path.includes('/confirm-account') ||
          path.includes('/onboarding') ||
          path.includes('/auth');
        
        // Skip session updates for special routes or password recovery events
        if (event === 'PASSWORD_RECOVERY' || isSpecialRoute) {
          console.log("[Auth Provider] Skipping session update for special flow or recovery");
          return;
        }
        
        console.log("[Auth Provider] Updating session state for event:", event);
        setSession(session);
        
        if (session?.user) {
          setUser(session.user);
          const isEmailVerified = session.user.email_confirmed_at !== null;
          setIsVerified(isEmailVerified);
          console.log("[Auth Provider] Updated email verification status:", isEmailVerified);
          
          // Only redirect to dashboard if on home page
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
