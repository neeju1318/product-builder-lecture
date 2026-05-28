document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const numbersContainer = document.getElementById('numbers-container');

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
