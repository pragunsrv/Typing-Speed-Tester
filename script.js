let startTime;
const testTexts = [
    "The quick brown fox jumps over the lazy dog.",
    "A journey of a thousand miles begins with a single step.",
    "To be or not to be, that is the question.",
    "All that glitters is not gold.",
    "A picture is worth a thousand words."
];
const resultDiv = document.getElementById('result');
const inputText = document.getElementById('inputText');
const timerDiv = document.getElementById('timer');
const testTextDiv = document.getElementById('testText');
const historyList = document.getElementById('historyList');
let timerInterval;

function startTest() {
    inputText.value = "";
    inputText.disabled = false;
    inputText.focus();
    startTime = new Date().getTime();
    resultDiv.innerText = "";
    inputText.classList.remove('error');
    timerDiv.innerText = "0.0 seconds";
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 100);
    setTestText();
}

function setTestText() {
    const randomIndex = Math.floor(Math.random() * testTexts.length);
    testTextDiv.innerText = testTexts[randomIndex];
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
        resultDiv.innerText = `You took ${timeTaken.toFixed(1)} seconds. WPM: ${wpm.toFixed(1)}.`;
        inputText.disabled = true;
        clearInterval(timerInterval);
        addToHistory(testText, timeTaken, wpm);
    } else if (testText.startsWith(typedText)) {
        inputText.classList.remove('error');
    } else {
        inputText.classList.add('error');
    }
}

function resetTest() {
    inputText.value = "";
    inputText.disabled = true;
    resultDiv.innerText = "";
    inputText.classList.remove('error');
    timerDiv.innerText = "";
    clearInterval(timerInterval);
}

function addToHistory(text, time, wpm) {
    const li = document.createElement('li');
    li.innerText = `Text: "${text}" - Time: ${time.toFixed(1)} seconds - WPM: ${wpm.toFixed(1)}`;
    historyList.appendChild(li);
}
