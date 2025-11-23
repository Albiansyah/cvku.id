"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedPage Component
 * Wrap any page that needs authentication + role-based access
 * 
 * Usage:
 * <ProtectedPage allowedRoles={['user']}>
 *   <YourPageContent />
 * </ProtectedPage>
 */
export default function ProtectedPage({ 
  children, 
  allowedRoles = ['user'],
  redirectTo = '/'
}) {
  const { currentUser, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Not authenticated - redirect to home
    if (!currentUser) {
      console.log('❌ Not authenticated, redirecting to home...');
      router.push(redirectTo);
      return;
    }

    // Check role permission
    const userRole = (profile?.role || 'user').toLowerCase().trim();
    
    if (!allowedRoles.includes(userRole)) {
      console.log(`❌ Access denied: ${userRole} not allowed, redirecting...`);
      
      // Redirect to correct dashboard based on role
      const roleRedirectMap = {
        super_admin: '/admin/dashboard',
        admin: '/admin/dashboard',
        recruiter: '/recruiter/dashboard',
        courses_manager: '/courses-admin/dashboard',
        user: '/dashboard',
      };
      
      const correctDashboard = roleRedirectMap[userRole] || '/';
      router.push(correctDashboard);
    }
  }, [currentUser, profile, loading, router, allowedRoles, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '1rem',
        fontFamily: "'Poppins', sans-serif"
      }}>
        <Loader2 size={48} style={{ animation: 'spin 1s linear infinite', color: '#667eea' }} />
        <p style={{ color: '#86868b', fontSize: '0.9375rem' }}>Loading...</p>
        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Not authenticated - don't render content
  if (!currentUser) {
    return null;
  }

  // Check role permission
  const userRole = (profile?.role || 'user').toLowerCase().trim();
  if (!allowedRoles.includes(userRole)) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}