"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

// 🔑 Konfigurasi Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("❌ Supabase environment variables are missing!");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 📌 Context untuk Auth
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

// 📌 Hook untuk konsumsi Auth
export const useAuth = () => {
  return useContext(AuthContext);
};

// 📌 Hook utama
function useProvideAuth() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Auto-create profile jika belum ada
  const fetchProfile = async (userId, userEmail = null) => {
    try {
      console.log("🔍 Fetching profile for user:", userId);
      
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      // Jika profile tidak ada, buat baru dengan role 'user'
      if (error && error.code === 'PGRST116') {
        console.log("⚠️ Profile not found, creating new profile...");
        
        const newProfile = {
          id: userId,
          email: userEmail,
          role: 'user',
          full_name: null,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert([newProfile])
          .select()
          .single();

        if (createError) {
          console.error("❌ Error creating profile:", createError);
          throw createError;
        }

        console.log("✅ Profile created successfully:", createdProfile);
        data = createdProfile;
      } else if (error) {
        throw error;
      }

      // Fallback jika role masih null/undefined
      if (!data.role || data.role.trim() === '') {
        console.log("⚠️ Role is empty, setting to 'user'");
        
        const { data: updatedProfile, error: updateError } = await supabase
          .from("profiles")
          .update({ role: 'user' })
          .eq("id", userId)
          .select()
          .single();

        if (!updateError && updatedProfile) {
          data = updatedProfile;
        } else {
          data.role = 'user';
        }
      }

      console.log("✅ Profile fetched:", data);
      setProfile(data);
      return data;
    } catch (error) {
      console.error("❌ Error in fetchProfile:", error.message);
      
      const fallbackProfile = {
        id: userId,
        email: userEmail,
        role: 'user',
        full_name: null,
        avatar_url: null,
      };
      
      console.log("⚠️ Using fallback profile:", fallbackProfile);
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  // ✅ Sign in with email & password
  const signIn = async (email, password) => {
    try {
      console.log("🔐 USEAUTH: Starting sign in...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log("✅ USEAUTH: Sign in successful");
      
      const userProfile = await fetchProfile(data.user.id, data.user.email);
      setCurrentUser(data.user);
      
      return { data, profile: userProfile, error: null };
    } catch (error) {
      console.error("❌ USEAUTH: Sign in error:", error.message);
      return { data: null, profile: null, error };
    }
  };

  // ✅ Sign up with email & password
  const signUp = async (email, password, metadata = {}) => {
    try {
      console.log("🔐 USEAUTH: Starting sign up...");
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      console.log("✅ USEAUTH: Sign up successful");
      
      if (data.user) {
        await fetchProfile(data.user.id, data.user.email);
      }
      
      return { data, error: null };
    } catch (error) {
      console.error("❌ USEAUTH: Sign up error:", error.message);
      return { data: null, error };
    }
  };

  // ✅ OAuth login
  const signInWithOAuth = async (provider) => {
    try {
      console.log(`🔐 USEAUTH: Starting ${provider} OAuth...`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      console.log(`✅ USEAUTH: ${provider} OAuth initiated`);
      return { data, error: null };
    } catch (error) {
      console.error(`❌ USEAUTH: ${provider} OAuth error:`, error.message);
      return { data: null, error };
    }
  };

  // 🔥 OPTIMIZED SIGN OUT - INSTANT!
  const signOut = async () => {
    try {
      console.log("🚪 Starting optimized sign out...");
      
      // 1. IMMEDIATE STATE CLEANUP (UI updates instantly)
      setCurrentUser(null);
      setProfile(null);
      
      // 2. CLEAR SESSION STORAGE (instant)
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("auth:user");
      }
      
      // 3. NAVIGATE IMMEDIATELY (don't wait for Supabase)
      router.push("/");
      router.refresh();
      
      // 4. BACKGROUND CLEANUP (fire and forget)
      // Supabase signOut runs in background, don't block UI
      supabase.auth.signOut().catch(err => {
        console.error("⚠️ Background signOut error (non-blocking):", err);
      });
      
      console.log("✅ Sign out completed (instant)");
      return { error: null };
      
    } catch (error) {
      console.error("❌ SignOut error:", error.message);
      
      // Even if error, force logout locally
      setCurrentUser(null);
      setProfile(null);
      router.push("/");
      
      return { error };
    }
  };

  // ✅ Reset password
  const resetPassword = async (email) => {
    try {
      console.log("🔐 USEAUTH: Sending password reset email...");
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      console.log("✅ USEAUTH: Password reset email sent");
      return { error: null };
    } catch (error) {
      console.error("❌ USEAUTH: Reset password error:", error.message);
      return { error };
    }
  };

  // ✅ Initialize session on mount - OPTIMIZED
  useEffect(() => {
    let mounted = true; // Prevent state updates after unmount
    let profileFetchInProgress = false; // Prevent duplicate fetches
    
    const initSession = async () => {
      try {
        setLoading(true);
        
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return; // Component unmounted, bail out

        if (session?.user) {
          setCurrentUser(session.user);
          
          // Only fetch profile if not already fetching
          if (!profileFetchInProgress) {
            profileFetchInProgress = true;
            await fetchProfile(session.user.id, session.user.email);
            profileFetchInProgress = false;
          }
        } else {
          setCurrentUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("❌ Session init error:", error);
        if (mounted) {
          setCurrentUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initSession();

    // Listen to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("🔄 Auth state changed:", event);

      if (!mounted) return; // Component unmounted

      if (event === 'SIGNED_OUT') {
        // Clear state immediately on sign out event
        setCurrentUser(null);
        setProfile(null);
        return;
      }

      if (session?.user) {
        setCurrentUser(session.user);
        
        // CRITICAL: Only fetch profile if:
        // 1. We don't have a profile yet
        // 2. OR the user ID changed
        // 3. AND not already fetching
        if ((!profile || profile.id !== session.user.id) && !profileFetchInProgress) {
          profileFetchInProgress = true;
          await fetchProfile(session.user.id, session.user.email);
          profileFetchInProgress = false;
        }
        
        // Only refresh on sign in, not on sign out or token refresh
        if (event === 'SIGNED_IN') {
          router.refresh();
        }
      } else {
        setCurrentUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false; // Cleanup flag
      subscription.unsubscribe();
    };
  }, []); // Empty deps - only run once on mount

  return {
    currentUser,
    profile,
    loading,
    signIn,
    signUp,
    signInWithOAuth,
    signOut,
    resetPassword,
    supabase,
  };
}

export { supabase };