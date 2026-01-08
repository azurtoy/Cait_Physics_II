# 🔧 프로젝트 설정 가이드

## 🔐 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 사이트 접근 비밀번호 (필수)
SITE_PASSWORD=your_secure_password_here

# Giscus 댓글 설정 (선택사항)
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=YOUR_REPO_ID
NEXT_PUBLIC_GISCUS_CATEGORY=General
NEXT_PUBLIC_GISCUS_CATEGORY_ID=YOUR_CATEGORY_ID

# 연락처 이메일 (선택사항)
NEXT_PUBLIC_CONTACT_EMAIL=your-email@example.com
```

### 필수 설정

#### SITE_PASSWORD
- 학습 자료에 접근하기 위한 비밀번호입니다.
- 원하는 비밀번호로 변경하세요.
- 예: `SITE_PASSWORD=physics2026`

## 🚀 실행 방법

### 1. 패키지 설치
```bash
npm install
```

### 2. 환경 변수 설정
위의 가이드를 따라 `.env.local` 파일을 생성하세요.

### 3. 개발 서버 실행
```bash
npm run dev
```

### 4. 브라우저에서 접속
- 메인 포털: http://localhost:3000
- 과목 카드를 클릭하고 설정한 비밀번호를 입력하세요.

## 📁 프로젝트 구조

```
├── app/
│   ├── page.tsx                 # 메인 포털 (과목 선택 + 로그인)
│   ├── layout.tsx               # 전역 레이아웃
│   ├── actions/
│   │   └── auth.ts             # 인증 Server Action
│   └── study/                   # 인증 후 접근 가능한 학습 자료
│       ├── layout.tsx          # 학습 자료 레이아웃 (사이드바 포함)
│       ├── page.tsx            # 학습 자료 홈
│       ├── formulas/           # 공식 검색
│       └── chapter/[id]/       # 챕터별 상세 페이지
├── components/
│   ├── CourseCard.tsx          # 과목 카드 + 로그인 UI
│   ├── Sidebar.tsx             # 사이드바 네비게이션
│   └── ...                     # 기타 컴포넌트
├── middleware.ts               # 쿠키 기반 인증 미들웨어
└── config/
    └── giscus.ts               # Giscus 댓글 설정
```

## 🔒 인증 시스템

### 작동 방식
1. 사용자가 메인 포털에서 과목 카드를 클릭
2. 로그인 입력창이 토글 방식으로 열림
3. 비밀번호 입력 후 Server Action으로 검증
4. 정확하면 쿠키 설정 후 `/study`로 리다이렉트
5. 이후 `/study` 경로 접근 시 Middleware가 쿠키 확인

### 쿠키 정보
- 이름: `auth_token`
- 유효기간: 7일
- HttpOnly: true (보안)
- 경로: `/`

### Logout
학습 자료 페이지 우측 상단의 "🚪 Logout" 버튼을 클릭하면 쿠키가 삭제되고 메인 포털로 돌아갑니다.

## 💬 Giscus 댓글 설정 (선택사항)

자세한 내용은 `GISCUS_SETUP.md`를 참조하세요.

## 🎨 커스터마이징

### 과목 추가
`app/page.tsx` 파일의 `courses` 배열에 새로운 과목을 추가하세요:

```typescript
const courses = [
  {
    id: 'physics-ii',
    title: 'Physics II',
    subtitle: 'Winter 2026',
    description: 'Halliday 12th Edition...',
    icon: '⚛️',
  },
  {
    id: 'math-iii',  // 새 과목 추가
    title: 'Mathematics III',
    subtitle: 'Fall 2026',
    description: 'Calculus and Linear Algebra',
    icon: '📐',
  },
];
```

### 비밀번호 변경
`.env.local` 파일의 `SITE_PASSWORD` 값을 변경하고 서버를 재시작하세요.

## 🐛 문제 해결

### "비밀번호가 올바르지 않습니다" 오류
- `.env.local` 파일이 존재하는지 확인
- `SITE_PASSWORD`가 올바르게 설정되었는지 확인
- 개발 서버를 재시작

### 로그인 후에도 메인 페이지로 돌아감
- 브라우저 쿠키가 활성화되어 있는지 확인
- 시크릿 모드에서는 쿠키가 세션 종료 시 삭제될 수 있음

### Middleware 작동 안 함
- `middleware.ts` 파일이 프로젝트 루트에 있는지 확인
- Next.js 버전이 12.2 이상인지 확인

## 📝 추가 정보

- 기본 비밀번호 (개발용): `physics2026`
- 프로덕션 배포 시 반드시 비밀번호를 변경하세요.
- `.env.local` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함됨)

## 🎓 완료!

설정이 완료되었습니다! 이제 `npm run dev`를 실행하고 http://localhost:3000 에서 확인하세요.
