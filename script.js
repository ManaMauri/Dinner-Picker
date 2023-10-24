let options = [];
let currentRotation = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Optional: Show loading message if you have an element with id 'loading' in your HTML
    // document.getElementById('loading').style.display = 'block';

    // Fetch options from Google Spreadsheet
    fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vRvIjlDiuwZaZV8yrbj4fR2YIypZNzGkaxQ_mUX580Pxi3zCcmy0kV7ID15fokd4KahyJIYwXa4qF_8/pub?gid=0&single=true&output=csv")
    .then(response => response.text())
    .then(data => {
        options = data.split("\n").slice(1);  // Skip header
        initializeWheel(options);

        // Optional: Hide loading message and enable the spin button
        // document.getElementById('loading').style.display = 'none';
        document.getElementById('spinButton').disabled = false;
    })
    .catch(error => {
        console.error("Failed to fetch options: ", error);
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

    // Measure the longest text among options
    ctx.font = '18px Open Sans';
    const maxTextWidth = Math.max(...options.map(text => ctx.measureText(text).width));

    // Calculate canvas dimensions and circle radius based on the longest text
    const extraSpace = 20; // Additional space for text margin and stroke line
    const canvasSize = 2 * (maxTextWidth + extraSpace);
    const radius = canvasSize / 2 - extraSpace;

    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const canvasCenter = canvasSize / 2;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Define colors for segments
    const colors = ['#FF0000', '#00FF00'];  // Your choice of two colors

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
        ctx.fillStyle = colors[i % 2];  // Alternate between the two colors
        ctx.fill();
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(canvasCenter, canvasCenter);
        ctx.rotate(middleAngle);
        ctx.fillStyle = '#000';
        ctx.font = '18px Open Sans';
        ctx.textAlign = 'left';
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