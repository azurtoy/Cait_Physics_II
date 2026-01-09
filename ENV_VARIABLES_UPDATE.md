# 환경 변수 업데이트 - Phase 2 수정

## ✅ 변경 사항

기존에 사용하던 `PHYSICS_PASSWORD` 환경 변수를 그대로 사용하도록 모든 코드를 통일했습니다.

---

## 📋 올바른 환경 변수 구성

### `.env.local` 파일 구성

```env
# Supabase Configuration (필수)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Physics II Password (Class Access Code) (필수)
PHYSICS_PASSWORD=your_class_password_here
```

---

## 🔧 수정된 파일들

### 1. **`app/actions/station.ts`**

**Before:**
```typescript
const correctCode = process.env.PHYSICS_ACCESS_CODE || 'PHYSICS2025';
```

**After:**
```typescript
const correctCode = process.env.PHYSICS_PASSWORD || '1234';
```

**설명:**
- Access Code 검증 시 기존 `PHYSICS_PASSWORD` 환경 변수 사용
- 기본값도 `'1234'`로 변경 (기존 시스템과 일관성 유지)

---

### 2. **`utils/supabase/client.ts`** ✅ 이미 올바름

```typescript
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

**설명:** 이미 올바른 환경 변수 이름을 사용하고 있습니다.

---

### 3. **문서 파일 업데이트**

다음 문서들에서 `PHYSICS_ACCESS_CODE` → `PHYSICS_PASSWORD`로 변경:
- ✅ `SUPABASE_SETUP.md`
- ✅ `PHASE2_COMPLETE.md`
- ✅ `supabase_schema.sql` (주석 부분)

---

## 🎯 Station 페이지 로직 확인

### **Flow:**

1. **사용자 로그인** (`app/page.tsx`)
   - Email + Password 입력
   - Supabase Auth로 인증

2. **Station 페이지 접속** (`app/station/page.tsx`)
   - 사용자 프로필 조회
   - `is_physics_unlocked` 확인

3. **Access Code 입력** (잠금 해제 필요 시)
   - "REQUEST ACCESS" 버튼 클릭
   - 사용자가 코드 입력
   - **서버에서 `process.env.PHYSICS_PASSWORD`와 비교**

4. **검증 성공** (`app/actions/station.ts`)
   - `is_physics_unlocked = true` 업데이트
   - "ENTER STATION" 버튼 표시

5. **Study 접속** (`app/study/page.tsx`)
   - Physics II 콘텐츠 접근

---

## 🔐 보안 고려사항

### **환경 변수 사용 위치:**

| 변수명 | 사용 위치 | 설명 |
|--------|----------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | 클라이언트 | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 클라이언트 | Supabase Public Key |
| `PHYSICS_PASSWORD` | **서버 전용** | 과목 접근 코드 (비밀) |

**중요:**
- `PHYSICS_PASSWORD`는 **절대로** `NEXT_PUBLIC_` 접두사를 붙이지 마세요!
- 이 변수는 서버 사이드 (`app/actions/station.ts`)에서만 사용됩니다.
- 클라이언트에 노출되지 않습니다.

---

## 🧪 테스트 체크리스트

1. **회원가입 테스트**
   - [ ] 이메일, 비밀번호, 닉네임 입력
   - [ ] 프로필 생성 확인
   - [ ] `/station`으로 리다이렉트 확인

2. **Access Code 테스트**
   - [ ] Station 페이지에서 "REQUEST ACCESS" 버튼 표시 확인
   - [ ] `.env.local`의 `PHYSICS_PASSWORD` 값 입력
   - [ ] 검증 성공 시 "ENTER STATION" 버튼으로 변경 확인

3. **Study 접근 테스트**
   - [ ] "ENTER STATION" 클릭
   - [ ] `/study` 페이지 정상 로드 확인
   - [ ] 챕터 목록 및 콘텐츠 표시 확인

4. **환경 변수 확인**
   - [ ] `.env.local` 파일에 3개 환경 변수 설정 확인
   - [ ] Supabase 연결 확인 (개발자 도구 Network 탭)
   - [ ] Access Code 검증 로그 확인 (서버 콘솔)

---

## 📝 요약

### **변경 전 (잘못된 변수 이름):**
```env
PHYSICS_ACCESS_CODE=PHYSICS2025  # ❌ 새로운 변수 이름
```

### **변경 후 (기존 변수 재사용):**
```env
PHYSICS_PASSWORD=your_password_here  # ✅ 기존 변수 이름 사용
```

**결과:**
- 기존 시스템과 일관성 유지
- 환경 변수 중복 방지
- 설정 파일 단순화

---

## 🎉 완료!

모든 코드와 문서가 `PHYSICS_PASSWORD` 환경 변수를 사용하도록 업데이트되었습니다.

**린트 에러:** 없음  
**모든 테스트:** 통과 준비 완료
