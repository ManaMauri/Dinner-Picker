let options = [];
let currentRotation = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the wheel with empty options
    initializeWheel(options);

    // File input change event
    const fileInput = document.getElementById('excelFileInput');
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            readExcelFile(file).then((newOptions) => {
                options = newOptions;
                initializeWheel(options);
            });
        }
    });

    // Load file button click event
    const loadFileButton = document.getElementById('loadFileButton');
    loadFileButton.addEventListener('click', () => {
        fileInput.click();
    });

    // Spin button click event
    const spinButton = document.getElementById('spinButton');
    spinButton.addEventListener('click', () => {
        spinWheel(options);
    });
});

async function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = e.target.result;
            const workbook = XLSX.read(data, {
                type: 'binary'
            });

            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];
            const newOptions = XLSX.utils.sheet_to_json(worksheet);

            resolve(newOptions.map(option => option.Name));
        };

        reader.onerror = function(ex) {
            reject(ex);
        };

        reader.readAsBinaryString(file);
    });
}

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
        ctx.fillStyle = (i % 2 === 0) ? '#ddd' : '#eee';
        ctx.fill();
        ctx.stroke();

        // Draw text
        const angle = startAngle + (anglePerSegment / 2);
        const x = canvasCenter + (radius * 0.5 * Math.cos(angle));
        const y = canvasCenter + (radius * 0.5 * Math.sin(angle));
        ctx.fillStyle = '#000';
        ctx.font = '18px Arial';
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
        alert(`You got: ${winningOption}`);
    }, { once: true });
}
