document.addEventListener('DOMContentLoaded', () => {
    /* =========================================================
     * 최근 10회차 로또 6/45 당첨번호 (실제 데이터)
     * 출처: 동행복권 공식 결과 (superkts / lottohell 교차검증)
     * 데이터 기준일: 2026-05-30 (제1226회)
     * ※ 최신 데이터로 갱신하려면 아래 배열 맨 앞에 새 회차를 추가하세요.
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

    /* ---- 출현 빈도 계산 (보너스 제외, 본 당첨번호 6개 기준) ---- */
    const freq = {};
    for (let n = 1; n <= 45; n++) freq[n] = 0;
    DRAWS.forEach(d => d.numbers.forEach(n => { freq[n]++; }));
    const maxFreq = Math.max(...Object.values(freq));

    /* ===================== 테마 토글 ===================== */
    const body = document.body;
    const themeBtn = document.getElementById('theme-btn');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    /* ===================== 공통: 볼 색상 ===================== */
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

    /* ===================== 모드 선택 ===================== */
    let currentMode = 'hot';
    const MODE_DESC = {
        hot: '🔥 핫넘버: 최근 10회차에서 자주 나온 번호에 더 높은 가중치를 두고 6개를 추첨합니다.',
        cold: '❄️ 콜드넘버: 최근 10회차에서 적게 나온(또는 안 나온) 번호에 더 높은 가중치를 두고 6개를 추첨합니다.',
        random: '🎲 완전 랜덤: 과거 데이터와 무관하게 1~45 중 6개를 순수 무작위로 추첨합니다.'
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
    modeDescEl.textContent = MODE_DESC[currentMode];

    /* ---- 가중치 기반 비복원 추첨 ---- */
    function weightedPick(weights) {
        // weights: {number: weight}, weight 0 인 번호는 선택되지 않음
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
        // 핫/콜드 풀이 6개 미만일 경우 나머지는 랜덤으로 채움(안전장치)
        while (picked.size < 6) {
            picked.add(Math.floor(Math.random() * 45) + 1);
        }
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
            if (mode === 'hot') {
                // 자주 나온 번호 위주: 빈도를 제곱해 강조, 0회는 제외
                weights[n] = Math.pow(freq[n], 2);
            } else { // cold
                // 적게 나온 번호 위주: 빈도가 낮을수록 큰 가중치, 0회가 최대
                weights[n] = Math.pow(maxFreq - freq[n] + 1, 2);
            }
        }
        return weightedPick(weights);
    }

    /* ===================== 번호 생성 버튼 ===================== */
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers-container');

    generateBtn.addEventListener('click', () => {
        numbersContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const set = generateSet(currentMode);
                const row = document.createElement('div');
                row.classList.add('number-set');
                set.forEach((num, idx) => row.appendChild(makeBall(num, idx)));
                numbersContainer.appendChild(row);
            }, i * 200);
        }
    });

    /* ===================== 최근 당첨번호 렌더 ===================== */
    const recentGrid = document.getElementById('recent-draws');
    if (recentGrid) {
        DRAWS.forEach(d => {
            const item = document.createElement('div');
            item.classList.add('draw-item');

            const head = document.createElement('div');
            head.classList.add('draw-head');
            head.innerHTML = `<span class="draw-round">제${d.round}회</span><span class="draw-date">${d.date}</span>`;
            item.appendChild(head);

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

    /* ===================== 출현 통계 차트 ===================== */
    const chart = document.getElementById('freq-chart');
    if (chart) {
        for (let n = 1; n <= 45; n++) {
            const bar = document.createElement('div');
            bar.classList.add('freq-bar');
            const heightPct = maxFreq ? (freq[n] / maxFreq) * 100 : 0;
            bar.innerHTML = `
                <div class="freq-count">${freq[n]}</div>
                <div class="freq-fill-wrap">
                    <div class="freq-fill ${ballClass(n)}" style="height:${heightPct}%"></div>
                </div>
                <div class="freq-label">${n}</div>`;
            chart.appendChild(bar);
        }
    }

    /* ---- 핫/콜드 TOP 6 ---- */
    const sortedByFreq = Array.from({ length: 45 }, (_, i) => i + 1)
        .sort((a, b) => freq[b] - freq[a] || a - b);
    const topHot = sortedByFreq.slice(0, 6).sort((a, b) => a - b);
    const topCold = sortedByFreq.slice(-6).sort((a, b) => a - b);

    const hotEl = document.getElementById('top-hot');
    const coldEl = document.getElementById('top-cold');
    if (hotEl) topHot.forEach(n => hotEl.appendChild(makeBall(n)));
    if (coldEl) topCold.forEach(n => coldEl.appendChild(makeBall(n)));

    /* ---- 데이터 기준일 표시 ---- */
    const dataDateEl = document.getElementById('data-date');
    if (dataDateEl && DRAWS.length) {
        dataDateEl.textContent = `${DRAWS[0].date} (제${DRAWS[0].round}회)`;
    }
});
