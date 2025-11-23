"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../hooks/useAuth";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("🔄 Processing auth callback...");

        // Get the code from URL params
        const code = searchParams.get("code");
        
        if (!code) {
          console.error("❌ No code found in URL");
          setError("Invalid authentication link");
          setTimeout(() => router.push("/"), 2000);
          return;
        }

        // Exchange the code for a session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

        if (exchangeError) {
          console.error("❌ Exchange error:", exchangeError);
          setError(exchangeError.message);
          setTimeout(() => router.push("/"), 2000);
          return;
        }

        console.log("✅ Auth callback successful");
        
        // Wait a bit for auth state to propagate
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Redirect to dashboard
        router.replace("/dashboard");
        
      } catch (err) {
        console.error("❌ Callback error:", err);
        setError(err.message);
        setTimeout(() => router.push("/"), 2000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {error ? (
        <>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: '#fee',
            color: '#c33',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            marginBottom: '1rem'
          }}>✕</div>
          <h2 style={{ margin: '0 0 0.5rem', color: '#333' }}>Authentication Error</h2>
          <p style={{ color: '#666', textAlign: 'center', maxWidth: '400px' }}>{error}</p>
          <p style={{ color: '#999', fontSize: '14px', marginTop: '1rem' }}>Redirecting to home...</p>
        </>
      ) : (
        <>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #eee',
            borderTop: '3px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <h2 style={{ margin: '1rem 0 0.5rem', color: '#333' }}>Completing sign in...</h2>
          <p style={{ color: '#666' }}>Please wait a moment</p>
        </>
      )}
      
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}