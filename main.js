document.addEventListener('DOMContentLoaded', () => {
    /* 폭죽(canvas-confetti) 라이브러리 로드 */
    const confettiScript = document.createElement('script');
    confettiScript.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    document.head.appendChild(confettiScript);

    /* =========================================================
     * 1. 로또 번호 생성기 데이터 & 로직
     * ======================================================= */
    const DRAWS = [
        { round: 1226, date: '2026-05-30', numbers: [4, 6, 13, 17, 26, 28], bonus: 41 },
        { round: 1225, date: '2026-05-23', numbers: [8, 9, 19, 25, 41, 42], bonus: 33 },
        { round: 1224, date: '2026-05-16', numbers: [9, 18, 21, 27, 44, 45], bonus: 28 },
        { round: 1223, date: '2026-05-09', numbers: [16, 18, 20, 32, 33, 39], bonus: 26 },
        { round: 1222, date: '2026-05-02', numbers: [4, 11, 17, 22, 32, 41], bonus: 34 },
        { round: 1221, date: '2026-04-25', numbers: [6, 13, 18, 28, 30, 36], bonus: 9 },
        { round: 1220, date: '2026-04-18', numbers: [2, 22, 25, 28, 34, 43], bonus: 16 },
        { round: 1219, date: '2026-04-11', numbers: [1, 2, 15, 28, 39, 45], bonus: 31 },
        { round: 1218, date: '2026-04-04', numbers: [3, 28, 31, 32, 42, 45], bonus: 25 },
        { round: 1217, date: '2026-03-28', numbers: [8, 10, 15, 20, 29, 31], bonus: 41 },
    ];

    const freq = {};
    for (let n = 1; n <= 45; n++) freq[n] = 0;
    DRAWS.forEach(d => d.numbers.forEach(n => { freq[n]++; }));
    const maxFreq = Math.max(...Object.values(freq));

    function ballClass(number) {
        if (number <= 10) return 'ball-1-10';
        if (number <= 20) return 'ball-11-20';
        if (number <= 30) return 'ball-21-30';
        if (number <= 40) return 'ball-31-40';
        return 'ball-41-45';
    }

    function makeBall(number, delayIndex) {
        const span = document.createElement('span');
        span.textContent = number;
        span.classList.add(ballClass(number));
        if (delayIndex != null) span.style.animationDelay = `${delayIndex * 0.1}s`;
        return span;
    }

    let currentMode = 'hot';
    const MODE_DESC = {
        hot: '🔥 핫넘버: 최근 10회차에서 자주 나온 번호에 가중치를 두고 추천합니다.',
        cold: '❄️ 콜드넘버: 최근 10회차에서 적게 나온 번호에 가중치를 두고 추천합니다.',
        random: '🎲 완전 랜덤: 1~45 중 6개를 순수 무작위로 추첨합니다.'
    };
    const modeDescEl = document.getElementById('mode-desc');
    const modeBtns = document.querySelectorAll('.mode-btn');

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
            modeDescEl.textContent = MODE_DESC[currentMode];
        });
    });
    if (modeDescEl) modeDescEl.textContent = MODE_DESC[currentMode];

    function weightedPick(weights) {
        const pool = [];
        for (let n = 1; n <= 45; n++) {
            if (weights[n] > 0) pool.push({ n, w: weights[n] });
        }
        const picked = new Set();
        while (picked.size < 6 && pool.length > 0) {
            const total = pool.reduce((s, x) => s + x.w, 0);
            let r = Math.random() * total;
            let idx = 0;
            for (let i = 0; i < pool.length; i++) {
                r -= pool[i].w;
                if (r <= 0) { idx = i; break; }
            }
            picked.add(pool[idx].n);
            pool.splice(idx, 1);
        }
        while (picked.size < 6) picked.add(Math.floor(Math.random() * 45) + 1);
        return Array.from(picked).sort((a, b) => a - b);
    }

    function generateSet(mode) {
        if (mode === 'random') {
            const nums = new Set();
            while (nums.size < 6) nums.add(Math.floor(Math.random() * 45) + 1);
            return Array.from(nums).sort((a, b) => a - b);
        }
        const weights = {};
        for (let n = 1; n <= 45; n++) {
            if (mode === 'hot') weights[n] = Math.pow(freq[n], 2);
            else weights[n] = Math.pow(maxFreq - freq[n] + 1, 2);
        }
        return weightedPick(weights);
    }

    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers-container');

    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            numbersContainer.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    const set = generateSet(currentMode);
                    const row = document.createElement('div');
                    row.classList.add('number-set');
                    set.forEach((num, idx) => row.appendChild(makeBall(num, idx)));
                    numbersContainer.appendChild(row);
                }, i * 150);
            }
        });
    }

    // 통계 및 최근 당첨번호 렌더링
    function renderLottoStats() {
        const recentGrid = document.getElementById('recent-draws');
        if (recentGrid) {
            recentGrid.innerHTML = '';
            DRAWS.forEach(d => {
                const item = document.createElement('div');
                item.classList.add('draw-item');
                item.innerHTML = `<div class="draw-head"><span class="draw-round">제${d.round}회</span><span class="draw-date">${d.date}</span></div>`;
                const balls = document.createElement('div');
                balls.classList.add('draw-balls');
                d.numbers.forEach(n => balls.appendChild(makeBall(n)));
                const plus = document.createElement('span');
                plus.classList.add('plus-sign');
                plus.textContent = '+';
                balls.appendChild(plus);
                const bonus = makeBall(d.bonus);
                bonus.classList.add('bonus-ball');
                balls.appendChild(bonus);
                item.appendChild(balls);
                recentGrid.appendChild(item);
            });
        }

        const chart = document.getElementById('freq-chart');
        if (chart) {
            chart.innerHTML = '';
            for (let n = 1; n <= 45; n++) {
                const bar = document.createElement('div');
                bar.classList.add('freq-bar');
                const heightPct = maxFreq ? (freq[n] / maxFreq) * 100 : 0;
                bar.innerHTML = `<div class="freq-count">${freq[n]}</div><div class="freq-fill-wrap"><div class="freq-fill ${ballClass(n)}" style="height:${heightPct}%"></div></div><div class="freq-label">${n}</div>`;
                chart.appendChild(bar);
            }
        }

        const sortedByFreq = Array.from({ length: 45 }, (_, i) => i + 1).sort((a, b) => freq[b] - freq[a] || a - b);
        const topHot = sortedByFreq.slice(0, 6).sort((a, b) => a - b);
        const topCold = sortedByFreq.slice(-6).sort((a, b) => a - b);
        const hotEl = document.getElementById('top-hot');
        const coldEl = document.getElementById('top-cold');
        if (hotEl) { hotEl.innerHTML = ''; topHot.forEach(n => hotEl.appendChild(makeBall(n))); }
        if (coldEl) { coldEl.innerHTML = ''; topCold.forEach(n => coldEl.appendChild(makeBall(n))); }
    }
    renderLottoStats();

    /* =========================================================
     * 2. 식사 메뉴 추천 로직 (카테고리별 세부 메뉴 + 폭죽 강조)
     * ======================================================= */
    // 큰 카테고리 → 그 안의 세부 메뉴까지 세분화
    const MEAL_CATEGORIES = {
        "🍚 한식": [
            "돼지고기 김치찌개", "참치 김치찌개", "차돌 된장찌개", "우렁 된장찌개", "해물 순두부찌개",
            "차돌 순두부찌개", "들깨 순두부찌개", "매콤 제육볶음", "간장 제육볶음", "오징어 볶음",
            "쭈꾸미 볶음", "간장게장", "양념게장", "한우 소불고기", "춘천 닭갈비",
            "한방 보쌈", "마늘 보쌈", "한방 족발", "불족발", "한우 육회",
            "전주 비빔밥", "강된장 비빔밥", "평양 물냉면", "함흥 비빔냉면", "코다리 회냉면",
            "바지락 칼국수", "들깨 칼국수", "얼큰 장칼국수", "멸치 잔치국수", "매콤 비빔국수",
            "시원한 열무국수", "걸쭉한 콩국수", "김치 수제비", "들깨 수제비", "고기 만두국",
            "김치 만두국", "사골 떡국", "진한 갈비탕", "맑은 나주곰탕", "순대국밥",
            "내장 국밥", "돼지 국밥", "뼈다귀 해장국", "우거지 해장국", "선지 해장국",
            "추어탕", "한방 삼계탕", "안동 찜닭", "매콤 아구찜", "해물찜",
            "묵은지 김치찜", "고등어 구이", "임연수 구이", "갈치 조림", "진한 청국장",
            "담백한 비지찌개", "우렁 쌈밥 정식", "육개장", "육회 비빔밥", "꼬막 비빔밥"
        ],
        "🍣 일식": [
            "바삭한 등심카츠", "부드러운 안심카츠", "치즈 폭포 카츠", "고구마 치즈카츠", "두툼한 규카츠",
            "모둠초밥 (12pcs)", "특상 연어초밥", "생연어 덮밥(사케동)", "민물 장어덮밥(우나기동)", "바삭한 가츠동",
            "탱글한 에비동", "모둠 텐동", "진한 돈코츠 라멘", "카라이 라멘", "미소 라멘",
            "쇼유 라멘", "카레 우동", "튀김 우동", "자루 소바", "새콤달콤 회덮밥",
            "시원한 모밀소바", "판모밀", "마제소바", "야끼소바", "규동(소고기 덮밥)"
        ],
        "🥢 중식": [
            "옛날 짜장면", "해물 짬뽕", "차돌 짬뽕", "고기 간짜장", "해물 쟁반짜장",
            "바삭한 탕수육(부먹)", "바삭한 탕수육(찍먹)", "쫄깃한 꿔바로우", "매콤 마파두부", "고추잡채와 꽃빵",
            "톡 쏘는 양장피", "부드러운 유산슬", "계란 볶음밥", "잡채밥", "짬뽕밥",
            "알싸한 마라탕", "중독적인 마라샹궈", "모둠 딤섬", "샤오롱바오", "멘보샤"
        ],
        "🍝 양식": [
            "고르곤졸라 피자", "페퍼로니 피자", "마르게리따 피자", "콤비네이션 피자", "스테이크 피자",
            "베이컨 까르보나라", "매콤 알리오올리오", "해산물 토마토 파스타", "쉬림프 로제 파스타", "봉골레 파스타",
            "미디움 스테이크", "두툼한 수제버거", "클럽 샌드위치", "치킨 데리야끼 서브", "이탈리안 비엠티"
        ],
        "🌏 아시안·세계음식": [
            "양지 쌀국수", "해물 팟타이", "나시고랭", "양꼬치", "치킨 케밥",
            "비프 타코", "치킨 브리또", "치즈 퀘사디아", "탄두리 치킨", "치킨 마크니 커리",
            "분짜", "짜조", "월남쌈", "푸팟퐁커리", "똠양꿍"
        ]
    };

    // (카테고리, 세부 메뉴) 쌍으로 평탄화
    const MEAL_PAIRS = Object.entries(MEAL_CATEGORIES).flatMap(
        ([category, items]) => items.map(name => ({ category, name }))
    );

    const mealBtn = document.getElementById('recommend-meal-btn');
    const mealDisplay = document.getElementById('meal-display');
    const totalCountEl = document.getElementById('total-menu-count');
    if (totalCountEl) totalCountEl.textContent = MEAL_PAIRS.length;

    // 폭죽 축하 효과 — 가운데 버스트 + 양쪽에서 쏟아지는 폭죽
    function celebrate() {
        if (!window.confetti) return;
        confetti({ particleCount: 130, spread: 80, startVelocity: 55, origin: { y: 0.6 } });
        confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
        confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
        setTimeout(() => {
            confetti({ particleCount: 50, spread: 100, startVelocity: 40, scalar: 1.2, origin: { y: 0.5 } });
        }, 200);
    }

    if (mealBtn) {
        mealBtn.addEventListener('click', () => {
            mealDisplay.innerHTML = '<div class="meal-placeholder"><span class="icon spin">🍱</span><p>고민 중...</p></div>';
            setTimeout(() => {
                const { category, name } = MEAL_PAIRS[Math.floor(Math.random() * MEAL_PAIRS.length)];
                mealDisplay.innerHTML = `
                    <div class="meal-result">
                        <span class="meal-cat-badge">${category}</span>
                        <h3 class="meal-highlight-name">${name}</h3>
                        <p class="meal-sub">🎉 오늘의 추천 메뉴! 🎉</p>
                    </div>`;
                celebrate();
            }, 800);
        });
    }

    /* ===================== 테마 토글 ===================== */
    const themeBtn = document.getElementById('theme-btn');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    if (themeBtn) themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
        });
    }
});
