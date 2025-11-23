import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { User, Session, AuthError, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { queryClient } from "../lib/queryClient";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // 세션 무효화 및 캐시 클리어
  const clearSession = useCallback(() => {
    setSession(null);
    setUser(null);
    // 모든 쿼리 캐시 무효화
    queryClient.clear();
  }, []);

  // 세션 갱신
  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
    } catch (error) {
      console.error("Failed to refresh session:", error);
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    let mounted = true;

    // 초기 세션 확인
    const initializeSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          if (mounted) {
            clearSession();
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to initialize session:", error);
        if (mounted) {
          clearSession();
          setLoading(false);
        }
      }
    };

    initializeSession();

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return;

        console.log("Auth state changed:", event);

        switch (event) {
          case "SIGNED_IN":
          case "TOKEN_REFRESHED":
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            break;

          case "SIGNED_OUT":
            clearSession();
            setLoading(false);
            break;

          case "USER_UPDATED":
            if (session) {
              setSession(session);
              setUser(session.user);
            }
            break;

          case "PASSWORD_RECOVERY":
            // 비밀번호 재설정 이벤트는 별도 처리
            break;

          default:
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }
      }
    );

    // 주기적으로 세션 상태 확인 (5분마다)
    const sessionCheckInterval = setInterval(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!mounted) return;

        if (!session) {
          clearSession();
        } else {
          // 세션이 있으면 사용자 정보 업데이트
          setSession(session);
          setUser(session.user);
        }
      });
    }, 5 * 60 * 1000); // 5분

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearInterval(sessionCheckInterval);
    };
  }, [clearSession]);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: error as AuthError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        // 로그아웃 성공 시 세션 및 캐시 클리어
        clearSession();
      }
      return { error };
    } catch (error) {
      console.error("Sign out error:", error);
      // 에러가 발생해도 세션 클리어
      clearSession();
      return { error: error as AuthError };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error("Reset password error:", error);
      return { error: error as AuthError };
    }
  };

  const value = {
    user,
    session,
    loading,
    isAuthenticated: !!user && !!session,
    signUp,
    signIn,
    signOut,
    resetPassword,
    refreshSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}









