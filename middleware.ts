import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // /study 경로에 대한 접근 제어
  if (request.nextUrl.pathname.startsWith('/study')) {
    const authToken = request.cookies.get('auth_token');

    // 쿠키가 없으면 메인 포털로 리다이렉트
    if (!authToken) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Middleware가 실행될 경로 설정
export const config = {
  matcher: '/study/:path*',
};
