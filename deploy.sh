#!/bin/bash

# 성경 읽기 트래커 - Firebase 배포 스크립트

echo "🚀 성경 읽기 트래커 배포 시작..."
echo ""

# Firebase CLI 설치 확인
if ! command -v firebase &> /dev/null
then
    echo "❌ Firebase CLI가 설치되어 있지 않습니다."
    echo "다음 명령어로 설치하세요:"
    echo "npm install -g firebase-tools"
    exit 1
fi

echo "✅ Firebase CLI 확인 완료"
echo ""

# Firebase 로그인 확인
echo "📝 Firebase 로그인 확인 중..."
firebase login:list

echo ""
echo "🔧 firebase-config.js 파일을 확인하세요."
echo "Firebase Console에서 복사한 설정 정보가 입력되어 있어야 합니다."
echo ""
read -p "설정이 완료되었습니까? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "❌ 배포를 취소합니다."
    echo "firebase-config.js 파일을 먼저 설정해주세요."
    exit 1
fi

echo ""
echo "📦 배포 준비 중..."

# Firebase 초기화가 안 되어 있으면 안내
if [ ! -f "firebase.json" ]; then
    echo "⚠️  firebase.json 파일이 없습니다."
    echo "다음 명령어를 실행하여 Firebase를 초기화하세요:"
    echo "firebase init"
    exit 1
fi

echo "✅ Firebase 설정 파일 확인 완료"
echo ""

# 배포 실행
echo "🚀 Firebase에 배포 중..."
firebase deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 배포 완료!"
    echo ""
    echo "🌐 배포된 URL을 확인하세요."
    echo "Firebase Console: https://console.firebase.google.com/"
    echo ""
    echo "🎉 이제 전 세계 어디서나 링크로 접속할 수 있습니다!"
else
    echo ""
    echo "❌ 배포 실패"
    echo "오류를 확인하고 다시 시도하세요."
    exit 1
fi
