let startTime;
let timerInterval;
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold."
];
const testTextDiv = document.getElementById('testText');
const inputText = document.getElementById('inputText');
const timerDiv = document.getElementById('timer');
const wpmDiv = document.getElementById('wpm');
const accuracyDiv = document.getElementById('accuracy');
const historyList = document.getElementById('historyList');
const bestScoresDiv = document.getElementById('bestScores');
const averageStatsDiv = document.getElementById('averageStats');
let errorCount = 0;
let bestSpeed = Infinity;
let bestAccuracy = 0;
let totalTypingSpeed = 0;
let totalAccuracy = 0;
let testCount = 0;

function startTest() {
    inputText.value = "";
    inputText.disabled = false;
    inputText.focus();
    startTime = new Date().getTime();
    timerDiv.innerText = "0.0 seconds";
    wpmDiv.innerText = "WPM: 0";
    accuracyDiv.innerText = "Accuracy: 100%";
    errorCount = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 100);
    setTestText();
    highlightText();
}

function setTestText() {
    const randomIndex = Math.floor(Math.random() * sampleTexts.length);
    testTextDiv.innerText = sampleTexts[randomIndex];
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000;
    timerDiv.innerText = `${elapsedTime.toFixed(1)} seconds`;
}

function checkTyping() {
    const typedText = inputText.value;
    const testText = testTextDiv.innerText;
    if (typedText === testText) {
        endTest();
        return;
    }

    errorCount = 0;
    let correctChars = 0;

    for (let i = 0; i < testText.length; i++) {
        if (typedText[i] === testText[i]) {
            correctChars++;
        } else if (typedText[i] !== undefined) {
            errorCount++;
        }
    }

    const accuracy = ((correctChars - errorCount) / testText.length) * 100;
    const wpm = calculateWPM();

    accuracyDiv.innerText = `Accuracy: ${accuracy.toFixed(1)}%`;
    wpmDiv.innerText = `WPM: ${wpm.toFixed(1)}`;

    highlightText();
}

function calculateWPM() {
    const typedText = inputText.value;
    const wordsTyped = typedText.split(" ").length;
    const elapsedTime = (new Date().getTime() - startTime) / 1000;
    return (wordsTyped / elapsedTime) * 60;
}

function calculateAccuracy() {
    const typedText = inputText.value;
    const testText = testTextDiv.innerText;
    let correctChars = 0;
    let errorCount = 0;

    for (let i = 0; i < testText.length; i++) {
        if (typedText[i] === testText[i]) {
            correctChars++;
        } else if (typedText[i] !== undefined) {
            errorCount++;
        }
    }

    return ((correctChars - errorCount) / testText.length) * 100;
}

function calculateTime() {
    return (new Date().getTime() - startTime) / 1000;
}

function highlightText() {
    const typedText = inputText.value;
    const testText = testTextDiv.innerText;
    const highlightedText = testText.split('').map((char, index) => {
        if (typedText[index] === char) {
            return `<span class="correct">${char}</span>`;
        } else if (typedText[index] !== undefined) {
            return `<span class="incorrect">${char}</span>`;
        }
        return char;
    }).join('');

    testTextDiv.innerHTML = highlightedText;
}

function addToHistory(text, time, wpm, accuracy) {
    const li = document.createElement('li');
    li.innerHTML = `Text: "${text}" - Time: ${time.toFixed(1)} seconds - WPM: ${wpm.toFixed(1)} - Accuracy: ${accuracy.toFixed(1)}%`;
    historyList.appendChild(li);
    updateBestScores(time, accuracy);
    updateAverageStats(time, accuracy);
}

function updateBestScores(timeTaken, accuracy) {
    if (timeTaken < bestSpeed) {
        bestSpeed = timeTaken;
    }
    if (accuracy > bestAccuracy) {
        bestAccuracy = accuracy;
    }
    bestScoresDiv.innerHTML = `
        <p>Best Speed: ${bestSpeed.toFixed(1)} seconds</p>
        <p>Best Accuracy: ${bestAccuracy.toFixed(1)}%</p>
    `;
}

function updateAverageStats(timeTaken, accuracy) {
    totalTypingSpeed += timeTaken;
    totalAccuracy += accuracy;
    testCount++;
    const averageSpeed = totalTypingSpeed / testCount;
    const averageAccuracy = totalAccuracy / testCount;
    averageStatsDiv.innerHTML = `
        <p>Average Speed: ${averageSpeed.toFixed(1)} seconds</p>
        <p>Average Accuracy: ${averageAccuracy.toFixed(1)}%</p>
    `;
}

function endTest() {
    clearInterval(timerInterval);
    inputText.disabled = true;
    const timeTaken = calculateTime();
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    wpmDiv.innerText = `WPM: ${wpm.toFixed(1)}`;
    accuracyDiv.innerText = `Accuracy: ${accuracy.toFixed(1)}%`;
    addToHistory(testTextDiv.innerText, timeTaken, wpm, accuracy);
}

function resetTest() {
    inputText.value = "";
    inputText.disabled = true;
    timerDiv.innerText = "0.0 seconds";
    wpmDiv.innerText = "WPM: 0";
    accuracyDiv.innerText = "Accuracy: 100%";
    clearInterval(timerInterval);
    errorCount = 0;
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
