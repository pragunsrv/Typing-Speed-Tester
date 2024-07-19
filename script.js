let startTime;
let timerInterval;
const sampleTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold."
];
const additionalTexts = [
    "Sample text for typing practice.",
    "Another text source to try typing.",
    "Yet another text source for speed testing."
];
const testTextDiv = document.getElementById('testText');
const inputText = document.getElementById('inputText');
const timerDiv = document.getElementById('timer');
const wpmDiv = document.getElementById('wpm');
const accuracyDiv = document.getElementById('accuracy');
const charCountDiv = document.getElementById('charCount');
const historyList = document.getElementById('historyList');
const bestScoresDiv = document.getElementById('bestScores');
const averageStatsDiv = document.getElementById('averageStats');
const leaderboardList = document.getElementById('leaderboardList');
const textSourceSelect = document.getElementById('textSource');
const difficultyLevelSelect = document.getElementById('difficultyLevel');
const customTextInput = document.getElementById('customText');
const progressBar = document.getElementById('progressBar');
const themeSelector = document.getElementById('themeSelector');
let errorCount = 0;
let bestSpeed = Infinity;
let bestAccuracy = 0;
let totalTypingSpeed = 0;
let totalAccuracy = 0;
let testCount = 0;
let currentText;
let currentDifficulty;
let leaderboard = [];

function startTest() {
    inputText.value = "";
    inputText.disabled = false;
    inputText.focus();
    startTime = new Date().getTime();
    timerDiv.innerText = "0.0 seconds";
    wpmDiv.innerText = "WPM: 0";
    accuracyDiv.innerText = "Accuracy: 100%";
    charCountDiv.innerText = "Characters Typed: 0";
    progressBar.style.width = '0%';
    errorCount = 0;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 100);
    setTestText();
    highlightText();
}

function setTestText() {
    const randomIndex = parseInt(textSourceSelect.value);
    currentText = randomIndex < 2 ? sampleTexts[randomIndex] : additionalTexts[randomIndex - 2];
    testTextDiv.innerText = currentText;
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000;
    timerDiv.innerText = `${elapsedTime.toFixed(1)} seconds`;
    updateProgressBar();
}

function updateProgressBar() {
    const typedText = inputText.value;
    const totalLength = currentText.length;
    const typedLength = typedText.length;
    const progress = Math.min((typedLength / totalLength) * 100, 100);
    progressBar.style.width = `${progress}%`;
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
    const charsTyped = typedText.length;

    accuracyDiv.innerText = `Accuracy: ${accuracy.toFixed(1)}%`;
    wpmDiv.innerText = `WPM: ${wpm.toFixed(1)}`;
    charCountDiv.innerText = `Characters Typed: ${charsTyped}`;

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
    updateLeaderboard(wpm, accuracy);
}

function updateBestScores(timeTaken, accuracy) {
    if (timeTaken < bestSpeed) bestSpeed = timeTaken;
    if (accuracy > bestAccuracy) bestAccuracy = accuracy;

    bestScoresDiv.innerHTML = `
        <p>Best Speed: ${bestSpeed.toFixed(1)} seconds</p>
        <p>Best Accuracy: ${bestAccuracy.toFixed(1)}%</p>
    `;
}

function updateAverageStats(timeTaken, accuracy) {
    testCount++;
    totalTypingSpeed += timeTaken;
    totalAccuracy += accuracy;

    const avgSpeed = totalTypingSpeed / testCount;
    const avgAccuracy = totalAccuracy / testCount;

    averageStatsDiv.innerHTML = `
        <p>Average Speed: ${avgSpeed.toFixed(1)} seconds</p>
        <p>Average Accuracy: ${avgAccuracy.toFixed(1)}%</p>
    `;
}

function updateLeaderboard(wpm, accuracy) {
    leaderboard.push({ wpm, accuracy });
    leaderboard.sort((a, b) => b.wpm - a.wpm || b.accuracy - a.accuracy);
    leaderboard = leaderboard.slice(0, 5);

    leaderboardList.innerHTML = leaderboard.map((entry, index) => 
        `<li>Rank ${index + 1}: WPM: ${entry.wpm.toFixed(1)}, Accuracy: ${entry.accuracy.toFixed(1)}%</li>`
    ).join('');
}

function endTest() {
    clearInterval(timerInterval);
    inputText.disabled = true;
    const elapsedTime = calculateTime();
    const wpm = calculateWPM();
    const accuracy = calculateAccuracy();
    addToHistory(testTextDiv.innerText, elapsedTime, wpm, accuracy);
}

function resetTest() {
    clearInterval(timerInterval);
    timerDiv.innerText = "0.0 seconds";
    wpmDiv.innerText = "WPM: 0";
    accuracyDiv.innerText = "Accuracy: 100%";
    charCountDiv.innerText = "Characters Typed: 0";
    progressBar.style.width = '0%';
    inputText.value = "";
    inputText.disabled = true;
    errorCount = 0;
    historyList.innerHTML = "";
    bestScoresDiv.innerHTML = "";
    averageStatsDiv.innerHTML = "";
    leaderboardList.innerHTML = "";
}

function addCustomText() {
    const customText = customTextInput.value.trim();
    if (customText) {
        additionalTexts.push(customText);
        textSourceSelect.innerHTML += `<option value="${additionalTexts.length + 1}">${customText.substring(0, 20)}...</option>`;
        customTextInput.value = "";
    }
}

function changeTextSource() {
    setTestText();
    highlightText();
}

function changeDifficultyLevel() {
    currentDifficulty = difficultyLevelSelect.value;
    // Modify text based on difficulty level if needed
}

function changeTheme() {
    document.body.classList.toggle('dark-mode', themeSelector.value === 'dark');
}

function exportToCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Text,Time,WPM,Accuracy\n";
    
    Array.from(historyList.getElementsByTagName('li')).forEach(li => {
        csvContent += li.innerText.replace(/ - /g, ',').replace(/Text: /, '').replace(/ /g, ',').replace(/seconds/, 'seconds').replace(/WPM: /, '').replace(/Accuracy: /, '') + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'typing_test_history.csv');
    document.body.appendChild(link);
    link.click();
}
