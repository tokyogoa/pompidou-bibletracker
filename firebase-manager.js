// Firebase Database Manager
// Firestore와 데이터 동기화를 관리하는 클래스

const CHURCHES_COLLECTION = 'churches';
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

    // 데이터 로드 (초기)
    async loadData() {
        if (!this.isOnline) return null;
        try {
            const snapshot = await db.collection(CHURCHES_COLLECTION).get();
            const churches = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            return { churches };
        } catch (error) {
            console.error("Firebase에서 데이터 로드 실패:", error);
            return null;
        }
    }

    // 데이터 실시간 감지
    listenForChanges(callback) {
        if (!this.isOnline) return null;

        return db.collection(CHURCHES_COLLECTION).onSnapshot(snapshot => {
            const churches = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback({ churches });
        }, error => {
            console.error("Firebase 실시간 감지 실패:", error);
        });
    }

    // 교회 추가
    async addChurch(church) {
        if (!this.isOnline) return;
        try {
            await db.collection(CHURCHES_COLLECTION).doc(church.id).set({
                ...church,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: this.currentUser
            });
        } catch (error) {
            console.error("교회 추가 실패:", error);
        }
    }

    // 교회 삭제
    async deleteChurch(churchId) {
        if (!this.isOnline) return;
        try {
            await db.collection(CHURCHES_COLLECTION).doc(churchId).delete();
        } catch (error) {
            console.error("교회 삭제 실패:", error);
        }
    }

    // 그룹 추가
    async addGroup(churchId, group) {
        if (!this.isOnline) return;
        try {
            const churchRef = db.collection(CHURCHES_COLLECTION).doc(churchId);
            await db.runTransaction(async (transaction) => {
                const churchDoc = await transaction.get(churchRef);
                if (!churchDoc.exists) {
                    throw "Church does not exist!";
                }
                const groups = churchDoc.data().groups || [];
                groups.push(group);
                transaction.update(churchRef, { groups });
            });
        } catch (error) {
            console.error("그룹 추가 실패:", error);
        }
    }

    // 그룹 삭제
    async deleteGroup(churchId, groupId) {
        if (!this.isOnline) return;
        try {
            const churchRef = db.collection(CHURCHES_COLLECTION).doc(churchId);
            await db.runTransaction(async (transaction) => {
                const churchDoc = await transaction.get(churchRef);
                if (!churchDoc.exists) return;
                const groups = (churchDoc.data().groups || []).filter(g => g.id !== groupId);
                transaction.update(churchRef, { groups });
            });
        } catch (error) {
            console.error("그룹 삭제 실패:", error);
        }
    }

    // 멤버 추가
    async addMember(churchId, groupId, member) {
        if (!this.isOnline) return;
        try {
            const churchRef = db.collection(CHURCHES_COLLECTION).doc(churchId);
            await db.runTransaction(async (transaction) => {
                const churchDoc = await transaction.get(churchRef);
                if (!churchDoc.exists) return;
                const groups = churchDoc.data().groups || [];
                const group = groups.find(g => g.id === groupId);
                if (!group) return;
                if (!group.members) group.members = [];
                group.members.push(member);
                transaction.update(churchRef, { groups });
            });
        } catch (error) {
            console.error("멤버 추가 실패:", error);
        }
    }

    // 멤버 삭제
    async deleteMember(churchId, groupId, memberId) {
        if (!this.isOnline) return;
        try {
            const churchRef = db.collection(CHURCHES_COLLECTION).doc(churchId);
            await db.runTransaction(async (transaction) => {
                const churchDoc = await transaction.get(churchRef);
                if (!churchDoc.exists) return;
                const groups = churchDoc.data().groups || [];
                const group = groups.find(g => g.id === groupId);
                if (group && group.members) {
                    group.members = group.members.filter(m => m.id !== memberId);
                }
                transaction.update(churchRef, { groups });
            });
        } catch (error) {
            console.error("멤버 삭제 실패:", error);
        }
    }

    // 읽기 기록 업데이트
    async updateReading(churchId, groupId, memberId, reading) {
        if (!this.isOnline) return;
        try {
            const churchRef = db.collection(CHURCHES_COLLECTION).doc(churchId);
            await db.runTransaction(async (transaction) => {
                const churchDoc = await transaction.get(churchRef);
                if (!churchDoc.exists) return;
                const groups = churchDoc.data().groups || [];
                const group = groups.find(g => g.id === groupId);
                if (!group || !group.members) return;
                const member = group.members.find(m => m.id === memberId);
                if (member) {
                    member.reading = reading;
                }
                transaction.update(churchRef, {
                    groups,
                    lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
                });
            });
        } catch (error) {
            console.error("읽기 기록 업데이트 실패:", error);
        }
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
