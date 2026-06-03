document.addEventListener('DOMContentLoaded', () => {
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
     * 2. 식사 메뉴 추천 로직
     * ======================================================= */
    const MEALS = [
        { name: '김치찌개', image: 'https://images.unsplash.com/photo-1583213048544-a4618e98038d?auto=format&fit=crop&q=80&w=400' },
        { name: '된장찌개', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=400' },
        { name: '불고기', image: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&q=80&w=400' },
        { name: '비빔밥', image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=400' },
        { name: '떡볶이', image: 'https://images.unsplash.com/photo-1623689047010-94a11f978082?auto=format&fit=crop&q=80&w=400' },
        { name: '삼겹살', image: 'https://images.unsplash.com/photo-1606471191009-63994c53433b?auto=format&fit=crop&q=80&w=400' },
        { name: '돈까스', image: 'https://images.unsplash.com/photo-1598514983318-2914a9447e69?auto=format&fit=crop&q=80&w=400' },
        { name: '치킨', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400' },
        { name: '짜장면', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400' },
        { name: '초밥', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=400' },
        { name: '햄버거', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400' },
        { name: '피자', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=400' },
        { name: '파스타', image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=400' },
        { name: '샌드위치', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=400' },
        { name: '라멘', image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400' }
    ];

    const mealBtn = document.getElementById('recommend-meal-btn');
    const mealDisplay = document.getElementById('meal-display');

    if (mealBtn) {
        mealBtn.addEventListener('click', () => {
            mealDisplay.innerHTML = '<div class="meal-placeholder"><span class="icon">🍱</span><p>어디 보자...</p></div>';
            
            setTimeout(() => {
                const meal = MEALS[Math.floor(Math.random() * MEALS.length)];
                mealDisplay.innerHTML = `
                    <div class="meal-result">
                        <div class="meal-image-container">
                            <img src="${meal.image}" alt="${meal.name}">
                        </div>
                        <div class="meal-info">
                            <h3 class="meal-name">${meal.name}</h3>
                        </div>
                    </div>
                `;
            }, 600);
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
