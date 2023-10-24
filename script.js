let options = [];
let currentRotation = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Show loading message
    document.getElementById('loading').style.display = 'block';

    // Fetch options from Google Spreadsheet
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRvIjlDiuwZaZV8yrbj4fR2YIypZNzGkaxQ_mUX580Pxi3zCcmy0kV7ID15fokd4KahyJIYwXa4qF_8/pub?gid=0&single=true&output=csv")
    .then(response => response.text())
    .then(data => {
        options = data.split("\n").slice(1);  // Skip header
        initializeWheel(options);

        // Hide loading message and enable the spin button
        document.getElementById('loading').style.display = 'none';
        document.getElementById('spinButton').disabled = false;
    });

    // Spin button click event
    const spinButton = document.getElementById('spinButton');
    spinButton.addEventListener('click', () => {
        spinWheel(options);
    });
});

function initializeWheel(options) {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');

    // Scale up the canvas dimensions for mobile phones
    const isMobile = window.innerWidth <= 800;
    const scaleFactor = isMobile ? 2 : 1;
    canvas.width = 400 * scaleFactor;
    canvas.height = 400 * scaleFactor;

    const canvasCenter = canvas.width / 2;
    let radius = canvasCenter - 10;

    // Calculate the maximum text length
    ctx.font = `${18 * scaleFactor}px Open Sans`;
    const maxTextLength = Math.max(...options.map(option => ctx.measureText(option).width));

    // Adjust the radius based on the maximum text length
    radius -= (maxTextLength / 2 + 10);  // 10 is the margin

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
        const middleAngle = startAngle + (anglePerSegment / 2);

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(canvasCenter, canvasCenter);
        ctx.arc(canvasCenter, canvasCenter, radius, startAngle, endAngle);
        ctx.lineTo(canvasCenter, canvasCenter);
        ctx.fillStyle = (i % 2 === 0) ? '#FFC0CB' : '#FF69B4';  // Shades of pink
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(canvasCenter, canvasCenter);
        ctx.rotate(middleAngle);
        ctx.fillStyle = '#000';
        ctx.font = `${18 * scaleFactor}px Open Sans`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(options[i], (radius / 2) + 10, 0);  // Add margin to the text
        ctx.restore();
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

        // Update the result area
        document.getElementById('result-text').innerText = winningOption;
        document.getElementById('result').classList.remove('hidden');
    }, { once: true });
}