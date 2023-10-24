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
    // Initialize the wheel with new options
    // (omitted for brevity, please refer to the previous code segment)
}

function spinWheel(options) {
    // Spin the wheel logic
    // (omitted for brevity, please refer to the previous code segment)
}
