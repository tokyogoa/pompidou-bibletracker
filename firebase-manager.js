// Firebase Database Manager
// Firestore와 데이터 동기화를 관리하는 클래스

class FirebaseManager {
    constructor() {
        this.isOnline = false;
        this.currentUser = null;
    }

    // Firebase 연결 확인
    async connect() {
        if (!db || !auth) {
            console.log('오프라인 모드로 작동합니다.');
            return false;
        }

        try {
            await signInAnonymously();
            this.isOnline = true;
            this.currentUser = auth.currentUser.uid;
            return true;
        } catch (error) {
            console.error('연결 실패:', error);
            this.isOnline = false;
            return false;
        }
    }

    // 교회 데이터 저장
    async saveChurch(churchData) {
        if (!this.isOnline) return this.saveLocal('churches', churchData);

        try {
            const docRef = await db.collection('churches').add({
                ...churchData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: this.currentUser
            });
            return docRef.id;
        } catch (error) {
            console.error('교회 저장 실패:', error);
            return this.saveLocal('churches', churchData);
        }
    }

    // 그룹 데이터 저장
    async saveGroup(churchId, groupData) {
        if (!this.isOnline) return this.saveLocal('groups', groupData);

        try {
            const docRef = await db.collection('churches')
                .doc(churchId)
                .collection('groups')
                .add({
                    ...groupData,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            return docRef.id;
        } catch (error) {
            console.error('그룹 저장 실패:', error);
            return this.saveLocal('groups', groupData);
        }
    }

    // 멤버 데이터 저장
    async saveMember(churchId, groupId, memberData) {
        if (!this.isOnline) return this.saveLocal('members', memberData);

        try {
            const docRef = await db.collection('churches')
                .doc(churchId)
                .collection('groups')
                .doc(groupId)
                .collection('members')
                .add({
                    ...memberData,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            return docRef.id;
        } catch (error) {
            console.error('멤버 저장 실패:', error);
            return this.saveLocal('members', memberData);
        }
    }

    // 읽기 기록 업데이트
    async updateReading(churchId, groupId, memberId, readingData) {
        if (!this.isOnline) {
            return this.saveLocal('reading', { memberId, readingData });
        }

        try {
            await db.collection('churches')
                .doc(churchId)
                .collection('groups')
                .doc(groupId)
                .collection('members')
                .doc(memberId)
                .update({
                    reading: readingData,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            return true;
        } catch (error) {
            console.error('읽기 기록 업데이트 실패:', error);
            return this.saveLocal('reading', { memberId, readingData });
        }
    }

    // 모든 교회 불러오기
    async loadChurches() {
        if (!this.isOnline) return this.loadLocal('churches');

        try {
            const snapshot = await db.collection('churches').get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('교회 목록 불러오기 실패:', error);
            return this.loadLocal('churches');
        }
    }

    // 그룹 불러오기
    async loadGroups(churchId) {
        if (!this.isOnline) return this.loadLocal('groups', churchId);

        try {
            const snapshot = await db.collection('churches')
                .doc(churchId)
                .collection('groups')
                .get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('그룹 목록 불러오기 실패:', error);
            return this.loadLocal('groups', churchId);
        }
    }

    // 멤버 불러오기
    async loadMembers(churchId, groupId) {
        if (!this.isOnline) return this.loadLocal('members', groupId);

        try {
            const snapshot = await db.collection('churches')
                .doc(churchId)
                .collection('groups')
                .doc(groupId)
                .collection('members')
                .get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('멤버 목록 불러오기 실패:', error);
            return this.loadLocal('members', groupId);
        }
    }

    // 실시간 리스너 설정 (그룹 내 멤버들의 진행상황 공유)
    listenToGroupMembers(churchId, groupId, callback) {
        if (!this.isOnline) return null;

        return db.collection('churches')
            .doc(churchId)
            .collection('groups')
            .doc(groupId)
            .collection('members')
            .onSnapshot(snapshot => {
                const members = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                callback(members);
            });
    }

    // 로컬 스토리지 폴백 (오프라인 모드)
    saveLocal(type, data) {
        const key = `offline_${type}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(data);
        localStorage.setItem(key, JSON.stringify(existing));
        return `local_${Date.now()}`;
    }

    loadLocal(type, filterId = null) {
        const key = `offline_${type}`;
        const data = JSON.parse(localStorage.getItem(key) || '[]');
        
        if (filterId) {
            return data.filter(item => item.parentId === filterId);
        }
        return data;
    }

    // 온라인 상태 확인
    isConnected() {
        return this.isOnline;
    }
}

// 전역 인스턴스
let firebaseManager = null;

function initFirebaseManager() {
    firebaseManager = new FirebaseManager();
    return firebaseManager;
}
