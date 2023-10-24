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
    });
    
    function initializeWheel(options) {
        // ... (existing code for initializing the wheel)
        // Please refer to the previous code snippets for this part.
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
    