# 🏥 CHA AI헬스케어융합학과 — 대학원 웹사이트

차의과학대학교 AI헬스케어융합학과 대학원(석·박사) 웹사이트.  
HeyGen AI 아바타 상담 기능 포함 · Netlify Functions로 API 키 보안 관리.

---

## 📁 프로젝트 구조

```
cha-ai-graduate/
├── public/
│   └── index.html          ← 웹사이트 본체
├── netlify/
│   └── functions/
│       ├── heygen-token.js  ← API 키로 세션 토큰 발급 (서버 전용)
│       └── heygen-proxy.js  ← HeyGen API 프록시 (화이트리스트)
├── netlify.toml             ← Netlify 빌드/배포 설정
├── package.json
├── .env.example             ← 환경변수 템플릿
├── .gitignore
└── README.md
```

### 🔒 보안 구조

```
[ 사용자 브라우저 ]
       │
       ├─ POST /api/heygen-token  ──→  [ Netlify Function ]  ──→  HeyGen API
       │   (API 키 없이 요청)           (서버에서 API 키 추가)     (토큰 반환)
       │
       └─ POST /api/heygen-proxy  ──→  [ Netlify Function ]  ──→  HeyGen API
           (토큰 + 요청 내용)           (화이트리스트 검증)       (스트리밍)
```

- ✅ HeyGen API 키는 **Netlify 환경변수**에만 존재
- ✅ 프론트엔드 코드에 API 키 **없음**
- ✅ 허용된 엔드포인트만 프록시 (화이트리스트)

---

## 🚀 배포 가이드 (Netlify + GitHub)

### Step 1: GitHub 저장소 생성 & 파일 업로드

1. [github.com/new](https://github.com/new) 에서 새 저장소 생성
   - Repository name: `cha-ai-graduate`
   - Public 또는 Private 선택
   - **"Add a README file"** 체크 해제

2. 이 프로젝트의 **모든 파일**을 해당 저장소에 업로드
   - GitHub 웹에서: "Add file" → "Upload files"
   - 또는 터미널에서:
   ```bash
   git init
   git add .
   git commit -m "Initial: AI헬스케어융합학과 대학원 사이트"
   git branch -M main
   git remote add origin https://github.com/sdkparkforbi/cha-ai-graduate.git
   git push -u origin main
   ```

### Step 2: Netlify 연결

1. [app.netlify.com](https://app.netlify.com) 접속 → GitHub 계정으로 로그인
2. **"Add new site"** → **"Import an existing project"**
3. **GitHub** 선택 → `cha-ai-graduate` 저장소 선택
4. 빌드 설정 확인 (자동 감지됨):
   - **Build command**: (비워두기)
   - **Publish directory**: `public`
5. **"Deploy site"** 클릭

### Step 3: 환경변수 설정 ⚠️ 중요!

이 단계를 반드시 수행해야 AI 아바타가 작동합니다.

1. Netlify 대시보드 → 해당 사이트 선택
2. **Site configuration** → **Environment variables**
3. **"Add a variable"** 클릭
4. 입력:
   - **Key**: `HEYGEN_API_KEY`
   - **Values**: `fed6ad41-1491-11f1-a99e-066a7fa2e369`
     (실제 HeyGen API 키로 교체)
5. **저장** → **Deploys** 탭에서 **"Trigger deploy"** → **"Deploy site"**

### Step 4: 사이트 이름 변경 (선택)

1. **Site configuration** → **Site name** → **"Change site name"**
2. 예: `cha-ai-graduate` → `https://cha-ai-graduate.netlify.app`

### Step 5: 커스텀 도메인 연결 (선택)

1. **Domain management** → **"Add custom domain"**
2. 도메인 입력 후 DNS 설정 안내를 따라 진행

---

## 🛠 로컬 개발 (선택사항)

로컬에서 테스트하려면:

```bash
# 1) Netlify CLI 설치
npm install

# 2) 환경변수 파일 생성
cp .env.example .env
# .env 파일을 열어 실제 API 키 입력

# 3) 로컬 서버 실행
npx netlify dev
# → http://localhost:8888 에서 확인
```

---

## 📝 수정 후 반영

GitHub에 push하면 Netlify가 **자동으로 재배포**합니다:

```bash
git add .
git commit -m "연구실 정보 업데이트"
git push
```

약 30초~1분 후 사이트에 반영됩니다.

---

## ⚙️ 기술 스택

| 항목 | 기술 |
|------|------|
| 프론트엔드 | HTML5, CSS3, Vanilla JS |
| AI 아바타 | HeyGen Streaming API v2 |
| 실시간 통신 | LiveKit WebRTC |
| 호스팅 | Netlify (CDN + Functions) |
| 서버리스 | Netlify Functions (ES Modules) |
| 보안 | 환경변수 + API 프록시 + CSP 헤더 |

---

© 2026 CHA University · AI헬스케어융합학과
