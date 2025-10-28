// Firebase Configuration
// Firebase Console에서 프로젝트 생성 후 아래 정보를 입력하세요
// https://console.firebase.google.com/

const firebaseConfig = {
  apiKey: "AIzaSyCQbd4_Jg-CtoBwuRG0KMrkZdYPzhfFrrs",
  authDomain: "pompidou-bibletracker.firebaseapp.com",
  projectId: "pompidou-bibletracker",
  storageBucket: "pompidou-bibletracker.firebasestorage.app",
  messagingSenderId: "849870532979",
  appId: "1:849870532979:web:0767685bf9146b18779506",
  measurementId: "G-V6YZNEEP7B"
};

// Firebase 초기화
let db = null;
let auth = null;

function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK가 로드되지 않았습니다.');
        return false;
    }

    try {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        console.log('Firebase 초기화 성공');
        return true;
    } catch (error) {
        console.error('Firebase 초기화 실패:', error);
        return false;
    }
}

// 익명 로그인 (사용자 추적용)
async function signInAnonymously() {
    try {
        await auth.signInAnonymously();
        console.log('익명 로그인 성공');
        return true;
    } catch (error) {
        console.error('로그인 실패:', error);
        return false;
    }
}

// Firestore 데이터 구조:
// churches/{churchId} - 교회 정보
//   └─ groups/{groupId} - 그룹 정보
//       └─ members/{memberId} - 멤버 정보 및 읽기 기록
