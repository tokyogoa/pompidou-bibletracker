# 성경 읽기 트래커 - 배포 가이드

## 🚀 Firebase를 사용한 배포 방법

### 1단계: Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. 프로젝트 이름 입력 (예: bible-reading-tracker)
4. Google Analytics 설정 (선택사항)
5. 프로젝트 생성 완료

### 2단계: 웹 앱 추가 및 설정

1. Firebase Console에서 생성한 프로젝트 선택
2. "웹 앱" 아이콘 클릭 (</> 모양)
3. 앱 닉네임 입력
4. Firebase Hosting 설정 체크
5. Firebase 구성 정보 복사

### 3단계: Firebase 구성 정보 입력

`firebase-config.js` 파일을 열어 복사한 정보를 입력:

```javascript
const firebaseConfig = {
    apiKey: "복사한_API_KEY",
    authDomain: "프로젝트ID.firebaseapp.com",
    projectId: "프로젝트ID",
    storageBucket: "프로젝트ID.appspot.com",
    messagingSenderId: "복사한_SENDER_ID",
    appId: "복사한_APP_ID"
};
```

### 4단계: Firebase CLI 설치 및 로그인

터미널에서 다음 명령어 실행:

```bash
# Firebase CLI 설치 (한 번만)
npm install -g firebase-tools

# Firebase 로그인
firebase login

# 프로젝트 초기화
cd "/Users/azzaman/Desktop/VS code/성경읽기"
firebase init

# 초기화 옵션 선택:
# - Firestore (데이터베이스)
# - Hosting (웹 호스팅)
# 
# 기존 프로젝트 선택: 위에서 만든 프로젝트
# Firestore rules 파일: firestore.rules (기본값)
# Firestore indexes 파일: firestore.indexes.json (기본값)
# Public directory: . (현재 디렉토리)
# Single-page app: Yes
# GitHub 자동 배포: No (선택사항)
```

### 5단계: Firestore 활성화

1. Firebase Console에서 "Firestore Database" 메뉴 선택
2. "데이터베이스 만들기" 클릭
3. 테스트 모드로 시작 (나중에 규칙이 자동 적용됨)
4. 위치 선택: asia-northeast3 (서울) 권장

### 6단계: 배포

```bash
# 배포 실행
firebase deploy

# 배포 성공 후 URL 확인
# 예: https://bible-reading-tracker.web.app
```

### 7단계: 보안 규칙 적용

배포 후 Firestore 보안 규칙이 자동으로 적용되어:
- ✅ 모든 사용자가 데이터 읽기 가능 (공유 기능)
- ✅ 인증된 사용자만 데이터 쓰기 가능
- ✅ 실시간 동기화 지원

## 🌐 배포된 사이트 사용

배포 완료 후:
- 🔗 URL로 세계 어디서나 접속 가능
- 📱 모바일, 태블릿, 데스크톱 모두 지원
- ☁️ 클라우드에 데이터 자동 저장
- 🔄 실시간으로 그룹 멤버 간 진행상황 공유

## 📋 업데이트 방법

파일 수정 후 다시 배포:

```bash
firebase deploy
```

## 💡 문제 해결

### 배포 실패 시
```bash
firebase logout
firebase login
firebase deploy
```

### 데이터베이스 오류 시
- Firebase Console에서 Firestore가 활성화되어 있는지 확인
- 보안 규칙이 올바르게 적용되었는지 확인

### 로컬 테스트
```bash
firebase serve
```

## 🎉 완료!

이제 전 세계 어디서나 링크로 접속하여 성경 읽기를 함께 추적할 수 있습니다!
