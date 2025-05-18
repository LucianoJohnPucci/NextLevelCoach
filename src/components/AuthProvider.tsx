
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      
      try {
        // Check if this is a recovery flow from the URL or hash
        const path = window.location.pathname;
        const hash = window.location.hash;
        const cleanHash = hash.startsWith('#') ? hash.substring(1) : hash;
        const hashParams = new URLSearchParams(cleanHash);
        
        // Multiple ways to detect a recovery flow
        const isResetPasswordRoute = path.includes('/reset-password');
        const isRecoveryFlow = 
          hashParams.get("type") === "recovery" ||
          hash.includes('type=recovery') ||
          hash.includes('access_token') ||
          isResetPasswordRoute;
        
        console.log("[Auth Provider] Checking for recovery flow:", { isRecoveryFlow, path, hash });
        
        // Skip session updates for reset password route to prevent redirect loops
        if (isResetPasswordRoute) {
          console.log("[Auth Provider] On reset password route, skipping session check");
          setLoading(false);
          return;
        }
        
        // If not handling password recovery, proceed with session check
        if (!isRecoveryFlow) {
          const { data } = await supabase.auth.getSession();
          setSession(data.session);
          setUser(data.session?.user || null);
        } else {
          console.log("[Auth Provider] Recovery flow detected, skipping session check");
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
        
        // Check for password recovery or reset routes
        const path = window.location.pathname;
        const hash = window.location.hash;
        const isResetPasswordRoute = path.includes('/reset-password');
        const isRecoveryEvent = event === 'PASSWORD_RECOVERY';
        
        // Skip session updates during password recovery to prevent redirects
        if (isResetPasswordRoute || isRecoveryEvent) {
          console.log("[Auth Provider] Skipping session update during recovery flow");
          return;
        }
        
        // For all other events, update the session state
        console.log("[Auth Provider] Updating session state for event:", event);
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    session,
    user,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
