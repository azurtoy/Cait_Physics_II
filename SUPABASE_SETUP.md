# Supabase Setup Guide for VOID

이 문서는 VOID 프로젝트의 Supabase 인증 및 데이터베이스를 설정하는 방법을 안내합니다.

---

## 📋 Prerequisites

1. [Supabase](https://supabase.com) 계정 생성
2. 새 프로젝트 생성 (프로젝트 이름: `void-physics` 또는 원하는 이름)

---

## 🔑 Step 1: Get Your Supabase Credentials

1. Supabase Dashboard에서 프로젝트를 선택합니다.
2. **Settings** > **API**로 이동합니다.
3. 다음 값들을 복사합니다:
   - **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
   - **anon public** key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

---

## 🗄️ Step 2: Run Database Schema

1. Supabase Dashboard에서 **SQL Editor**로 이동합니다.
2. 프로젝트 루트의 `supabase_schema.sql` 파일을 열고 전체 내용을 복사합니다.
3. SQL Editor에 붙여넣고 **Run**을 클릭합니다.

이 스크립트는 다음을 생성합니다:
- `profiles` 테이블 (사용자 프로필 및 과목 잠금 해제 상태)
- Row Level Security (RLS) 정책
- 자동 프로필 생성 트리거

---

## 📧 Step 3: Enable Email Authentication

1. Supabase Dashboard에서 **Authentication** > **Providers**로 이동합니다.
2. **Email** 제공자가 활성화되어 있는지 확인합니다.
3. (선택사항) **Email Templates**에서 이메일 템플릿을 커스터마이징할 수 있습니다.

---

## 🔐 Step 4: Configure Environment Variables

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가합니다:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Physics II Password (Class Access Code)
PHYSICS_PASSWORD=your_class_password_here
```

**중요:**
- `NEXT_PUBLIC_SUPABASE_URL`과 `NEXT_PUBLIC_SUPABASE_ANON_KEY`는 Step 1에서 복사한 값으로 교체하세요.
- `PHYSICS_PASSWORD`는 학생들이 Physics II 과목에 접근하기 위해 입력해야 하는 비밀번호입니다. 원하는 값으로 변경하세요.

---

## 🧪 Step 5: Test the Setup

1. 개발 서버를 시작합니다:
   ```bash
   npm run dev
   ```

2. `http://localhost:3000`으로 이동합니다.

3. **Sign Up** 플로우를 테스트합니다:
   - 점을 클릭하여 폼을 엽니다.
   - "Need an account? Sign Up"을 클릭합니다.
   - 이메일, 닉네임, 비밀번호를 입력합니다.
   - 계정이 생성되면 `/station`으로 리다이렉트됩니다.

4. **Access Code** 플로우를 테스트합니다:
   - Station 페이지에서 "REQUEST ACCESS"를 클릭합니다.
   - `.env.local`에 설정한 `PHYSICS_PASSWORD`를 입력합니다.
   - 성공하면 "ENTER STATION" 버튼이 나타납니다.

5. **Study Dashboard**에 접근합니다:
   - "ENTER STATION"을 클릭하여 `/study`로 이동합니다.

---

## 🔍 Troubleshooting

### 문제: "Failed to create profile" 에러

**해결책:**
- Supabase SQL Editor에서 `supabase_schema.sql`이 성공적으로 실행되었는지 확인합니다.
- **Table Editor**에서 `profiles` 테이블이 존재하는지 확인합니다.

### 문제: 로그인 후 리다이렉트가 작동하지 않음

**해결책:**
- `.env.local` 파일이 프로젝트 루트에 있는지 확인합니다.
- 개발 서버를 재시작합니다 (`Ctrl+C` 후 `npm run dev`).

### 문제: "Invalid access code" 에러

**해결책:**
- `.env.local`의 `PHYSICS_PASSWORD` 값을 확인합니다.
- 입력한 코드가 정확히 일치하는지 확인합니다 (대소문자 구분).

---

## 🎨 Optional: Email Validation (@lakeheadu.ca)

현재 코드는 모든 이메일을 허용합니다. `@lakeheadu.ca` 도메인만 허용하려면:

1. `app/page.tsx`의 이메일 입력 필드에 패턴 추가:
   ```tsx
   <input
     type="email"
     pattern=".*@lakeheadu\.ca$"
     title="Please use your @lakeheadu.ca email"
     ...
   />
   ```

2. 또는 `app/actions/auth.ts`의 `signup` 함수에 검증 로직 추가:
   ```typescript
   if (!email.endsWith('@lakeheadu.ca')) {
     return { success: false, error: 'Please use your @lakeheadu.ca email' };
   }
   ```

---

## 📚 Database Schema Overview

### `profiles` Table

| Column                | Type      | Description                          |
|-----------------------|-----------|--------------------------------------|
| `id`                  | uuid      | Primary key, references auth.users   |
| `nickname`            | text      | User's anonymous display name        |
| `is_physics_unlocked` | boolean   | Access to Physics II content         |
| `created_at`          | timestamp | Account creation time                |
| `updated_at`          | timestamp | Last profile update time             |

---

## 🚀 Next Steps

- 데이터베이스 스키마를 확장하여 다른 과목 추가 (예: `is_calculus_unlocked`)
- 사용자 진행 상황 추적 기능 추가
- 커뮤니티 기능 (댓글, 투표 등) 구현

---

**완료!** 이제 VOID 플랫폼이 Supabase 인증과 함께 작동합니다. 🎉
