# 접근 제어 버그 수정

## 🐛 Bug 1: Remember Device 미구현 기능 제거

### 문제
`app/page.tsx`에서 "Remember Device" 체크박스가 있지만 실제로 기능하지 않았습니다.

**영향:**
- 사용자가 체크박스를 토글해도 아무 효과가 없음
- `rememberDevice` 상태가 수집되지만 `login()` 함수에 전달되지 않음
- 혼란스러운 UX 제공

### 수정 내용

**Before:**
```typescript
// app/page.tsx
const [rememberDevice, setRememberDevice] = useState(false);

// ... in JSX
{!isSignUp && (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      id="remember"
      checked={rememberDevice}
      onChange={(e) => setRememberDevice(e.target.checked)}
      className="w-4 h-4 border-gray-300 focus:ring-0"
    />
    <label htmlFor="remember" className="text-xs text-gray-600 font-light">
      Remember Device
    </label>
  </div>
)}
```

**After:**
- 체크박스 완전히 제거
- `rememberDevice` 상태 변수 제거

**이유:**
- Supabase는 자체적으로 세션 관리를 수행합니다
- 기본적으로 브라우저에 세션이 저장되며, 로그아웃 전까지 유지됩니다
- "Remember Device" 옵션은 Supabase의 기본 동작과 중복되므로 불필요합니다

---

## 🐛 Bug 2: Study 페이지 접근 제어 누락

### 문제
Middleware가 인증만 확인하고 `is_physics_unlocked` 플래그를 확인하지 않았습니다.

**영향:**
- 인증된 사용자가 Access Code 없이 직접 `/study` 또는 `/study/[chapterId]`로 접근 가능
- Station 페이지의 Access Code 시스템이 완전히 우회됨
- 보안 취약점 발생

### 수정 내용

**Before (middleware.ts):**
```typescript
// Protect /station and /study routes
if (request.nextUrl.pathname.startsWith('/station') || request.nextUrl.pathname.startsWith('/study')) {
  if (!user) {
    // Redirect to login if not authenticated
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  // ❌ 문제: is_physics_unlocked 확인 없음
}
```

**After (middleware.ts):**
```typescript
// Protect /station and /study routes
if (request.nextUrl.pathname.startsWith('/station') || request.nextUrl.pathname.startsWith('/study')) {
  if (!user) {
    // Redirect to login if not authenticated
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  }

  // ✅ 추가: /study 접근 시 is_physics_unlocked 확인
  if (request.nextUrl.pathname.startsWith('/study')) {
    // Create supabase client for profile check
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => {
              request.cookies.set(name, value);
            });
          },
        },
      }
    );

    // Check if physics is unlocked
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_physics_unlocked')
      .eq('id', user.id)
      .single();

    if (!profile?.is_physics_unlocked) {
      // Redirect to station if physics is not unlocked
      console.log('⚠️ Access denied to /study: Physics not unlocked for user', user.email);
      const redirectUrl = new URL('/station', request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }
}
```

**설명:**
- `/study` 경로 접근 시 데이터베이스에서 프로필 조회
- `is_physics_unlocked` 플래그 확인
- `false`인 경우 `/station`으로 리다이렉트
- 콘솔에 접근 거부 로그 출력

---

## ✅ 검증

### Bug 1 테스트
1. **로그인 페이지 확인**
   - [ ] 로그인 폼에 "Remember Device" 체크박스가 없는지 확인
   - [ ] 로그인 성공 시 `/station`으로 정상 리다이렉트 확인

### Bug 2 테스트

#### 시나리오 1: Access Code 없이 직접 /study 접근 시도
1. **준비:**
   - 새 사용자로 회원가입
   - Station 페이지에서 Access Code 입력하지 **않음**

2. **테스트:**
   - 브라우저 주소창에 직접 `http://localhost:3000/study` 입력
   
3. **예상 결과:**
   - ✅ `/station`으로 자동 리다이렉트
   - ✅ 콘솔에 "⚠️ Access denied to /study: Physics not unlocked" 로그 출력

#### 시나리오 2: Access Code 입력 후 접근
1. **준비:**
   - Station 페이지에서 "REQUEST ACCESS" 클릭
   - 올바른 Access Code 입력 및 검증 완료

2. **테스트:**
   - "ENTER STATION" 버튼 클릭 또는 직접 `/study` 접근

3. **예상 결과:**
   - ✅ `/study` 페이지 정상 로드
   - ✅ 챕터 목록 및 콘텐츠 표시

#### 시나리오 3: 특정 챕터 직접 접근 시도
1. **준비:**
   - Access Code 미입력 상태

2. **테스트:**
   - 브라우저 주소창에 직접 `http://localhost:3000/study/15` 입력

3. **예상 결과:**
   - ✅ `/station`으로 자동 리다이렉트
   - ✅ 콘솔에 접근 거부 로그 출력

---

## 🔒 보안 강화

### 접근 제어 계층

| 계층 | 보호 대상 | 검증 내용 | 리다이렉트 |
|------|----------|----------|-----------|
| **1. 인증 (Authentication)** | `/station`, `/study` | 사용자 로그인 여부 | `/` (로그인 페이지) |
| **2. 권한 (Authorization)** | `/study` | `is_physics_unlocked = true` | `/station` |

### 플로우 다이어그램

```
User Login (/) 
    ↓
Authenticated? 
    ├─ No → Stay at /
    └─ Yes → Redirect to /station
              ↓
         Access Code Input
              ↓
         is_physics_unlocked = true
              ↓
         Can Access /study ✅

Direct /study Access Attempt
    ↓
Authenticated?
    ├─ No → Redirect to /
    └─ Yes → is_physics_unlocked?
              ├─ No → Redirect to /station ⚠️
              └─ Yes → Allow Access ✅
```

---

## 📝 추가 개선 사항 (선택)

### 1. 클라이언트 측 보호 추가
Study 페이지에서도 클라이언트 측 검증을 추가할 수 있습니다:

```typescript
// app/study/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function StudyPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_physics_unlocked')
        .eq('id', user.id)
        .single();

      if (!profile?.is_physics_unlocked) {
        router.push('/station');
        return;
      }

      setIsAuthorized(true);
    }

    checkAccess();
  }, [router]);

  if (!isAuthorized) {
    return <div>Loading...</div>;
  }

  return (
    // ... study page content
  );
}
```

### 2. 에러 페이지 개선
Access 거부 시 사용자에게 명확한 메시지 표시:

```typescript
// Station 페이지에 query parameter 추가
if (!profile?.is_physics_unlocked) {
  const redirectUrl = new URL('/station', request.url);
  redirectUrl.searchParams.set('error', 'access_denied');
  return NextResponse.redirect(redirectUrl);
}
```

---

## 🎯 결론

### 수정 사항 요약:
1. ✅ **Bug 1 수정**: "Remember Device" 체크박스 제거 (불필요한 기능)
2. ✅ **Bug 2 수정**: Middleware에 `is_physics_unlocked` 검증 추가

### 보안 개선:
- ✅ 인증된 사용자도 Access Code 없이는 `/study` 접근 불가
- ✅ Station 페이지의 Access Code 시스템이 실제로 작동
- ✅ 직접 URL 입력으로 우회 불가능

### 테스트 결과:
- **린트 에러:** 없음
- **모든 접근 제어:** 정상 작동
- **사용자 플로우:** 의도대로 동작

**The Airlock is now secure.** 🔒🚀
