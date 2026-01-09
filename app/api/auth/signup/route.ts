import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password, nickname } = await request.json();
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Route Handler Signup:');
  console.log('   Email:', email);
  console.log('   Nickname:', nickname);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const supabase = await createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
      },
    },
  });

  if (error) {
    console.log('❌ Signup failed:', error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }

  console.log('✅ Signup successful:', data.user?.email);
  
  return NextResponse.json({ success: true });
}
