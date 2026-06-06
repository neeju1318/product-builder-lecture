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
    // 오늘 뭐먹지 — 전체 메뉴 목록 (추가/수정은 이 배열만 손보면 됩니다)
    const MEALS = [
        "흰쌀밥", "흑미밥", "현미밥", "콩나물국밥",
        "굴국밥", "전주비빔밥", "돌솥비빔밥", "육회비빔밥",
        "꼬막비빔밥", "참치마요덮밥", "스팸마요덮밥", "치킨마요덮밥",
        "제육덮밥", "오징어덮밥", "낙지덮밥", "돼지국밥",
        "순대국밥", "섞어국밥", "내장국밥", "소머리국밥",
        "양평해장국", "뼈해장국", "선지해장국", "황태해장국",
        "우거지해장국", "일반 된장찌개", "차돌된장찌개", "해물된장찌개",
        "일반 김치찌개", "참치김치찌개", "꽁치김치찌개", "돼지고기김치찌개",
        "부대찌개", "일반 순두부찌개", "해물순두부찌개", "쫄면순두부찌개",
        "청국장", "동태탕", "알탕", "갈비탕",
        "물냉면", "비빔냉면", "회냉면", "코다리냉면",
        "평양냉면", "함흥냉면", "진주냉면", "칡냉면",
        "잔치국수", "비빔국수", "일반 칼국수", "바지락칼국수",
        "해물칼국수", "닭칼국수", "얼큰칼국수", "일반 수제비",
        "들깨수제비", "삼겹살구이", "목살구이", "항정살구이",
        "가브리살구이", "갈매기살구이", "양념돼지갈비", "소갈비구이",
        "LA갈비", "차돌박이구이", "한우등심구이", "한우안심구이",
        "소곱창구이", "소막창구이", "일반 짜장면", "간짜장",
        "쟁반짜장", "유니짜장", "삼선짜장", "사천짜장",
        "일반 짬뽕", "삼선짬뽕", "고기짬뽕 (차돌짬뽕)", "굴짬뽕",
        "백짬뽕 (기스면)", "볶음짬뽕", "짬짜면", "일반 볶음밥",
        "새우볶음밥", "게살볶음밥", "잡채밥", "마파두부밥",
        "유산슬밥", "잡탕밥", "고추잡채밥", "일반 탕수육",
        "사천탕수육", "찹쌀탕수육 (꿔바로우)", "소고기탕수육", "깐풍기",
        "유린기", "깐풍새우", "칠리새우", "크림새우",
        "등심돈까스 (로스카츠)", "안심돈까스 (히레카츠)", "치즈돈까스", "고구마치즈돈까스",
        "생선까스", "새우까스", "치킨까스", "멘치까스",
        "경양식돈까스", "매운돈까스", "철판돈까스", "돈까스나베",
        "김치돈까스나베", "규동 (소고기덮밥)", "가츠동 (돈까스덮밥)", "에비동 (새우튀김덮밥)",
        "사케동 (연어덮밥)", "텐동 (튀김덮밥)", "우나기동 (장어덮밥)", "오야꼬동 (닭고기계란덮밥)",
        "소유라멘 (간장베이스)", "미소라멘 (된장베이스)", "돈코츠라멘 (사골베이스)", "시오라멘 (소금베이스)",
        "마제소바", "탄탄멘", "냉모밀", "판모밀",
        "온모밀", "붓카케우동", "가케우동", "카레우동",
        "해물야끼우동", "광어초밥", "연어초밥", "구운연어초밥",
        "참다랑어초밥", "삶은새우초밥", "간장새우초밥", "생새우초밥",
        "토마토파스타 (뽀모도로)", "미트소스파스타 (볼로네제)", "해물토마토파스타", "베이컨크림파스타 (까르보나라)",
        "정통까르보나라 (노른자베이스)", "해물크림파스타", "봉골레파스타", "알리오올리오",
        "로제파스타", "투움바파스타", "바질페스토파스타", "오징어먹물파스타",
        "치즈오븐스파게티", "고르곤졸라피자", "마르게리따피자", "페퍼로니피자",
        "콤비네이션피자", "불고기피자", "포테이토피자", "고구마피자",
        "하와이안피자", "쉬림프피자", "치즈버거", "더블치즈버거",
        "불고기버거", "새우버거", "치킨버거", "싸이버거 (통다리살)",
        "베이컨토마토디럭스버거", "머쉬룸버거", "쌀떡볶이", "밀떡볶이",
        "치즈떡볶이", "로제떡볶이", "국물떡볶이", "짜장떡볶이",
        "까르보나라떡볶이", "라볶이", "일반 야채김밥", "참치김밥",
        "소고기김밥", "치즈김밥", "돈까스김밥", "땡초김밥",
        "꼬마김밥", "충무김밥", "찰순대", "병천순대",
        "백순대볶음", "모듬튀김", "오징어튀김", "고구마튀김",
        "김말이튀김", "후라이드치킨", "양념치킨", "간장치킨",
        "마늘치킨", "파닭", "오븐구이치킨", "닭강정",
        "흰죽", "야채죽", "소고기버섯죽", "전복죽",
        "참치야채죽", "단호박죽", "동지팥죽", "흑임자죽",
        "잣죽", "닭죽", "고기찐만두", "김치찐만두",
        "갈비만두", "새우만두", "물만두", "납작만두",
        "군만두", "떡국", "떡만두국", "조랭이떡국",
        "소갈비찜", "매운돼지갈비찜", "묵은지갈비찜", "아구찜",
        "해물찜", "코다리찜", "계란찜 (식사 대용)", "김치찜",
        "돼지고기김치찜", "고등어김치찜", "갈치조림", "고등어조림",
        "코다리조림", "두부조림", "감자조림", "간장찜닭",
        "매운찜닭", "로제찜닭", "닭볶음탕", "묵은지닭볶음탕",
        "뚝배기불고기", "제육쌈밥정식", "우렁쌈밥정식", "보쌈정식",
        "간장게장정식", "양념게장정식", "생선구이정식", "옥돔구이",
        "고등어구이", "이면수구이", "갈치구이", "삼치구이",
        "조기구이", "꽁치구이", "더덕구이", "황태구이",
        "족발", "불족발", "냉채족발", "마늘보쌈",
        "소고기 양지 쌀국수", "해물 쌀국수", "닭고기 쌀국수", "매운 쌀국수",
        "똠얌꿍 쌀국수", "팟타이", "팟씨유", "미고랭",
        "분짜", "반세오", "짜조", "나시고랭",
        "파인애플볶음밥", "푸팟퐁커리", "그린커리", "버터치킨마크니 커리",
        "치킨티카마살라 커리", "비프빈달루 커리", "시금치 커리 (팔락파니르)", "갈릭 버터 난",
        "소고기 타코", "닭고기 타코", "돼지고기 타코 (까르니따스)", "치킨 브리또",
        "비프 브리또", "치즈 퀘사디아", "치킨 퀘사디아", "비프 파히타",
        "과카몰리 나초 (식사 대용)", "엔칠라다", "크림 리조또", "토마토 리조또",
        "로제 리조또", "버섯 크림 리조또", "오징어먹물 리조또", "목살 필라프",
        "새우 필라프", "김치 필라프", "치킨 필라프", "마늘 필라프",
        "립아이 스테이크", "티본 스테이크", "안심 스테이크", "채끝 스테이크",
        "토마호크 스테이크", "오리지널 함박스테이크", "치즈 함박스테이크", "바베큐 폭립",
        "감바스 알 아히요", "수제 풀드포크 버거", "에그 베네딕트", "프렌치 토스트",
        "팬케이크", "아메리칸 와플", "잉글리시 블랙퍼스트", "맥앤치즈",
        "라자냐", "치즈 그라탕", "크림 뇨끼", "트러플 뇨끼",
        "닭가슴살 샐러드", "리코타치즈 샐러드", "연어 샐러드", "카프레제 샐러드",
        "시저 샐러드", "샐러드 파스타", "연어 포케", "참치 포케",
        "두부 버섯 포케", "닭가슴살 포케", "키토김밥 (계란지단 베이스)", "그릭요거트 그래놀라 볼",
        "아사이볼", "곤약면 비빔", "월남쌈", "클럽 샌드위치",
        "에그마요 샌드위치", "참치 샌드위치", "BLT 샌드위치", "크로와상 샌드위치",
        "캘리포니아 롤", "생연어 롤", "장어 롤", "새우튀김 롤",
        "스파이시 튜나 롤", "후토마끼", "소고기 타다끼 초밥", "계란말이 초밥",
        "기본 유부초밥", "참치마요 유부초밥", "밀푀유 나베", "스키야키",
        "모츠나베 (대창전골)", "간사이 오뎅탕", "메로구이", "시샤모구이",
        "타코야끼", "오꼬노미야끼", "야끼토리 덮밥", "치킨 가라아게 덮밥",
        "마라탕 (소고기 추가)", "마라탕 (양고기 추가)", "마라샹궈", "마라반",
        "홍탕 훠궈", "백탕 훠궈", "지삼선 (땅의 세 가지 신선한 재료 볶음)", "어향가지",
        "경장육사", "토마토계란볶음", "양꼬치", "동파육",
        "팔보채", "양장피", "유산슬 (요리)", "전가복",
        "난자완스", "멘보샤", "깐풍만두", "해물누룽지탕",
        "김치말이국수", "초계국수", "춘천막국수", "쟁반막국수",
        "비빔당면", "쫄면", "고기국수 (제주식)", "스팸 컵밥",
        "참치마요 컵밥", "제육 컵밥", "치즈스틱", "해쉬브라운",
        "야채튀김", "고추튀김", "쥐포튀김", "피카츄 돈까스",
        "떡꼬치", "소떡소떡", "회오리감자", "마약김밥 (광장시장식)"
    ];

    const MEAL_PAIRS = MEALS.map(name => ({ name }));

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
                const { name } = MEAL_PAIRS[Math.floor(Math.random() * MEAL_PAIRS.length)];
                mealDisplay.innerHTML = `
                    <div class="meal-result">
                        <span class="meal-cat-badge">🍽️ 오늘의 추천</span>
                        <h3 class="meal-highlight-name">${name}</h3>
                        <p class="meal-sub">🎉 이걸로 정했다! 🎉</p>
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
