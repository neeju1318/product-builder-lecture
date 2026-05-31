document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers-container');
    const themeBtn = document.getElementById('theme-btn');
    const body = document.body;

    // Theme logic
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    generateBtn.addEventListener('click', () => {
        numbersContainer.innerHTML = ''; 
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const numberSet = generateNumberSet();
                const numberSetDiv = document.createElement('div');
                numberSetDiv.classList.add('number-set');

                numberSet.forEach((number, index) => {
                    const span = document.createElement('span');
                    span.textContent = number;
                    
                    // Add color class based on number range
                    if (number <= 10) span.classList.add('ball-1-10');
                    else if (number <= 20) span.classList.add('ball-11-20');
                    else if (number <= 30) span.classList.add('ball-21-30');
                    else if (number <= 40) span.classList.add('ball-31-40');
                    else span.classList.add('ball-41-45');

                    span.style.animationDelay = `${index * 0.1}s`;
                    numberSetDiv.appendChild(span);
                });

                numbersContainer.appendChild(numberSetDiv);
            }, i * 200);
        }
    });

    function generateNumberSet() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }
});
