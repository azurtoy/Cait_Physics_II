import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export default async function proxy(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 PROXY:', request.nextUrl.pathname);
  console.log('   User:', user ? user.email : 'NOT AUTHENTICATED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Note: Authentication protection moved to client-side
  // Middleware only handles session refresh now

  console.log('✅ Proxy complete, proceeding normally');
  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
