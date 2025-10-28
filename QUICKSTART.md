# ⚡ 빠른 시작 가이드

## 🎯 2가지 배포 옵션

### 옵션 1: 🌐 온라인 모드 (Firebase - 실시간 공유 기능 포함)

**장점:**
- ☁️ 클라우드 자동 저장
- 👥 그룹 멤버 간 실시간 공유
- 🔄 자동 동기화
- 🌍 세계 어디서나 접속

**5분 설정:**

```bash
# 1. Firebase CLI 설치
npm install -g firebase-tools

# 2. Firebase 로그인
firebase login

# 3. 프로젝트 이동
cd "/Users/azzaman/Desktop/VS code/성경읽기"

# 4. Firebase 초기화
firebase init
# → Firestore 선택
# → Hosting 선택
# → 기존 프로젝트 선택 또는 새로 생성
# → Public directory: . (점 입력)
# → Single-page app: Yes

# 5. firebase-config.js 편집
# Firebase Console에서 웹 앱 추가 후 설정 복사

# 6. 배포!
firebase deploy
```

**또는 자동 스크립트:**
```bash
./deploy.sh
```

---

### 옵션 2: 📴 오프라인 모드 (Netlify - 간단 배포)

**장점:**
- 🚀 가장 빠른 배포
- 🔒 완전한 프라이버시
- 💾 로컬 저장

**30초 배포:**

1. [Netlify Drop](https://app.netlify.com/drop) 접속
2. 이 폴더를 드래그 앤 드롭
3. 완료! 🎉

**또는 CLI:**
```bash
npm install -g netlify-cli
netlify deploy
```

---

## 🔧 Firebase 상세 설정

### 1단계: Firebase Console 설정

1. 🌐 [Firebase Console](https://console.firebase.google.com/) 접속
2. ➕ "프로젝트 추가" 클릭
3. 📝 이름 입력: `bible-reading-tracker` (또는 원하는 이름)
4. ⚙️ Google Analytics: 선택 사항 (권장: 끄기)
5. ✅ 프로젝트 생성 완료

### 2단계: 웹 앱 추가

1. 프로젝트 개요 화면에서 **</> 웹 앱** 아이콘 클릭
2. 앱 닉네임 입력: `Bible Tracker`
3. ✅ "Firebase Hosting 설정" 체크
4. "앱 등록" 클릭
5. **설정 코드 복사** (다음과 같은 형태):

```javascript
const firebaseConfig = {
  apiKey: "AIza....",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc..."
};
```

### 3단계: Firestore 데이터베이스 활성화

1. 좌측 메뉴에서 **"Firestore Database"** 클릭
2. "데이터베이스 만들기" 클릭
3. 🔓 **테스트 모드로 시작** 선택
4. 🌏 위치: **asia-northeast3 (서울)** 권장
5. "사용 설정" 클릭

### 4단계: 설정 파일 업데이트

`firebase-config.js` 파일을 열어 2단계에서 복사한 내용으로 교체:

```javascript
// 이 부분을 수정하세요
const firebaseConfig = {
    apiKey: "복사한_API_KEY",
    authDomain: "프로젝트ID.firebaseapp.com",
    projectId: "프로젝트ID",
    storageBucket: "프로젝트ID.appspot.com",
    messagingSenderId: "복사한_SENDER_ID",
    appId: "복사한_APP_ID"
};
```

### 5단계: 배포

터미널에서 실행:
```bash
cd "/Users/azzaman/Desktop/VS code/성경읽기"
firebase deploy
```

완료 후 URL 확인:
```
✔  Deploy complete!

Hosting URL: https://your-project.web.app
```

---

## ✅ 배포 확인

배포가 완료되면:

1. 🌐 제공된 URL 접속
2. ➕ 교회 추가 테스트
3. 👥 그룹 추가
4. 📖 멤버 추가 및 성경 읽기 체크

**온라인 모드 확인:**
- 앱 상단에 "☁️ 온라인 모드: 실시간 공유 활성화" 메시지 표시
- Firebase Console의 Firestore에서 데이터 확인 가능

---

## 🆘 문제 해결

### Firebase 배포 실패
```bash
firebase logout
firebase login
firebase deploy
```

### Firestore 권한 오류
Firebase Console → Firestore Database → 규칙 탭에서 다음 확인:
```
allow read: if true;
```

### 로컬 테스트
```bash
# Python 서버
python3 -m http.server 8000

# 또는 Firebase
firebase serve
```

브라우저에서: `http://localhost:8000`

---

## 🎉 완료!

이제 전 세계 어디서나 성경 읽기를 함께 추적할 수 있습니다!

📱 URL을 그룹 멤버들과 공유하세요!
