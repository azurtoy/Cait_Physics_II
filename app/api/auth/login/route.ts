import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Route Handler Login:');
  console.log('   Email:', email);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Use plain Supabase client (not SSR client)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log('❌ Login failed:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 401 }
    );
  }

  console.log('✅ Login successful:', data.user?.email);
  console.log('   Session:', data.session ? 'CREATED' : 'NO SESSION');
  
  if (!data.session) {
    console.log('❌ No session created');
    return NextResponse.json(
      { success: false, error: 'No session created' },
      { status: 500 }
    );
  }
  
  // Create response
  const response = NextResponse.json({ success: true });
  
  // Manually encode session as cookie
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL!.split('//')[1].split('.')[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  const cookieValue = btoa(JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
    expires_at: data.session.expires_at,
    expires_in: data.session.expires_in,
    token_type: data.session.token_type,
    user: data.session.user,
  }));
  
  console.log('🍪 Setting auth cookie manually:');
  console.log(`  - Name: ${cookieName}`);
  console.log(`  - Length: ${cookieValue.length} chars`);
  
  // Set the cookie with proper options
  response.cookies.set(cookieName, cookieValue, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  
  console.log('✅ Auth cookie set in Response');
  
  return response;
}
