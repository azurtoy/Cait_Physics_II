'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function authenticateUser(formData: FormData) {
  try {
    const password = formData.get('password') as string;
    const sitePassword = process.env.SITE_PASSWORD || 'default_password';

    console.log('Authentication attempt:', { hasPassword: !!password, hasSitePassword: !!sitePassword });

    if (password === sitePassword) {
      // 쿠키 설정 (7일 유효)
      const cookieStore = await cookies();
      cookieStore.set('auth_token', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });

      console.log('Authentication successful, redirecting to /study');
      redirect('/study');
    } else {
      console.log('Authentication failed: wrong password');
      return { error: '비밀번호가 올바르지 않습니다.' };
    }
  } catch (error) {
    console.error('Authentication error:', error);
    // redirect throws NEXT_REDIRECT error which is expected
    if (error && typeof error === 'object' && 'digest' in error) {
      throw error; // Re-throw redirect errors
    }
    return { error: '인증 중 오류가 발생했습니다.' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/');
}
