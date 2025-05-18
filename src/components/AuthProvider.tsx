
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
        // Check if this is a recovery flow from the URL
        const hash = window.location.hash;
        const isRecoveryFlow = hash.includes('type=recovery');
        
        // If not handling password recovery, proceed with session check
        if (!isRecoveryFlow) {
          const { data } = await supabase.auth.getSession();
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (error) {
        console.error("Error getting session:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("[Auth] Auth state change event:", event);
        
        // Skip session updates during password recovery to prevent redirects
        const isRecoveryFlow = window.location.hash.includes('type=recovery') || 
                               event === 'PASSWORD_RECOVERY';
        
        if (!isRecoveryFlow) {
          setSession(session);
          setUser(session?.user || null);
          setLoading(false);
        } else {
          console.log("[Auth] Skipping session update during recovery flow");
        }
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
