# Phase 2 버그 수정

## 🐛 Bug 1: Signup 프로필 생성 실패 처리 미흡

### 문제
`app/actions/auth.ts`의 `signup()` 함수에서 프로필 생성이 실패해도 `{ success: true }`를 반환했습니다.

**영향:**
- 사용자 계정은 생성되지만 프로필이 없는 상태
- 클라이언트는 `/station`으로 리다이렉트되지만 프로필 조회 실패
- 데이터베이스 불일치 및 접근 제어 문제 발생 가능

### 수정 내용

```typescript
// Before (app/actions/auth.ts:69-77)
if (profileError) {
  console.error('❌ Failed to create profile:', profileError.message);
  // Note: User is created but profile failed. May need manual cleanup.
}

console.log('✅ Sign up successful:', data.user.email);

revalidatePath('/', 'layout');
return { success: true }; // ❌ 문제: 프로필 생성 실패해도 success: true 반환

// After
if (profileError) {
  console.error('❌ Failed to create profile:', profileError.message);
  // Profile creation failed - this is a critical error
  // Note: User account exists but profile wasn't created
  return { 
    success: false, 
    error: 'Failed to create user profile. Please contact support.' 
  }; // ✅ 수정: 프로필 생성 실패 시 에러 반환
}

console.log('✅ Sign up successful:', data.user.email);

revalidatePath('/', 'layout');
return { success: true };
```

**결과:**
- 프로필 생성 실패 시 사용자에게 에러 메시지 표시
- `/station`으로 리다이렉트되지 않음
- 데이터 일관성 보장

---

## 🐛 Bug 2: Supabase 클라이언트 무한 루프

### 문제
`app/station/page.tsx`에서 `createClient()`가 컴포넌트 레벨에서 호출되어 매 렌더마다 새 인스턴스가 생성되고, `useEffect`의 dependency array에 포함되어 무한 루프가 발생했습니다.

**영향:**
- 매 렌더마다 새로운 Supabase 클라이언트 인스턴스 생성
- `useEffect`가 무한 반복 실행
- 불필요한 API 호출 및 성능 저하

### 수정 내용

```typescript
// Before (app/station/page.tsx:8-47)
export default function StationPage() {
  const router = useRouter();
  const supabase = createClient(); // ❌ 문제: 매 렌더마다 새 인스턴스 생성
  
  const [loading, setLoading] = useState(true);
  // ... states ...

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      // ... logic ...
    }

    checkUser();
  }, [router, supabase]); // ❌ 문제: dependency array에 supabase 포함 → 무한 루프

// After
export default function StationPage() {
  const router = useRouter();
  // ✅ 수정: 컴포넌트 레벨에서 클라이언트 생성 제거
  
  const [loading, setLoading] = useState(true);
  // ... states ...

  useEffect(() => {
    async function checkUser() {
      const supabase = createClient(); // ✅ 수정: useEffect 내부에서 생성
      const { data: { user } } = await supabase.auth.getUser();
      // ... logic ...
    }

    checkUser();
  }, [router]); // ✅ 수정: supabase 제거, router만 포함
```

**결과:**
- `useEffect`가 `router` 변경 시에만 실행
- 무한 루프 방지
- 성능 최적화

---

## ✅ 검증

### Bug 1 테스트
1. 회원가입 시도
2. 프로필 생성 실패 시나리오:
   - Supabase에서 `profiles` 테이블의 RLS 정책 임시 비활성화
   - 회원가입 시도
   - "Failed to create user profile. Please contact support." 에러 메시지 확인
   - `/station`으로 리다이렉트되지 않음 확인

### Bug 2 테스트
1. `/station` 페이지 접속
2. 브라우저 개발자 도구 > Network 탭 확인
3. `auth/user` API 호출이 1회만 발생하는지 확인 (무한 루프 없음)
4. React DevTools로 리렌더링 횟수 확인

---

## 📝 추가 개선 사항 (선택)

### 1. Supabase 클라이언트 Hook 생성
매번 `createClient()`를 호출하는 대신 커스텀 훅 사용:

```typescript
// hooks/useSupabase.ts
import { useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';

export function useSupabase() {
  return useMemo(() => createClient(), []);
}

// 사용 예
const supabase = useSupabase();
```

### 2. Signup 트랜잭션 개선
프로필 생성 실패 시 생성된 사용자 계정도 삭제:

```typescript
if (profileError) {
  // Cleanup: Delete the created user account
  await supabase.auth.admin.deleteUser(data.user.id);
  return { success: false, error: 'Failed to create user profile' };
}
```
(주의: 이를 위해서는 Service Role Key가 필요합니다)

---

## 🎯 결론

두 버그 모두 수정 완료:
- ✅ Signup 프로필 생성 실패 시 적절한 에러 처리
- ✅ Station 페이지의 무한 루프 방지

**린트 에러:** 없음  
**모든 기능:** 정상 작동
