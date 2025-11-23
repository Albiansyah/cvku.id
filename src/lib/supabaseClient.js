// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ✅ Enhanced debugging untuk environment variables
console.log('🔧 SUPABASE CONFIG CHECK:');
console.log('🔧 URL exists:', !!supabaseUrl);
console.log('🔧 KEY exists:', !!supabaseAnonKey);
console.log('🔧 URL value:', supabaseUrl || 'UNDEFINED');
console.log('🔧 KEY prefix:', supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : 'UNDEFINED');

// ✅ Environment detection
console.log('🌍 Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isClient: typeof window !== 'undefined',
  isServer: typeof window === 'undefined'
});

// ✅ Enhanced error checking
if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  console.error('💥 SUPABASE ERROR: Missing environment variables:', missingVars);
  console.error('💥 Current working directory:', process.cwd?.());
  console.error('💥 All environment variables starting with NEXT_PUBLIC:');
  
  // Log all NEXT_PUBLIC env vars for debugging
  Object.keys(process.env)
    .filter(key => key.startsWith('NEXT_PUBLIC'))
    .forEach(key => {
      console.error(`💥 ${key}:`, process.env[key] ? 'SET' : 'UNDEFINED');
    });
  
  throw new Error(
    `❌ Supabase environment variables are missing: ${missingVars.join(', ')}. ` +
    "Pastikan .env.local sudah diisi dengan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
    "Restart development server setelah menambahkan environment variables."
  );
}

// ✅ Validate URL format
try {
  const urlObject = new URL(supabaseUrl);
  console.log('✅ SUPABASE: URL format valid');
  console.log('✅ SUPABASE: Host:', urlObject.host);
  console.log('✅ SUPABASE: Protocol:', urlObject.protocol);
} catch (error) {
  console.error('💥 SUPABASE: Invalid URL format:', error.message);
  throw new Error(`❌ NEXT_PUBLIC_SUPABASE_URL format is invalid: ${supabaseUrl}`);
}

// ✅ Validate anon key format (should start with 'eyJ')
if (!supabaseAnonKey.startsWith('eyJ')) {
  console.warn('⚠️  SUPABASE: Anon key might be invalid (should start with "eyJ")');
  console.warn('⚠️  Current key starts with:', supabaseAnonKey.substring(0, 5));
}

// ✅ Create Supabase client with enhanced options
const supabaseOptions = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  // ✅ Add debug info for client creation
  global: {
    headers: {
      'x-client-info': 'nextjs-app'
    }
  }
};

console.log('🚀 SUPABASE: Creating client with options:', supabaseOptions);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

// ✅ Test client creation and basic functionality
console.log('✅ SUPABASE: Client created successfully');
console.log('✅ SUPABASE: Client object exists:', !!supabase);
console.log('✅ SUPABASE: Auth object exists:', !!supabase.auth);
console.log('✅ SUPABASE: From method exists:', typeof supabase.from === 'function');

// ✅ Basic connection test (only on client-side to avoid server issues)
if (typeof window !== 'undefined') {
  console.log('🔬 SUPABASE: Running client-side tests...');
  
  // Test auth methods availability
  const authMethods = [
    'getSession',
    'getUser', 
    'signInWithPassword',
    'signOut',
    'onAuthStateChange'
  ];
  
  authMethods.forEach(method => {
    const exists = typeof supabase.auth[method] === 'function';
    console.log(`✅ SUPABASE: auth.${method}`, exists ? 'EXISTS' : 'MISSING');
    
    if (!exists) {
      console.error(`💥 SUPABASE: Critical auth method missing: ${method}`);
    }
  });
  
  // Test basic session (non-blocking)
  setTimeout(async () => {
    try {
      console.log('🔬 SUPABASE: Testing getSession...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('💥 SUPABASE: getSession error:', error);
      } else {
        console.log('✅ SUPABASE: getSession successful');
        console.log('✅ SUPABASE: Has session:', !!session);
        console.log('✅ SUPABASE: User:', session?.user?.email || 'No user');
      }
    } catch (testError) {
      console.error('💥 SUPABASE: Connection test failed:', testError);
    }
  }, 1000);
  
  // Make client available globally for debugging
  window.supabase = supabase;
  window.supabaseDebug = {
    url: supabaseUrl,
    keyPrefix: supabaseAnonKey.substring(0, 20) + '...',
    testConnection: async () => {
      try {
        console.log('🧪 Testing Supabase connection...');
        const { data, error } = await supabase.auth.getSession();
        console.log('🧪 Connection test result:', { data: !!data, error });
        return { success: !error, data, error };
      } catch (err) {
        console.error('🧪 Connection test failed:', err);
        return { success: false, error: err };
      }
    }
  };
  
  console.log('🛠️  SUPABASE: Debug tools available in window.supabaseDebug');
}

// ✅ Export additional utilities
export const supabaseConfig = {
  url: supabaseUrl,
  isConfigured: !!(supabaseUrl && supabaseAnonKey),
  environment: process.env.NODE_ENV
};

// ✅ Connection health check function
export const checkSupabaseHealth = async () => {
  try {
    console.log('🏥 SUPABASE HEALTH CHECK: Starting...');
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    const healthStatus = {
      timestamp: new Date().toISOString(),
      client: !!supabase,
      auth: !!supabase.auth,
      sessionCheck: !error,
      hasSession: !!session,
      user: session?.user?.email || null,
      error: error?.message || null
    };
    
    console.log('🏥 SUPABASE HEALTH CHECK:', healthStatus);
    return healthStatus;
  } catch (error) {
    console.error('💥 SUPABASE HEALTH CHECK FAILED:', error);
    return {
      timestamp: new Date().toISOString(),
      client: !!supabase,
      error: error.message,
      healthy: false
    };
  }
};

console.log('🎯 SUPABASE: Client setup complete');

// ✅ Final verification
if (!supabase || !supabase.auth || typeof supabase.from !== 'function') {
  console.error('💥 SUPABASE: Client setup verification failed');
  throw new Error('❌ Supabase client was not properly initialized');
} else {
  console.log('✅ SUPABASE: All systems ready');
}
