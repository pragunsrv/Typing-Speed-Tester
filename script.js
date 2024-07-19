let startTime;
const testTexts = {
    easy: [
        "The quick brown fox jumps over the lazy dog.",
        "A journey of a thousand miles begins with a single step."
    ],
    medium: [
        "To be or not to be, that is the question.",
        "All that glitters is not gold."
    ],
    hard: [
        "A picture is worth a thousand words.",
        "A rolling stone gathers no moss."
    ]
};
const resultDiv = document.getElementById('result');
const inputText = document.getElementById('inputText');
const timerDiv = document.getElementById('timer');
const testTextDiv = document.getElementById('testText');
const historyList = document.getElementById('historyList');
const errorCountDiv = document.getElementById('errorCount');
const accuracyDiv = document.getElementById('accuracy');
const speedBar = document.getElementById('speedBar');
const accuracyBar = document.getElementById('accuracyBar');
const bestScoresDiv = document.getElementById('bestScores');
const averageStatsDiv = document.getElementById('averageStats');
const userNameInput = document.getElementById('userName');
const difficultySelect = document.getElementById('difficulty');
let timerInterval;
let errorCount = 0;
let bestSpeed = Infinity;
let bestAccuracy = 0;
let totalTypingSpeed = 0;
let totalAccuracy = 0;
let testCount = 0;
let currentDifficulty = 'easy';

function startTest() {
    inputText.value = "";
    inputText.disabled = false;
    inputText.focus();
    startTime = new Date().getTime();
    resultDiv.innerText = "";
    inputText.classList.remove('error');
    timerDiv.innerText = "0.0 seconds";
    errorCountDiv.innerText = "";
    accuracyDiv.innerText = "";
    speedBar.style.width = '0%';
    accuracyBar.style.width = '0%';
    errorCount = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 100);
    setTestText();
    highlightText();
}

function updateDifficulty() {
    currentDifficulty = difficultySelect.value;
    setTestText();
}

function setTestText() {
    const texts = testTexts[currentDifficulty];
    const randomIndex = Math.floor(Math.random() * texts.length);
    testTextDiv.innerText = texts[randomIndex];
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
        const endTime = new Date().getTime();
        const timeTaken = (endTime - startTime) / 1000;
        const wordsTyped = testText.split(" ").length;
        const wpm = (wordsTyped / timeTaken) * 60;
        const accuracy = ((testText.length - errorCount) / testText.length) * 100;
        resultDiv.innerText = `You took ${timeTaken.toFixed(1)} seconds. WPM: ${wpm.toFixed(1)}. Accuracy: ${accuracy.toFixed(1)}%.`;
        updateBestScores(timeTaken, accuracy);
        updateAverageStats(timeTaken, accuracy);
        inputText.disabled = true;
        clearInterval(timerInterval);
        addToHistory(testText, timeTaken, wpm, accuracy);
    } else {
        inputText.classList.add('error');
        errorCount++;
        errorCountDiv.innerText = `Errors: ${errorCount}`;
        const accuracy = ((typedText.length - errorCount) / testText.length) * 100;
        accuracyDiv.innerText = `Accuracy: ${accuracy.toFixed(1)}%`;
        accuracyBar.style.width = `${accuracy.toFixed(1)}%`;
        highlightText();
    }
    const elapsedTime = (new Date().getTime() - startTime) / 1000;
    const speed = (typedText.length / elapsedTime) * 60;
    speedBar.style.width = `${Math.min(speed, 100)}%`;
}

function highlightText() {
    const testText = testTextDiv.innerText;
    const typedText = inputText.value;
    let highlightedText = '';
    for (let i = 0; i < testText.length; i++) {
        if (typedText[i] === testText[i]) {
            highlightedText += `<span class="correct">${testText[i]}</span>`;
        } else if (typedText[i] !== undefined) {
            highlightedText += `<span class="incorrect">${testText[i]}</span>`;
        } else {
            highlightedText += `<span>${testText[i]}</span>`;
        }
    }
    testTextDiv.innerHTML = highlightedText;
}

function resetTest() {
    inputText.value = "";
    inputText.disabled = true;
    resultDiv.innerText = "";
    inputText.classList.remove('error');
    timerDiv.innerText = "";
    errorCountDiv.innerText = "";
    accuracyDiv.innerText = "";
    speedBar.style.width = '0%';
    accuracyBar.style.width = '0%';
    clearInterval(timerInterval);
}

function addToHistory(text, time, wpm, accuracy) {
    const li = document.createElement('li');
    li.innerText = `Text: "${text}" - Time: ${time.toFixed(1)} seconds - WPM: ${wpm.toFixed(1)} - Accuracy: ${accuracy.toFixed(1)}%`;
    historyList.appendChild(li);
}

function clearHistory() {
    historyList.innerHTML = "";
}

function saveProfile() {
    const userName = userNameInput.value.trim();
    if (userName) {
        localStorage.setItem('userName', userName);
        alert('Profile saved!');
    } else {
        alert('Please enter a name.');
    }
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
