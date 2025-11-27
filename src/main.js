import { SignatureGenerator } from './signatureGenerator.js';

// Initialize the application
const app = new SignatureGenerator();

// DOM Elements
const passwordInput = document.getElementById('password');
const nextBtn = document.getElementById('nextBtn');
const backBtn = document.getElementById('backBtn');
const metamaskBtn = document.getElementById('metamaskBtn');
const walletconnectBtn = document.getElementById('walletconnectBtn');
const coinbaseBtn = document.getElementById('coinbaseBtn');
const copyBtn = document.getElementById('copyBtn');
const copyAccountBtn = document.getElementById('copyAccountBtn');
const resetBtn = document.getElementById('resetBtn');
const errorCloseBtn = document.getElementById('errorCloseBtn');

// Step elements
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

// Event Listeners
passwordInput.addEventListener('input', () => {
    nextBtn.disabled = !passwordInput.value.trim();
});

nextBtn.addEventListener('click', () => {
    const password = passwordInput.value.trim();
    if (password) {
        app.setPassword(password);
        showStep(2);
    }
});

backBtn.addEventListener('click', () => {
    showStep(1);
});

metamaskBtn.addEventListener('click', async () => {
    await app.connectAndSign('metamask');
});

walletconnectBtn.addEventListener('click', async () => {
    await app.connectAndSign('walletconnect');
});

coinbaseBtn.addEventListener('click', async () => {
    await app.connectAndSign('coinbase');
});

copyBtn.addEventListener('click', () => {
    const signature = document.getElementById('signatureDisplay').textContent;
    navigator.clipboard.writeText(signature).then(() => {
        showNotification('Signature copied to clipboard!');
    }).catch(() => {
        showError('Failed to copy signature');
    });
});

copyAccountBtn.addEventListener('click', () => {
    const account = document.getElementById('accountDisplay').textContent;
    navigator.clipboard.writeText(account).then(() => {
        showNotification('Account address copied to clipboard!');
    }).catch(() => {
        showError('Failed to copy account address');
    });
});

resetBtn.addEventListener('click', () => {
    passwordInput.value = '';
    nextBtn.disabled = true;
    app.reset();
    showStep(1);
});

errorCloseBtn.addEventListener('click', () => {
    hideError();
});

// Helper Functions
function showStep(stepNumber) {
    step1.classList.toggle('hidden', stepNumber !== 1);
    step2.classList.toggle('hidden', stepNumber !== 2);
    step3.classList.toggle('hidden', stepNumber !== 3);
}

function showError(message) {
    const errorBox = document.getElementById('errorBox');
    const errorText = document.getElementById('errorText');
    errorText.textContent = message;
    errorBox.classList.remove('hidden');
}

function hideError() {
    document.getElementById('errorBox').classList.add('hidden');
}

function showNotification(message) {
    const statusBox = document.getElementById('connectionStatus');
    const statusText = document.getElementById('statusText');
    statusText.textContent = message;
    statusBox.classList.remove('hidden');
    setTimeout(() => {
        statusBox.classList.add('hidden');
    }, 3000);
}

// Expose functions to app
window.showStep = showStep;
window.showError = showError;
window.hideError = hideError;
window.showNotification = showNotification;

// Display signature result
window.displaySignatureResult = (account, signature) => {
    document.getElementById('accountDisplay').textContent = account;
    document.getElementById('signatureDisplay').textContent = signature;
    showStep(3);
};

// Show connection status
window.showConnectionStatus = (message) => {
    showNotification(message);
};
