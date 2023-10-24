let options = [];
let currentRotation = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Fetch options from Google Spreadsheet
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRvIjlDiuwZaZV8yrbj4fR2YIypZNzGkaxQ_mUX580Pxi3zCcmy0kV7ID15fokd4KahyJIYwXa4qF_8/pub?gid=0&single=true&output=csv")
    .then(response => response.text())
    .then(data => {
        options = data.split("\n").slice(1);  // Skip header
        initializeWheel(options);
    });

    // Spin button click event
    const spinButton = document.getElementById('spinButton');
    spinButton.addEventListener('click', () => {
        spinWheel(options);
    });

    // Close popup
    const popupClose = document.getElementById('popup-close');
    popupClose.addEventListener('click', () => {
        document.getElementById('popup').classList.add('hidden');
    });
});

function initializeWheel(options) {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const canvasCenter = canvas.width / 2;
    const radius = canvasCenter - 10;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw circle
    ctx.beginPath();
    ctx.arc(canvasCenter, canvasCenter, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw segments
    const numSegments = options.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;

    for (let i = 0; i < numSegments; i++) {
        const startAngle = i * anglePerSegment;
        const endAngle = (i + 1) * anglePerSegment;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(canvasCenter, canvasCenter);
        ctx.arc(canvasCenter, canvasCenter, radius, startAngle, endAngle);
        ctx.lineTo(canvasCenter, canvasCenter);
        ctx.fillStyle = (i % 2 === 0) ? '#FFC0CB' : '#FF69B4';  // Shades of pink
        ctx.fill();
        ctx.stroke();

        // Draw text
        const angle = startAngle + (anglePerSegment / 2);
        const x = canvasCenter + (radius * 0.5 * Math.cos(angle));
        const y = canvasCenter + (radius * 0.5 * Math.sin(angle));
        ctx.fillStyle = '#000';
        ctx.font = '18px Open Sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(options[i], x, y);
    }
}

function spinWheel(options) {
    const numSegments = options.length;
    const anglePerSegment = 360 / numSegments;

    // Generate a random spin angle
    const randomSpin = Math.floor(Math.random() * (1440 - 720) + 720);
    currentRotation += randomSpin;
    const finalRotation = currentRotation % 360;

    // Rotate the canvas element
    const canvas = document.getElementById('wheelCanvas');
    canvas.style.transition = 'transform 4s ease-out';
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // Calculate the winning option when the transition ends
    canvas.addEventListener('transitionend', () => {
        // Remove transition to set the wheel to its final state without animation
        canvas.style.transition = 'none';
        canvas.style.transform = `rotate(${finalRotation}deg)`;

        // Calculate the winning option
        const winningSegment = Math.floor(finalRotation / anglePerSegment);
        const winningOption = options[numSegments - winningSegment - 1];

        // Show custom popup
        document.getElementById('popup-message').innerText = `You got: ${winningOption}`;
        document.getElementById('popup').classList.remove('hidden');
    }, { once: true });
}
