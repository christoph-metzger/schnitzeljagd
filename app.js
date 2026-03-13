// App State
const appState = {
    currentQuestion: 0,
    answered: [],
    hintShown: false
};

// DOM Elements
const passwordScreen = document.getElementById('passwordScreen');
const introScreen = document.getElementById('introScreen');
const questionScreen = document.getElementById('questionScreen');
const successScreen = document.getElementById('successScreen');
const completionScreen = document.getElementById('completionScreen');

const passwordInput = document.getElementById('passwordInput');
const passwordBtn = document.getElementById('passwordBtn');
const passwordError = document.getElementById('passwordError');

const startBtn = document.getElementById('startBtn');
const answerInput = document.getElementById('answerInput');
const submitBtn = document.getElementById('submitBtn');
const hintBtn = document.getElementById('hintBtn');
const hintText = document.getElementById('hintText');
const feedbackMessage = document.getElementById('feedbackMessage');
const nextBtn = document.getElementById('nextBtn');
const restartBtn = document.getElementById('restartBtn');

const questionText = document.getElementById('questionText');
const questionNum = document.getElementById('questionNum');
const progressNumber = document.getElementById('progressNumber');
const totalQuestions = document.getElementById('totalQuestions');
const progressFill = document.getElementById('progressFill');
const successMessage = document.getElementById('successMessage');
const locationHint = document.getElementById('locationHint');

const audioSection = document.getElementById('audioSection');
const audioElement = document.getElementById('audioElement');
const audioPlayBtn = document.getElementById('audioPlayBtn');
const audioProgressBar = document.getElementById('audioProgressBar');
const audioProgressFill = document.getElementById('audioProgressFill');
const audioCurrentTime = document.getElementById('audioCurrentTime');
const audioDuration = document.getElementById('audioDuration');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    setupEventListeners();
    totalQuestions.textContent = QUESTIONS.length;

    // Check if already authenticated
    if (sessionStorage.getItem('authenticated')) {
        if (appState.currentQuestion === 0) {
            showScreen('intro');
        } else if (appState.currentQuestion < QUESTIONS.length) {
            showScreen('question');
            renderQuestion();
        } else {
            showScreen('completion');
        }
    } else {
        showScreen('password');
    }
});

// Event Listeners
function setupEventListeners() {
    passwordBtn.addEventListener('click', handlePasswordSubmit);
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handlePasswordSubmit();
    });

    startBtn.addEventListener('click', () => {
        showScreen('question');
        renderQuestion();
    });

    submitBtn.addEventListener('click', handleAnswerSubmit);
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAnswerSubmit();
    });

    hintBtn.addEventListener('click', handleHintRequest);
    nextBtn.addEventListener('click', handleNextQuestion);
    restartBtn.addEventListener('click', handleRestart);

    // Audio player controls
    audioPlayBtn.addEventListener('click', toggleAudio);

    audioElement.addEventListener('timeupdate', () => {
        if (audioElement.duration) {
            const pct = (audioElement.currentTime / audioElement.duration) * 100;
            audioProgressFill.style.width = pct + '%';
            audioCurrentTime.textContent = formatTime(audioElement.currentTime);
        }
    });

    audioElement.addEventListener('loadedmetadata', () => {
        audioDuration.textContent = formatTime(audioElement.duration);
    });

    audioElement.addEventListener('ended', () => {
        audioPlayBtn.textContent = '▶';
        audioProgressFill.style.width = '100%';
    });

    audioProgressBar.addEventListener('click', (e) => {
        if (!audioElement.duration) return;
        const rect = audioProgressBar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audioElement.currentTime = pct * audioElement.duration;
    });
}

function toggleAudio() {
    if (audioElement.paused) {
        audioElement.play();
        audioPlayBtn.textContent = '⏸';
    } else {
        audioElement.pause();
        audioPlayBtn.textContent = '▶';
    }
}

function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + String(s).padStart(2, '0');
}

// Password Handling
function handlePasswordSubmit() {
    const password = passwordInput.value.trim();

    if (password === PASSWORD) {
        sessionStorage.setItem('authenticated', 'true');
        passwordError.textContent = '';
        showScreen('intro');
    } else {
        passwordError.textContent = '❌ Falsches Passwort!';
        passwordInput.value = '';
        passwordInput.focus();
    }
}

// Screen Navigation
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    switch(screenName) {
        case 'password':
            passwordScreen.classList.add('active');
            passwordInput.focus();
            break;
        case 'intro':
            introScreen.classList.add('active');
            break;
        case 'question':
            questionScreen.classList.add('active');
            answerInput.focus();
            break;
        case 'success':
            successScreen.classList.add('active');
            break;
        case 'completion':
            completionScreen.classList.add('active');
            createConfetti();
            break;
    }
}

// Question Rendering
function renderQuestion() {
    const q = QUESTIONS[appState.currentQuestion];
    questionText.textContent = q.question;
    questionNum.textContent = appState.currentQuestion + 1;
    progressNumber.textContent = appState.currentQuestion + 1;

    updateProgressBar();

    answerInput.value = '';
    feedbackMessage.textContent = '';
    feedbackMessage.className = 'feedback-message';

    hintText.textContent = '';
    hintText.classList.add('hidden');
    hintBtn.textContent = '💡 Hinweis';
    appState.hintShown = false;

    // Audio question handling
    audioElement.pause();
    audioPlayBtn.textContent = '▶';
    audioProgressFill.style.width = '0%';
    audioCurrentTime.textContent = '0:00';
    audioDuration.textContent = '0:00';

    if (q.audio) {
        audioElement.src = q.audio;
        audioElement.load();
        audioSection.classList.remove('hidden');
    } else {
        audioSection.classList.add('hidden');
        audioElement.src = '';
    }
}

function updateProgressBar() {
    const percentage = ((appState.currentQuestion) / QUESTIONS.length) * 100;
    progressFill.style.width = percentage + '%';
}

// Answer Handling
function handleAnswerSubmit() {
    const answer = answerInput.value.trim().toLowerCase();

    if (!answer) {
        showFeedback('Bitte gib eine Antwort ein!', 'error');
        return;
    }

    const q = QUESTIONS[appState.currentQuestion];
    const isCorrect = q.answers.some(validAnswer => validAnswer.toLowerCase() === answer);

    if (isCorrect) {
        appState.answered.push(true);
        saveState();
        showFeedback('✅ Richtig!', 'success');

        setTimeout(() => {
            if (appState.currentQuestion === QUESTIONS.length - 1) {
                // Last question - show completion
                showScreen('completion');
                appState.currentQuestion = QUESTIONS.length;
                saveState();
            } else {
                // Show success screen with location hint
                successMessage.textContent = '🎯 Richtig gelöst!';
                locationHint.textContent = q.location;
                showScreen('success');
            }
        }, 500);
    } else {
        showFeedback('❌ Das ist nicht richtig. Versuche es nochmal!', 'error');
        answerInput.value = '';
    }
}

function showFeedback(message, type) {
    feedbackMessage.textContent = message;
    feedbackMessage.className = 'feedback-message ' + type;
}

// Hint Handling
function handleHintRequest() {
    if (!appState.hintShown) {
        const q = QUESTIONS[appState.currentQuestion];
        hintText.textContent = q.hint;
        hintText.classList.remove('hidden');
        hintText.classList.add('visible');
        hintBtn.textContent = '💡 Hinweis gesehen';
        appState.hintShown = true;
    }
}

// Navigation
function handleNextQuestion() {
    appState.currentQuestion++;
    appState.hintShown = false;
    saveState();

    if (appState.currentQuestion < QUESTIONS.length) {
        showScreen('question');
        renderQuestion();
    } else {
        showScreen('completion');
        createConfetti();
    }
}

function handleRestart() {
    appState.currentQuestion = 0;
    appState.answered = [];
    appState.hintShown = false;
    saveState();
    sessionStorage.removeItem('authenticated');
    showScreen('password');
    passwordInput.value = '';
    passwordInput.focus();
}

// State Management
function saveState() {
    localStorage.setItem('schnitzeljagd_state', JSON.stringify(appState));
}

function loadState() {
    const saved = localStorage.getItem('schnitzeljagd_state');
    if (saved) {
        const loadedState = JSON.parse(saved);
        appState.currentQuestion = loadedState.currentQuestion || 0;
        appState.answered = loadedState.answered || [];
        appState.hintShown = loadedState.hintShown || false;
    }
}

// Confetti Animation
function createConfetti() {
    const confettiContainer = document.getElementById('confetti');
    confettiContainer.innerHTML = '';

    const confettiPieces = 60;
    const colors = ['#2d5a27', '#4a7c59', '#7fb069', '#8B5E3C', '#D4A96A'];

    for (let i = 0; i < confettiPieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.textContent = ['🌿', '🎉', '✨', '🎊', '🏆'][Math.floor(Math.random() * 5)];
        piece.style.fontSize = Math.random() * 20 + 20 + 'px';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = '-20px';
        piece.style.opacity = Math.random() * 0.8 + 0.2;

        const duration = Math.random() * 2 + 2;
        const delay = Math.random() * 0.5;

        piece.animate([
            {
                transform: 'translateY(0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720 - 360}deg)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            delay: delay * 1000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        confettiContainer.appendChild(piece);
    }
}
