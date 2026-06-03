document.addEventListener('DOMContentLoaded', () => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
    document.head.appendChild(script);

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
    const celebrate = () => {
        if (!window.confetti) return;
        confetti({ particleCount: 130, spread: 80, startVelocity: 55, origin: { y: 0.6 } });
        confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
        confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
        setTimeout(() => {
            confetti({ particleCount: 50, spread: 100, startVelocity: 40, scalar: 1.2, origin: { y: 0.5 } });
        }, 200);
    };

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

    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            document.body.setAttribute('data-theme', theme);
        });
    }
});
