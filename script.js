let options = [];
let currentRotation = 0;

document.addEventListener('DOMContentLoaded', () => {
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRvIjlDiuwZaZV8yrbj4fR2YIypZNzGkaxQ_mUX580Pxi3zCcmy0kV7ID15fokd4KahyJIYwXa4qF_8/pub?gid=0&single=true&output=csv")
    .then(response => response.text())
    .then(data => {
        options = data.split("\n").slice(1);  // Skip header
        initializeWheel(options);
        document.getElementById('spinButton').disabled = false;
    });

    const spinButton = document.getElementById('spinButton');
    spinButton.addEventListener('click', () => {
        spinWheel(options);
    });
});

function initializeWheel(options) {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 400;
    canvas.height = 400;
    const canvasCenter = canvas.width / 2;
    const radius = canvasCenter - 10;

    const colors = ['#FFC0CB', '#FF69B4'];
    const numSegments = options.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    for (let i = 0; i < numSegments; i++) {
        const startAngle = i * anglePerSegment;
        const endAngle = (i + 1) * anglePerSegment;

        ctx.beginPath();
        ctx.moveTo(canvasCenter, canvasCenter);
        ctx.arc(canvasCenter, canvasCenter, radius, startAngle, endAngle);
        ctx.lineTo(canvasCenter, canvasCenter);
        ctx.fillStyle = colors[i % 2];
        ctx.fill();
        ctx.stroke();
    }
}

function spinWheel(options) {
    const numSegments = options.length;
    const anglePerSegment = 360 / numSegments;

    const randomSpin = Math.floor(Math.random() * (1440 - 720) + 720);
    currentRotation += randomSpin;
    const finalRotation = currentRotation % 360;

    const canvas = document.getElementById('wheelCanvas');
    canvas.style.transition = 'transform 4s ease-out';
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    canvas.addEventListener('transitionend', () => {
        canvas.style.transition = 'none';
        canvas.style.transform = `rotate(${finalRotation}deg)`;

        const winningSegment = Math.floor(finalRotation / anglePerSegment);
        const winningOption = options[numSegments - winningSegment - 1];

        document.getElementById('result-text').innerText = winningOption;
        document.getElementById('result').classList.remove('hidden');
    }, { once: true });
}
