# 성경 읽기 트래커 📖

퐁피두 센터 디자인의 대담한 성경 읽기 추적 웹앱

## ✨ 주요 기능

### 📊 기본 기능
- ⛪ **교회 → 그룹 → 멤버** 계층 구조
- 📚 **66권 성경책** 전체 지원 (구약 39권, 신약 27권)
- ✅ **장별 체크** 시스템
- 🏗️ **완독한 성경책 블록** 시각화
- ⚡ **Shift+클릭** 범위 선택
- 🔄 **초기화** 기능 (개별/전체)

### ☁️ 온라인 기능 (Firebase 연동 시)
- 🌐 **실시간 동기화** - 클라우드 자동 저장
- 👥 **그룹 공유** - 멤버 간 진행상황 실시간 확인
- 🔗 **어디서나 접속** - 링크로 세계 어디서나 이용
- 💾 **자동 백업** - 데이터 손실 걱정 없음

### 📴 오프라인 기능
- 💻 **로컬 저장** - 브라우저 스토리지 사용
- 📥 **데이터 내보내기/불러오기** - JSON 백업
- 🔒 **완전한 프라이버시** - 서버 전송 없음

## 🚀 배포 방법

### 옵션 1: Firebase Hosting (권장 - 클라우드 기능 포함)

#### 1. Firebase 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: bible-reading-tracker)
4. 프로젝트 생성 완료

#### 2. 웹 앱 추가
1. Firebase Console에서 프로젝트 선택
2. "웹 앱 추가" (</> 아이콘) 클릭
3. 앱 닉네임 입력
4. Firebase Hosting 체크
5. **Firebase 구성 정보 복사**

#### 3. Firebase 설정 입력
`firebase-config.js` 파일을 열어 복사한 정보 입력:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

#### 4. Firestore 데이터베이스 활성화
1. Firebase Console → "Firestore Database"
2. "데이터베이스 만들기" 클릭
3. **테스트 모드**로 시작
4. 위치: **asia-northeast3 (서울)** 선택

#### 5. Firebase CLI 설치 및 배포

```bash
# Firebase CLI 설치 (한 번만)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 디렉토리로 이동
cd "/Users/azzaman/Desktop/VS code/성경읽기"

# Firebase 초기화
firebase init

# 선택 사항:
# - Firestore
# - Hosting
# 
# 기존 프로젝트 선택: 위에서 만든 프로젝트
# Public directory: . (점 입력)
# Single-page app: Yes
# GitHub 배포: No

# 배포 실행
firebase deploy

# 완료! 배포된 URL 확인
# 예: https://bible-reading-tracker.web.app
```

#### 6. 보안 규칙 자동 적용
배포 시 `firestore.rules` 파일이 자동으로 적용되어:
- ✅ 모든 사용자가 데이터 읽기 가능 (공유)
- ✅ 인증된 사용자만 쓰기 가능
- ✅ 익명 인증 사용 (개인정보 수집 없음)

---

### 옵션 2: Netlify (간단 배포 - 오프라인만)

#### 방법 A: Netlify Drop
1. [Netlify Drop](https://app.netlify.com/drop) 접속
2. 프로젝트 폴더를 드래그 앤 드롭
3. 완료! URL 자동 생성

#### 방법 B: GitHub 연동
1. GitHub 저장소에 코드 업로드
2. [Netlify](https://netlify.com) 접속
3. "New site from Git" 클릭
4. GitHub 저장소 선택
5. 배포 설정:
   - Build command: (비워두기)
   - Publish directory: `.`
6. "Deploy site" 클릭

---

### 옵션 3: Vercel (간단 배포 - 오프라인만)

```bash
# Vercel CLI 설치
npm install -g vercel

# 프로젝트 디렉토리로 이동
cd "/Users/azzaman/Desktop/VS code/성경읽기"

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

또는 GitHub 연동:
1. [Vercel](https://vercel.com) 접속
2. "Import Project" 클릭
3. GitHub 저장소 선택
4. 자동 배포

---

## 📱 배포 후 사용

### Firebase 배포 시
- 🌐 URL로 세계 어디서나 접속
- ☁️ 자동 클라우드 저장
- 👥 그룹 멤버 간 실시간 공유
- 📱 모바일/태블릿/데스크톱 모두 지원

### Netlify/Vercel 배포 시
- 🌐 URL로 접속 가능
- 📴 브라우저 로컬 저장만
- 📥 백업 기능으로 데이터 관리
- 📱 반응형 디자인

---

## 🔧 로컬 개발

```bash
# 로컬 서버 실행 (Python 3)
python3 -m http.server 8000

# 또는 (Python 2)
python -m SimpleHTTPServer 8000

# 브라우저에서 열기
# http://localhost:8000
```

Firebase 로컬 테스트:
```bash
firebase serve
```

---

## 📂 파일 구조

```
성경읽기/
├── index.html              # 메인 HTML
├── styles.css              # 퐁피두 스타일
├── script.js               # 앱 로직
├── firebase-config.js      # Firebase 설정
├── firebase-manager.js     # Firebase 데이터 관리
├── firebase.json           # Firebase 호스팅 설정
├── firestore.rules         # 보안 규칙
├── firestore.indexes.json  # 데이터베이스 인덱스
├── DEPLOYMENT.md           # 상세 배포 가이드
└── README.md               # 이 파일
```

---

## 🎨 디자인 특징

- 🎨 **퐁피두 센터** 스타일
- 🌈 대담한 색상 (#FF0055, #00D4FF, #FFFF00)
- 🔲 하드 쉐도우 효과
- 🔄 역동적인 회전 애니메이션
- 📱 완벽한 반응형 디자인

---

## 🔒 프라이버시

### Firebase 온라인 모드
- 익명 인증 사용 (개인정보 수집 없음)
- 공개 데이터 (그룹 공유 목적)
- HTTPS 암호화 통신

### 오프라인 모드
- 로컬 스토리지만 사용
- 서버 전송 없음
- 완전한 프라이버시

---

## 📞 지원

도쿄드림교회: [https://sites.google.com/tokyodream.org/cross](https://sites.google.com/tokyodream.org/cross)

---

## 📄 라이선스

이 프로젝트는 교회 및 개인의 성경 읽기를 돕기 위한 목적으로 제작되었습니다.

---

## 🎉 완료!

성경 읽기를 통해 하나님 말씀과 더욱 가까워지시길 바랍니다! 📖✨
