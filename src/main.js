import { SignatureGenerator } from './signatureGenerator.js';
import { LanguageManager } from './i18n.js';

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the language manager
    const langManager = new LanguageManager();
    langManager.updateUI();

    // Initialize the application
    const app = new SignatureGenerator();

    // DOM Elements
    const passwordInput = document.getElementById('password');
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const metamaskBtn = document.getElementById('metamaskBtn');
    const copyBtn = document.getElementById('copyBtn');
    const copyAccountBtn = document.getElementById('copyAccountBtn');
    const resetBtn = document.getElementById('resetBtn');
    const errorCloseBtn = document.getElementById('errorCloseBtn');
    const languageSelector = document.getElementById('languageSelector');

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

    copyBtn.addEventListener('click', () => {
        const signature = document.getElementById('signatureDisplay').textContent;
        navigator.clipboard.writeText(signature).then(() => {
            showNotification(langManager.t('signatureCopied'));
        }).catch(() => {
            showError(langManager.t('failedCopySignature'));
        });
    });

    copyAccountBtn.addEventListener('click', () => {
        const account = document.getElementById('accountDisplay').textContent;
        navigator.clipboard.writeText(account).then(() => {
            showNotification(langManager.t('accountCopied'));
        }).catch(() => {
            showError(langManager.t('failedCopyAccount'));
        });
    });

    languageSelector.addEventListener('change', (e) => {
        langManager.setLanguage(e.target.value);
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
