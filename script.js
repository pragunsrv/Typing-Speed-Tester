let startTime;
const testText = "The quick brown fox jumps over the lazy dog.";
const resultDiv = document.getElementById('result');
const inputText = document.getElementById('inputText');
const timerDiv = document.getElementById('timer');
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
}

function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000;
    timerDiv.innerText = `${elapsedTime.toFixed(1)} seconds`;
}

function checkTyping() {
    const typedText = inputText.value;
    if (typedText === testText) {
        const endTime = new Date().getTime();
        const timeTaken = (endTime - startTime) / 1000;
        resultDiv.innerText = `You took ${timeTaken.toFixed(1)} seconds.`;
        inputText.disabled = true;
        clearInterval(timerInterval);
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
