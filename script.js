// ==================== DATA STRUCTURE ====================

const BIBLE_DATA = {
    oldTestament: {
        '창세기': { chapters: 50, abbr: '창' }, '출애굽기': { chapters: 40, abbr: '출' },
        '레위기': { chapters: 27, abbr: '레' }, '민수기': { chapters: 36, abbr: '민' },
        '신명기': { chapters: 34, abbr: '신' }, '여호수아': { chapters: 24, abbr: '수' },
        '사사기': { chapters: 21, abbr: '삿' }, '룻기': { chapters: 4, abbr: '룻' },
        '사무엘상': { chapters: 31, abbr: '삼상' }, '사무엘하': { chapters: 24, abbr: '삼하' },
        '열왕기상': { chapters: 22, abbr: '왕상' }, '열왕기하': { chapters: 25, abbr: '왕하' },
        '역대상': { chapters: 29, abbr: '대상' }, '역대하': { chapters: 36, abbr: '대하' },
        '에스라': { chapters: 10, abbr: '스' }, '느헤미야': { chapters: 13, abbr: '느' },
        '에스더': { chapters: 10, abbr: '에' }, '욥기': { chapters: 42, abbr: '욥' },
        '시편': { chapters: 150, abbr: '시' }, '잠언': { chapters: 31, abbr: '잠' },
        '전도서': { chapters: 12, abbr: '전' }, '아가': { chapters: 8, abbr: '아' },
        '이사야': { chapters: 66, abbr: '사' }, '예레미야': { chapters: 52, abbr: '렘' },
        '예레미야애가': { chapters: 5, abbr: '애' }, '에스겔': { chapters: 48, abbr: '겔' },
        '다니엘': { chapters: 12, abbr: '단' }, '호세아': { chapters: 14, abbr: '호' },
        '요엘': { chapters: 3, abbr: '욜' }, '아모스': { chapters: 9, abbr: '암' },
        '오바댜': { chapters: 1, abbr: '옵' }, '요나': { chapters: 4, abbr: '욘' },
        '미가': { chapters: 7, abbr: '미' }, '나훔': { chapters: 3, abbr: '나' },
        '하박국': { chapters: 3, abbr: '합' }, '스바냐': { chapters: 3, abbr: '습' },
        '학개': { chapters: 2, abbr: '학' }, '스가랴': { chapters: 14, abbr: '슥' },
        '말라기': { chapters: 4, abbr: '말' }
    },
    newTestament: {
        '마태복음': { chapters: 28, abbr: '마' }, '마가복음': { chapters: 16, abbr: '막' },
        '누가복음': { chapters: 24, abbr: '눅' }, '요한복음': { chapters: 21, abbr: '요' },
        '사도행전': { chapters: 28, abbr: '행' }, '로마서': { chapters: 16, abbr: '롬' },
        '고린도전서': { chapters: 16, abbr: '고전' }, '고린도후서': { chapters: 13, abbr: '고후' },
        '갈라디아서': { chapters: 6, abbr: '갈' }, '에베소서': { chapters: 6, abbr: '엡' },
        '빌립보서': { chapters: 4, abbr: '빌' }, '골로새서': { chapters: 4, abbr: '골' },
        '데살로니가전서': { chapters: 5, abbr: '살전' }, '데살로니가후서': { chapters: 3, abbr: '살후' },
        '디모데전서': { chapters: 6, abbr: '딤전' }, '디모데후서': { chapters: 4, abbr: '딤후' },
        '디도서': { chapters: 3, abbr: '딛' }, '빌레몬서': { chapters: 1, abbr: '몬' },
        '히브리서': { chapters: 13, abbr: '히' }, '야고보서': { chapters: 5, abbr: '약' },
        '베드로전서': { chapters: 5, abbr: '벧전' }, '베드로후서': { chapters: 3, abbr: '벧후' },
        '요한1서': { chapters: 5, abbr: '요일' }, '요한2서': { chapters: 1, abbr: '요이' },
        '요한3서': { chapters: 1, abbr: '요삼' }, '유다서': { chapters: 1, abbr: '유' },
        '요한계시록': { chapters: 22, abbr: '계' }
    }
};

// ==================== APP CLASS ====================

class BibleReadingApp {
    constructor() {
        this.data = this.loadData();
        this.currentView = 'churches';
        this.currentChurch = null;
        this.currentGroup = null;
        this.currentMember = null;
        this.lastSelectedChapter = null;
        this.firebaseEnabled = false;
        this.init();
    }

    // Initialize app
    async init() {
        this.setupEventListeners();
        
        // Firebase 초기화 시도
        if (initFirebase()) {
            this.firebaseManager = initFirebaseManager();
            this.firebaseEnabled = await this.firebaseManager.connect();
            
            if (this.firebaseEnabled) {
                this.showSnackbar('☁️ 온라인 모드: 실시간 공유 활성화');
            } else {
                this.showSnackbar('📴 오프라인 모드: 로컬 저장만 가능');
            }
        }
        
        this.renderChurches();
    }

    // ==================== DATA MANAGEMENT ====================

    loadData() {
        const saved = localStorage.getItem('bibleReadingData');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            churches: [],
            nextChurchId: 1,
            nextGroupId: 1,
            nextMemberId: 1
        };
    }

    saveData() {
        localStorage.setItem('bibleReadingData', JSON.stringify(this.data));
    }

    // ==================== EVENT LISTENERS ====================

    setupEventListeners() {
        document.getElementById('backBtn').addEventListener('click', () => this.handleBack());
        document.getElementById('fab').addEventListener('click', () => this.handleFabClick());
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('modalOverlay').addEventListener('click', (e) => {
            if (e.target.id === 'modalOverlay') this.closeModal();
        });

        // Menu button
        document.getElementById('menuBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Menu items
        document.getElementById('menuStats').addEventListener('click', () => this.showStatsModal());
        document.getElementById('menuExport').addEventListener('click', () => this.exportData());
        document.getElementById('menuImport').addEventListener('click', () => this.showImportModal());
        document.getElementById('menuGuide').addEventListener('click', () => this.showGuideModal());
        document.getElementById('menuPrivacy').addEventListener('click', () => this.showPrivacyModal());
        document.getElementById('menuHome').addEventListener('click', () => this.goHome());
        document.getElementById('menuHelp').addEventListener('click', () => this.showHelpModal());
        document.getElementById('menuAbout').addEventListener('click', () => this.showAboutModal());

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            const menu = document.getElementById('menuDropdown');
            const menuBtn = document.getElementById('menuBtn');
            if (menu.classList.contains('active') && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
                menu.classList.remove('active');
            }
        });
    }

    handleBack() {
        if (this.currentView === 'groups') {
            this.renderChurches();
        } else if (this.currentView === 'members') {
            this.renderGroups(this.currentChurch);
        } else if (this.currentView === 'reading') {
            this.renderMembers(this.currentChurch, this.currentGroup);
        }
    }

    handleFabClick() {
        if (this.currentView === 'churches') {
            this.showAddChurchModal();
        } else if (this.currentView === 'groups') {
            this.showAddGroupModal();
        } else if (this.currentView === 'members') {
            this.showAddMemberModal();
        }
    }

    // ==================== VIEW RENDERING ====================

    renderChurches() {
        this.currentView = 'churches';
        this.currentChurch = null;
        this.currentGroup = null;
        this.currentMember = null;

        this.updateAppBar('성경 읽기', '교회를 선택하거나 추가하세요', false);
        document.getElementById('fab').style.display = 'flex';

        const content = document.getElementById('mainContent');
        
        if (this.data.churches.length === 0) {
            content.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">church</span>
                    <h3>등록된 교회가 없습니다</h3>
                    <p>+ 버튼을 눌러 교회를 추가하세요</p>
                </div>
            `;
            return;
        }

        content.innerHTML = `<div class="cards-grid" id="churchesGrid"></div>`;
        const grid = document.getElementById('churchesGrid');

        this.data.churches.forEach(church => {
            const groupCount = church.groups?.length || 0;
            const memberCount = church.groups?.reduce((sum, g) => sum + (g.members?.length || 0), 0) || 0;

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-icon">
                        <span class="material-icons">church</span>
                    </div>
                    <div class="card-title">
                        <h3>${church.name}</h3>
                        <p>${groupCount}개 그룹 • ${memberCount}명</p>
                    </div>
                    <button class="icon-btn card-menu-btn" onclick="app.showChurchMenu(${church.id}, event)">
                        <span class="material-icons">more_vert</span>
                    </button>
                </div>
            `;
            
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.card-menu-btn')) {
                    this.renderGroups(church);
                }
            });

            grid.appendChild(card);
        });
    }

    renderGroups(church) {
        this.currentView = 'groups';
        this.currentChurch = church;
        this.currentGroup = null;
        this.currentMember = null;

        this.updateAppBar(church.name, '그룹을 선택하거나 추가하세요', true);
        document.getElementById('fab').style.display = 'flex';

        const content = document.getElementById('mainContent');
        
        if (!church.groups || church.groups.length === 0) {
            content.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">groups</span>
                    <h3>등록된 그룹이 없습니다</h3>
                    <p>+ 버튼을 눌러 그룹을 추가하세요</p>
                </div>
            `;
            return;
        }

        content.innerHTML = `<div class="cards-grid" id="groupsGrid"></div>`;
        const grid = document.getElementById('groupsGrid');

        church.groups.forEach(group => {
            const memberCount = group.members?.length || 0;

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-icon">
                        <span class="material-icons">groups</span>
                    </div>
                    <div class="card-title">
                        <h3>${group.name}</h3>
                        <p>${memberCount}명</p>
                    </div>
                    <button class="icon-btn card-menu-btn" onclick="app.showGroupMenu(${church.id}, ${group.id}, event)">
                        <span class="material-icons">more_vert</span>
                    </button>
                </div>
            `;
            
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.card-menu-btn')) {
                    this.renderMembers(church, group);
                }
            });

            grid.appendChild(card);
        });
    }

    renderMembers(church, group) {
        this.currentView = 'members';
        this.currentChurch = church;
        this.currentGroup = group;
        this.currentMember = null;

        this.updateAppBar(group.name, '멤버를 선택하거나 추가하세요', true);
        document.getElementById('fab').style.display = 'flex';

        const content = document.getElementById('mainContent');
        
        if (!group.members || group.members.length === 0) {
            content.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">person</span>
                    <h3>등록된 멤버가 없습니다</h3>
                    <p>+ 버튼을 눌러 멤버를 추가하세요</p>
                </div>
            `;
            return;
        }

        content.innerHTML = `<div class="cards-grid" id="membersGrid"></div>`;
        const grid = document.getElementById('membersGrid');

        group.members.forEach(member => {
            const progress = this.calculateProgress(member);
            const completedBooks = this.getCompletedBooks(member);

            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-header">
                    <div class="card-icon">
                        <span class="material-icons">person</span>
                    </div>
                    <div class="card-title">
                        <h3>${member.name}</h3>
                        <p>${progress}% 완료 • ${completedBooks.length}권</p>
                    </div>
                    <button class="icon-btn card-menu-btn" onclick="app.showMemberMenu(${church.id}, ${group.id}, ${member.id}, event)">
                        <span class="material-icons">more_vert</span>
                    </button>
                </div>
                <div class="card-content">
                    <div class="progress-section">
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>
            `;
            
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.card-menu-btn')) {
                    this.renderReading(church, group, member);
                }
            });

            grid.appendChild(card);
        });
    }

    renderReading(church, group, member) {
        this.currentView = 'reading';
        this.currentChurch = church;
        this.currentGroup = group;
        this.currentMember = member;

        this.updateAppBar(member.name, '성경 읽기 진행 상황', true);
        document.getElementById('fab').style.display = 'none';

        if (!member.reading) {
            member.reading = {};
        }

        const progress = this.calculateProgress(member);
        const completedBooks = this.getCompletedBooks(member);
        const stats = this.getReadingStats(member);

        const content = document.getElementById('mainContent');
        content.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-value">${stats.totalChapters}</div>
                    <div class="stat-label">읽은 장</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${completedBooks.length}</div>
                    <div class="stat-label">완독한 책</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${progress}%</div>
                    <div class="stat-label">진행률</div>
                </div>
            </div>

            <div style="text-align: center; margin-bottom: 32px;">
                <button class="btn btn-error" onclick="app.resetAllReading()">
                    전체 읽기 기록 초기화
                </button>
            </div>

            <div class="tower-section">
                <h2>완독한 성경책</h2>
                <div class="books-tower" id="booksTower">
                    ${completedBooks.length === 0 ? 
                        '<div class="tower-empty">성경책을 완독하면 여기에 표시됩니다</div>' :
                        completedBooks.map(book => `
                            <div class="tower-block">
                                <div class="tower-block-abbr">${book.abbr}</div>
                                <div class="tower-block-name">${book.name}</div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>

            <h2 class="mb-2">구약 성경</h2>
            <div class="books-grid" id="oldTestamentGrid"></div>

            <h2 class="mb-2 mt-3">신약 성경</h2>
            <div class="books-grid" id="newTestamentGrid"></div>
        `;

        this.renderBookCards('oldTestament', 'oldTestamentGrid', member);
        this.renderBookCards('newTestament', 'newTestamentGrid', member);
    }

    resetAllReading() {
        if (confirm('정말로 모든 읽기 기록을 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) {
            this.currentMember.reading = {};
            this.saveData();
            this.renderReading(this.currentChurch, this.currentGroup, this.currentMember);
            this.showSnackbar('모든 읽기 기록이 초기화되었습니다');
        }
    }

    renderBookCards(testament, gridId, member) {
        const grid = document.getElementById(gridId);
        const books = BIBLE_DATA[testament];

        Object.entries(books).forEach(([bookName, bookInfo]) => {
            const readChapters = member.reading[bookName] || [];
            const progress = Math.round((readChapters.length / bookInfo.chapters) * 100);
            const isCompleted = readChapters.length === bookInfo.chapters;

            const card = document.createElement('div');
            card.className = `book-card ${isCompleted ? 'completed' : ''}`;
            card.innerHTML = `
                <div class="book-header">
                    <div class="book-title">${bookName}</div>
                    <span class="material-icons">${isCompleted ? 'check_circle' : 'radio_button_unchecked'}</span>
                </div>
                <div class="book-chapters">${readChapters.length}/${bookInfo.chapters} 장</div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                </div>
            `;

            card.addEventListener('click', () => {
                this.showChaptersModal(bookName, bookInfo, member);
            });

            grid.appendChild(card);
        });
    }

    // ==================== MODALS ====================

    showAddChurchModal() {
        this.openModal('교회 추가', `
            <div class="form-group">
                <label>교회 이름</label>
                <input type="text" class="form-input" id="churchName" placeholder="예: 사랑교회">
            </div>
        `, `
            <button class="btn btn-text" onclick="app.closeModal()">취소</button>
            <button class="btn btn-primary" onclick="app.addChurch()">추가</button>
        `);
    }

    showAddGroupModal() {
        this.openModal('그룹 추가', `
            <div class="form-group">
                <label>그룹 이름</label>
                <input type="text" class="form-input" id="groupName" placeholder="예: 청년부">
            </div>
        `, `
            <button class="btn btn-text" onclick="app.closeModal()">취소</button>
            <button class="btn btn-primary" onclick="app.addGroup()">추가</button>
        `);
    }

    showAddMemberModal() {
        this.openModal('멤버 추가', `
            <div class="form-group">
                <label>멤버 이름</label>
                <input type="text" class="form-input" id="memberName" placeholder="예: 홍길동">
            </div>
        `, `
            <button class="btn btn-text" onclick="app.closeModal()">취소</button>
            <button class="btn btn-primary" onclick="app.addMember()">추가</button>
        `);
    }

    showChaptersModal(bookName, bookInfo, member) {
        const readChapters = member.reading[bookName] || [];
        const chapters = [];
        
        for (let i = 1; i <= bookInfo.chapters; i++) {
            const isRead = readChapters.includes(i);
            chapters.push(`
                <div class="chapter-chip ${isRead ? 'read' : ''}" 
                     data-chapter="${i}"
                     onclick="app.toggleChapterClick(event, '${bookName}', ${i})">
                    ${i}
                </div>
            `);
        }

        const progress = Math.round((readChapters.length / bookInfo.chapters) * 100);

        this.openModal(`${bookName} (${bookInfo.abbr})`, `
            <div class="progress-section">
                <div class="progress-label">
                    <span>${readChapters.length}/${bookInfo.chapters} 장</span>
                    <span>${progress}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: ${progress}%"></div>
                </div>
            </div>
            <div style="display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
                <button class="btn btn-secondary" onclick="app.selectAllChapters('${bookName}', ${bookInfo.chapters})">
                    전체 선택
                </button>
                <button class="btn btn-secondary" onclick="app.deselectAllChapters('${bookName}')">
                    전체 해제
                </button>
                <button class="btn btn-error" onclick="app.resetBook('${bookName}')">
                    초기화
                </button>
            </div>
            <div class="chapters-grid" id="chaptersGrid">
                ${chapters.join('')}
            </div>
        `, `
            <button class="btn btn-primary" onclick="app.closeModal()">완료</button>
        `);

        this.lastSelectedChapter = null;
    }

    toggleChapterClick(event, bookName, chapter) {
        if (event.shiftKey && this.lastSelectedChapter) {
            // Shift key pressed - bulk select
            this.bulkSelectChapters(bookName, this.lastSelectedChapter, chapter);
        } else {
            // Normal click
            this.toggleChapter(bookName, chapter);
            this.lastSelectedChapter = chapter;
        }
    }

    bulkSelectChapters(bookName, start, end) {
        if (!this.currentMember.reading[bookName]) {
            this.currentMember.reading[bookName] = [];
        }

        const chapters = this.currentMember.reading[bookName];
        const min = Math.min(start, end);
        const max = Math.max(start, end);

        // Add all chapters in range if they don't exist
        for (let i = min; i <= max; i++) {
            if (!chapters.includes(i)) {
                chapters.push(i);
            }
        }

        chapters.sort((a, b) => a - b);
        this.saveData();

        // Refresh modal
        const bookInfo = BIBLE_DATA.oldTestament[bookName] || BIBLE_DATA.newTestament[bookName];
        this.showChaptersModal(bookName, bookInfo, this.currentMember);
    }

    selectAllChapters(bookName, totalChapters) {
        if (!this.currentMember.reading[bookName]) {
            this.currentMember.reading[bookName] = [];
        }

        this.currentMember.reading[bookName] = Array.from({length: totalChapters}, (_, i) => i + 1);
        this.saveData();

        const bookInfo = BIBLE_DATA.oldTestament[bookName] || BIBLE_DATA.newTestament[bookName];
        this.showChaptersModal(bookName, bookInfo, this.currentMember);
        this.showSnackbar('전체 장이 선택되었습니다');
    }

    deselectAllChapters(bookName) {
        if (this.currentMember.reading[bookName]) {
            this.currentMember.reading[bookName] = [];
            this.saveData();

            const bookInfo = BIBLE_DATA.oldTestament[bookName] || BIBLE_DATA.newTestament[bookName];
            this.showChaptersModal(bookName, bookInfo, this.currentMember);
            this.showSnackbar('전체 장이 해제되었습니다');
        }
    }

    resetBook(bookName) {
        if (confirm(`${bookName}의 모든 읽기 기록을 초기화하시겠습니까?`)) {
            this.currentMember.reading[bookName] = [];
            this.saveData();

            const bookInfo = BIBLE_DATA.oldTestament[bookName] || BIBLE_DATA.newTestament[bookName];
            this.showChaptersModal(bookName, bookInfo, this.currentMember);
            this.showSnackbar(`${bookName}이 초기화되었습니다`);
        }
    }

    showChurchMenu(churchId, event) {
        event.stopPropagation();
        this.openModal('교회 관리', `
            <p>이 교회를 삭제하시겠습니까?</p>
            <p style="color: var(--text-secondary); font-size: 0.875rem;">하위 그룹과 멤버도 모두 삭제됩니다.</p>
        `, `
            <button class="btn btn-text" onclick="app.closeModal()">취소</button>
            <button class="btn btn-error" onclick="app.deleteChurch(${churchId})">삭제</button>
        `);
    }

    showGroupMenu(churchId, groupId, event) {
        event.stopPropagation();
        this.openModal('그룹 관리', `
            <p>이 그룹을 삭제하시겠습니까?</p>
            <p style="color: var(--text-secondary); font-size: 0.875rem;">그룹의 멤버도 모두 삭제됩니다.</p>
        `, `
            <button class="btn btn-text" onclick="app.closeModal()">취소</button>
            <button class="btn btn-error" onclick="app.deleteGroup(${churchId}, ${groupId})">삭제</button>
        `);
    }

    showMemberMenu(churchId, groupId, memberId, event) {
        event.stopPropagation();
        this.openModal('멤버 관리', `
            <p>이 멤버를 삭제하시겠습니까?</p>
            <p style="color: var(--text-secondary); font-size: 0.875rem;">멤버의 읽기 기록도 모두 삭제됩니다.</p>
        `, `
            <button class="btn btn-text" onclick="app.closeModal()">취소</button>
            <button class="btn btn-error" onclick="app.deleteMember(${churchId}, ${groupId}, ${memberId})">삭제</button>
        `);
    }

    openModal(title, content, actions) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalContent').innerHTML = content;
        document.getElementById('modalActions').innerHTML = actions;
        document.getElementById('modalOverlay').classList.add('active');
    }

    closeModal() {
        document.getElementById('modalOverlay').classList.remove('active');
    }

    // ==================== CRUD OPERATIONS ====================

    addChurch() {
        const name = document.getElementById('churchName').value.trim();
        if (!name) {
            this.showSnackbar('교회 이름을 입력하세요');
            return;
        }

        const church = {
            id: this.data.nextChurchId++,
            name: name,
            groups: []
        };

        this.data.churches.push(church);
        this.saveData();
        this.closeModal();
        this.renderChurches();
        this.showSnackbar('교회가 추가되었습니다');
    }

    addGroup() {
        const name = document.getElementById('groupName').value.trim();
        if (!name) {
            this.showSnackbar('그룹 이름을 입력하세요');
            return;
        }

        if (!this.currentChurch.groups) {
            this.currentChurch.groups = [];
        }

        const group = {
            id: this.data.nextGroupId++,
            name: name,
            members: []
        };

        this.currentChurch.groups.push(group);
        this.saveData();
        this.closeModal();
        this.renderGroups(this.currentChurch);
        this.showSnackbar('그룹이 추가되었습니다');
    }

    addMember() {
        const name = document.getElementById('memberName').value.trim();
        if (!name) {
            this.showSnackbar('멤버 이름을 입력하세요');
            return;
        }

        if (!this.currentGroup.members) {
            this.currentGroup.members = [];
        }

        const member = {
            id: this.data.nextMemberId++,
            name: name,
            reading: {}
        };

        this.currentGroup.members.push(member);
        this.saveData();
        this.closeModal();
        this.renderMembers(this.currentChurch, this.currentGroup);
        this.showSnackbar('멤버가 추가되었습니다');
    }

    deleteChurch(churchId) {
        this.data.churches = this.data.churches.filter(c => c.id !== churchId);
        this.saveData();
        this.closeModal();
        this.renderChurches();
        this.showSnackbar('교회가 삭제되었습니다');
    }

    deleteGroup(churchId, groupId) {
        const church = this.data.churches.find(c => c.id === churchId);
        if (church) {
            church.groups = church.groups.filter(g => g.id !== groupId);
            this.saveData();
            this.closeModal();
            this.renderGroups(church);
            this.showSnackbar('그룹이 삭제되었습니다');
        }
    }

    deleteMember(churchId, groupId, memberId) {
        const church = this.data.churches.find(c => c.id === churchId);
        if (church) {
            const group = church.groups.find(g => g.id === groupId);
            if (group) {
                group.members = group.members.filter(m => m.id !== memberId);
                this.saveData();
                this.closeModal();
                this.renderMembers(church, group);
                this.showSnackbar('멤버가 삭제되었습니다');
            }
        }
    }

    toggleChapter(bookName, chapter) {
        if (!this.currentMember.reading[bookName]) {
            this.currentMember.reading[bookName] = [];
        }

        const chapters = this.currentMember.reading[bookName];
        const index = chapters.indexOf(chapter);

        if (index > -1) {
            chapters.splice(index, 1);
        } else {
            chapters.push(chapter);
            chapters.sort((a, b) => a - b);
        }

        this.saveData();
        
        // Update UI
        const bookInfo = BIBLE_DATA.oldTestament[bookName] || BIBLE_DATA.newTestament[bookName];
        this.showChaptersModal(bookName, bookInfo, this.currentMember);
    }

    // ==================== HELPER FUNCTIONS ====================

    calculateProgress(member) {
        if (!member.reading) return 0;

        let totalChapters = 0;
        let readChapters = 0;

        Object.values(BIBLE_DATA.oldTestament).forEach(book => totalChapters += book.chapters);
        Object.values(BIBLE_DATA.newTestament).forEach(book => totalChapters += book.chapters);

        Object.values(member.reading).forEach(chapters => {
            readChapters += chapters.length;
        });

        return Math.round((readChapters / totalChapters) * 100);
    }

    getCompletedBooks(member) {
        if (!member.reading) return [];

        const completed = [];

        ['oldTestament', 'newTestament'].forEach(testament => {
            Object.entries(BIBLE_DATA[testament]).forEach(([bookName, bookInfo]) => {
                const readChapters = member.reading[bookName] || [];
                if (readChapters.length === bookInfo.chapters) {
                    completed.push({ name: bookName, abbr: bookInfo.abbr });
                }
            });
        });

        return completed;
    }

    getReadingStats(member) {
        if (!member.reading) return { totalChapters: 0 };

        let totalChapters = 0;
        Object.values(member.reading).forEach(chapters => {
            totalChapters += chapters.length;
        });

        return { totalChapters };
    }

    updateAppBar(title, subtitle, showBack) {
        document.getElementById('appTitle').textContent = title;
        document.getElementById('appSubtitle').textContent = subtitle;
        document.getElementById('backBtn').style.display = showBack ? 'flex' : 'none';
    }

    showSnackbar(message) {
        const snackbar = document.getElementById('snackbar');
        document.getElementById('snackbarMessage').textContent = message;
        snackbar.classList.add('active');
        setTimeout(() => snackbar.classList.remove('active'), 3000);
    }

    // ==================== MENU FUNCTIONS ====================

    toggleMenu() {
        const menu = document.getElementById('menuDropdown');
        menu.classList.toggle('active');
    }

    showStatsModal() {
        this.toggleMenu();
        
        let totalChurches = this.data.churches.length;
        let totalGroups = 0;
        let totalMembers = 0;
        let totalChaptersRead = 0;
        let totalBooksCompleted = 0;

        this.data.churches.forEach(church => {
            totalGroups += church.groups?.length || 0;
            church.groups?.forEach(group => {
                totalMembers += group.members?.length || 0;
                group.members?.forEach(member => {
                    if (member.reading) {
                        Object.values(member.reading).forEach(chapters => {
                            totalChaptersRead += chapters.length;
                        });
                        totalBooksCompleted += this.getCompletedBooks(member).length;
                    }
                });
            });
        });

        const totalBibleChapters = Object.values(BIBLE_DATA.oldTestament).reduce((sum, book) => sum + book.chapters, 0) +
                                    Object.values(BIBLE_DATA.newTestament).reduce((sum, book) => sum + book.chapters, 0);

        this.openModal('📊 전체 통계', `
            <ul class="stats-list">
                <li>
                    <span class="label">등록된 교회</span>
                    <span class="value">${totalChurches}개</span>
                </li>
                <li>
                    <span class="label">등록된 그룹</span>
                    <span class="value">${totalGroups}개</span>
                </li>
                <li>
                    <span class="label">등록된 멤버</span>
                    <span class="value">${totalMembers}명</span>
                </li>
                <li>
                    <span class="label">총 읽은 장</span>
                    <span class="value">${totalChaptersRead}장</span>
                </li>
                <li>
                    <span class="label">총 완독한 책</span>
                    <span class="value">${totalBooksCompleted}권</span>
                </li>
                <li>
                    <span class="label">전체 성경 장 수</span>
                    <span class="value">${totalBibleChapters}장</span>
                </li>
                <li>
                    <span class="label">전체 진행률</span>
                    <span class="value">${totalMembers > 0 ? Math.round((totalChaptersRead / (totalBibleChapters * totalMembers)) * 100) : 0}%</span>
                </li>
            </ul>
        `, `
            <button class="btn btn-primary" onclick="app.closeModal()">닫기</button>
        `);
    }

    exportData() {
        this.toggleMenu();
        
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bible-reading-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        
        this.showSnackbar('데이터가 다운로드되었습니다');
    }

    showImportModal() {
        this.toggleMenu();
        
        this.openModal('📂 데이터 불러오기', `
            <div class="info-section">
                <h3>⚠️ 주의사항</h3>
                <p>데이터를 불러오면 현재 데이터가 모두 대체됩니다.<br>
                먼저 현재 데이터를 백업하는 것을 권장합니다.</p>
            </div>
            <div class="form-group">
                <label>백업 파일 선택</label>
                <input type="file" class="form-input" id="importFile" accept=".json">
            </div>
        `, `
            <button class="btn btn-text" onclick="app.closeModal()">취소</button>
            <button class="btn btn-primary" onclick="app.importData()">불러오기</button>
        `);
    }

    importData() {
        const fileInput = document.getElementById('importFile');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showSnackbar('파일을 선택하세요');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                
                // Validate data structure
                if (!importedData.churches || !Array.isArray(importedData.churches)) {
                    throw new Error('잘못된 데이터 형식입니다');
                }

                // Backup current data first
                this.exportData();

                // Import new data
                this.data = importedData;
                this.saveData();
                this.closeModal();
                this.renderChurches();
                this.showSnackbar('데이터를 성공적으로 불러왔습니다');
            } catch (error) {
                this.showSnackbar('파일을 읽을 수 없습니다: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    showGuideModal() {
        this.toggleMenu();
        
        const onlineStatus = this.firebaseEnabled ? 
            '<strong style="color: var(--green)">☁️ 온라인 모드 활성화</strong>' : 
            '<strong style="color: var(--orange)">📴 오프라인 모드</strong>';
        
        this.openModal('📘 사용법', `
            <div class="info-section" style="background: linear-gradient(135deg, var(--green) 0%, var(--background) 100%); border-color: var(--green);">
                <h3>현재 상태</h3>
                <p>${onlineStatus}</p>
                ${this.firebaseEnabled ? 
                    '<p>✅ 실시간 동기화 및 그룹 멤버 간 공유 가능</p>' : 
                    '<p>⚠️ 로컬 저장만 가능 (브라우저 내)</p>'}
            </div>

            <div class="info-section">
                <h3>시작하기</h3>
                <p>이 앱은 교회, 그룹, 개인별로 성경 읽기 진도를 관리하고 ${this.firebaseEnabled ? '<strong>실시간으로 공유</strong>' : '추적'}할 수 있는 도구입니다.</p>
            </div>

            <div class="info-section">
                <h3>1️⃣ 교회 추가</h3>
                <p>처음 시작할 때 우측 하단의 <strong>+ 버튼</strong>을 눌러 교회를 추가하세요.</p>
                ${this.firebaseEnabled ? '<p>💡 온라인 모드에서는 클라우드에 자동 저장됩니다.</p>' : ''}
            </div>

            <div class="info-section">
                <h3>2️⃣ 그룹 추가</h3>
                <p>교회를 선택한 후, 다시 <strong>+ 버튼</strong>을 눌러 그룹(청년부, 장년부 등)을 추가하세요.</p>
            </div>

            <div class="info-section">
                <h3>3️⃣ 멤버 추가</h3>
                <p>그룹을 선택한 후, <strong>+ 버튼</strong>을 눌러 개인 멤버를 추가하세요.</p>
            </div>

            <div class="info-section">
                <h3>4️⃣ 읽기 기록</h3>
                <p>멤버를 선택하면 66권의 성경책이 나타납니다. 성경책을 클릭하고 읽은 장을 선택하세요.</p>
                <ul>
                    <li><strong>단일 선택:</strong> 장 번호 클릭</li>
                    <li><strong>범위 선택:</strong> 시작 장 클릭 → Shift 키를 누른 채 끝 장 클릭</li>
                    <li><strong>전체 선택:</strong> "전체 선택" 버튼 클릭</li>
                    <li><strong>전체 해제:</strong> "전체 해제" 버튼 클릭</li>
                </ul>
                ${this.firebaseEnabled ? '<p>🔄 <strong>실시간 공유:</strong> 같은 그룹의 다른 멤버들이 즉시 진행상황을 확인할 수 있습니다.</p>' : ''}
            </div>

            <div class="info-section">
                <h3>5️⃣ 완독 확인</h3>
                <p>책을 완독하면 우측 "완독한 성경책" 영역에 블록으로 쌓입니다!</p>
            </div>

            ${this.firebaseEnabled ? `
            <div class="info-section" style="background: linear-gradient(135deg, var(--secondary) 0%, var(--background) 100%); border-color: var(--secondary);">
                <h3>☁️ 클라우드 공유 기능</h3>
                <ul>
                    <li><strong>실시간 동기화:</strong> 읽기 기록이 자동으로 클라우드에 저장</li>
                    <li><strong>그룹 공유:</strong> 같은 그룹 멤버들끼리 진행상황 실시간 확인</li>
                    <li><strong>어디서나 접속:</strong> 링크로 세계 어디서나 접속 가능</li>
                    <li><strong>자동 백업:</strong> 데이터 손실 걱정 없음</li>
                </ul>
            </div>
            ` : ''}

            <div class="info-section">
                <h3>💡 유용한 기능</h3>
                <ul>
                    ${!this.firebaseEnabled ? '<li><strong>백업:</strong> 메뉴 → 데이터 내보내기로 JSON 파일 저장</li>' : ''}
                    ${!this.firebaseEnabled ? '<li><strong>복원:</strong> 메뉴 → 데이터 불러오기로 백업 파일 복원</li>' : ''}
                    <li><strong>통계:</strong> 메뉴 → 전체 통계에서 전체 진행 상황 확인</li>
                    <li><strong>초기화:</strong> 개별 책 또는 전체 읽기 기록 초기화 가능</li>
                </ul>
            </div>
        `, `
            <button class="btn btn-primary" onclick="app.closeModal()">확인</button>
        `);
    }

    showPrivacyModal() {
        this.toggleMenu();
        
        this.openModal('🔒 프라이버시 정책', `
            <div class="info-section">
                <h3>데이터 저장 방식</h3>
                ${this.firebaseEnabled ? `
                    <p><strong>☁️ 온라인 모드 (현재 활성화):</strong></p>
                    <p>데이터는 <strong>Google Firebase 클라우드</strong>에 저장됩니다.</p>
                ` : `
                    <p><strong>📴 오프라인 모드 (현재 상태):</strong></p>
                    <p>모든 데이터는 <strong>브라우저 로컬 스토리지</strong>에만 저장됩니다.</p>
                `}
            </div>

            ${this.firebaseEnabled ? `
            <div class="info-section">
                <h3>☁️ 클라우드 저장 정보</h3>
                <p><strong>저장되는 정보:</strong></p>
                <ul>
                    <li>교회, 그룹, 멤버 이름</li>
                    <li>성경 읽기 진행 기록 (책, 장 번호)</li>
                    <li>생성 및 업데이트 시간</li>
                </ul>
                <p><strong>저장되지 않는 정보:</strong></p>
                <ul>
                    <li>이메일 주소, 전화번호 등 개인 연락처</li>
                    <li>로그인 정보 (익명 인증 사용)</li>
                    <li>위치 정보</li>
                    <li>기기 정보</li>
                </ul>
            </div>

            <div class="info-section">
                <h3>🔐 보안 및 접근 권한</h3>
                <ul>
                    <li><strong>읽기:</strong> 모든 사용자가 데이터 조회 가능 (공유 목적)</li>
                    <li><strong>쓰기:</strong> 인증된 사용자만 데이터 생성/수정 가능</li>
                    <li><strong>암호화:</strong> HTTPS를 통한 안전한 데이터 전송</li>
                    <li><strong>익명 인증:</strong> 개인정보 수집 없이 기능 사용</li>
                </ul>
            </div>

            <div class="info-section">
                <h3>🌐 데이터 공유</h3>
                <p><strong>그룹 내 공유:</strong></p>
                <ul>
                    <li>같은 그룹의 멤버들끼리 진행상황 실시간 확인</li>
                    <li>서로 격려하고 함께 성경을 읽을 수 있음</li>
                    <li>공개 범위: 앱을 사용하는 모든 사용자</li>
                </ul>
            </div>
            ` : `
            <div class="info-section">
                <h3>📴 로컬 저장 정보</h3>
                <ul>
                    <li><strong>서버 전송 없음:</strong> 모든 데이터는 기기에만 저장</li>
                    <li><strong>외부 업로드 없음:</strong> 인터넷 연결 불필요</li>
                    <li><strong>개인정보 수집 없음:</strong> 어떤 정보도 수집하지 않음</li>
                </ul>
            </div>
            `}

            <div class="info-section">
                <h3>🚫 수집하지 않는 정보</h3>
                <ul>
                    <li>광고 추적 없음</li>
                    <li>쿠키 추적 없음</li>
                    <li>분석 도구 없음</li>
                    <li>제3자 공유 없음</li>
                </ul>
            </div>

            <div class="info-section">
                <h3>🗑️ 데이터 삭제</h3>
                <p><strong>언제든지 삭제 가능:</strong></p>
                <ul>
                    ${this.firebaseEnabled ? 
                        '<li>개별 항목: 각 카드의 메뉴에서 삭제</li>' : 
                        '<li>브라우저 캐시를 지우면 데이터 삭제</li>'}
                    <li>초기화: 전체 읽기 기록 초기화 기능 제공</li>
                </ul>
            </div>

            ${!this.firebaseEnabled ? `
            <div class="info-section">
                <h3>💾 권장 사항</h3>
                <p>정기적으로 "데이터 내보내기" 기능을 사용하여 백업 파일을 저장하세요.</p>
            </div>
            ` : ''}

            <div class="info-section">
                <h3>📧 문의</h3>
                <p>프라이버시 관련 문의사항은 교회 홈페이지를 통해 연락 주세요.</p>
            </div>
        `, `
            <button class="btn btn-primary" onclick="app.closeModal()">확인</button>
        `);
    }

    goHome() {
        this.toggleMenu();
        this.renderChurches();
        this.showSnackbar('처음 화면으로 돌아갔습니다');
    }

    showHelpModal() {
        this.toggleMenu();
        
        this.openModal('📖 사용법', `
            <div class="info-section">
                <h3>🏛️ 교회/그룹/멤버 관리</h3>
                <ul>
                    <li><strong>추가:</strong> 우측 하단 + 버튼 클릭</li>
                    <li><strong>삭제:</strong> 카드의 ⋮ 버튼 클릭</li>
                    <li><strong>이동:</strong> 카드를 클릭하여 하위 항목으로 이동</li>
                </ul>
            </div>

            <div class="info-section">
                <h3>📚 성경 읽기 트래킹</h3>
                <ul>
                    <li><strong>장 선택:</strong> 성경책 카드 클릭 후 장 번호 클릭</li>
                    <li><strong>범위 선택:</strong> 첫 장 클릭 → Shift + 마지막 장 클릭</li>
                    <li><strong>전체 선택:</strong> "전체 선택" 버튼 클릭</li>
                    <li><strong>전체 해제:</strong> "전체 해제" 버튼 클릭</li>
                </ul>
            </div>

            <div class="info-section">
                <h3>🔄 초기화</h3>
                <ul>
                    <li><strong>개별 책:</strong> 성경책 모달에서 "초기화" 버튼</li>
                    <li><strong>전체:</strong> 읽기 화면에서 "전체 읽기 기록 초기화"</li>
                </ul>
            </div>

            <div class="info-section">
                <h3>💾 백업/복원</h3>
                <ul>
                    <li><strong>백업:</strong> 메뉴 → "데이터 내보내기"</li>
                    <li><strong>복원:</strong> 메뉴 → "데이터 불러오기"</li>
                </ul>
            </div>
        `, `
            <button class="btn btn-primary" onclick="app.closeModal()">확인</button>
        `);
    }

    showAboutModal() {
        this.toggleMenu();
        
        this.openModal('ℹ️ 앱 정보', `
            <div class="info-section">
                <h3>성경 읽기 트래커</h3>
                <p><strong>버전:</strong> 2.0.0</p>
                <p><strong>디자인:</strong> 퐁피두 센터 스타일</p>
                <p><strong>개발일:</strong> 2025년 10월 28일</p>
            </div>

            <div class="info-section">
                <h3>🎨 특징</h3>
                <ul>
                    <li>대담한 색상과 역동적인 디자인</li>
                    <li>교회/그룹/멤버 계층 구조 관리</li>
                    <li>개인별 성경 읽기 진행 추적</li>
                    <li>완독한 성경책 시각화</li>
                    <li>벌크 선택 및 빠른 입력</li>
                    <li>데이터 백업 및 복원</li>
                </ul>
            </div>

            <div class="info-section">
                <h3>📊 성경 정보</h3>
                <p><strong>구약:</strong> 39권</p>
                <p><strong>신약:</strong> 27권</p>
                <p><strong>총 장수:</strong> 1,189장</p>
            </div>

            <div class="info-section">
                <h3>💡 팁</h3>
                <p>정기적으로 데이터를 백업하여 소중한 읽기 기록을 보존하세요!</p>
            </div>
        `, `
            <button class="btn btn-primary" onclick="app.closeModal()">닫기</button>
        `);
    }
}

// ==================== INITIALIZE APP ====================

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new BibleReadingApp();
});
