// app/api/auth/sync/route.js
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    console.log('🔄 Auth sync API called');
    
    const supabase = createRouteHandlerClient({ cookies });
    
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return NextResponse.json({ error: 'Session error' }, { status: 401 });
    }

    if (!session?.user) {
      console.error('❌ No user in session');
      return NextResponse.json({ error: 'No user found' }, { status: 401 });
    }

    const user = session.user;
    console.log('✅ User found:', user.email);

    // Get request body (jika ada data yang perlu disync)
    const body = await request.json().catch(() => ({}));
    
    // Sync user profile to your database (optional)
    // Misalnya simpan ke table profiles:
    /*
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('❌ Profile sync error:', profileError);
      return NextResponse.json({ error: 'Profile sync failed' }, { status: 500 });
    }
    */

    // Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
        avatar_url: user.user_metadata?.avatar_url,
      }
    });

  } catch (error) {
    console.error('❌ Auth sync error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Handle GET request juga (optional)
export async function GET() {
  return NextResponse.json({ message: 'Auth sync endpoint is working' });
}