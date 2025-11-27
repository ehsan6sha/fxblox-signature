// Translation data for the application
export const translations = {
    en: {
        // Header
        title: "FxBlox Signature Generator",
        subtitle: "Generate your FxBlox identity signature using your Web3 wallet",

        // Step 1
        step1Title: "Step 1: Enter Password",
        passwordLabel: "Password:",
        passwordPlaceholder: "Enter Same password you entered in Fxblox App",
        passwordHelp: "⚠️ This password will be used to generate your identity. Keep it safe!",
        nextButton: "Next: Connect Same Wallet Address you Entered in Fxblox App",

        // Step 2
        step2Title: "Step 2: Connect Wallet",
        walletInfo: "Select your Web3 wallet to sign the message. This wallet will be used to claim your FULA rewards from the FxBlox App:",
        allWallets: "All Wallets",
        backButton: "Back",

        // Step 3
        step3Title: "Step 3: Your Signature",
        signatureInfo: "Your signature has been generated. Copy it and paste it in the FxBlox app:",
        connectedAccount: "Connected Account:",
        signature: "Signature:",
        copySignature: "📋 Copy Signature",
        startOver: "Start Over",

        // Notifications
        signatureCopied: "Signature copied to clipboard!",
        accountCopied: "Account address copied to clipboard!",
        failedCopySignature: "Failed to copy signature",
        failedCopyAccount: "Failed to copy account address",

        // Footer
        footerText: "🔒 Your password and signature are generated locally. Nothing is stored on our servers.",

        // Errors
        dismiss: "Dismiss"
    },

    zh: {
        // Header
        title: "FxBlox 签名生成器",
        subtitle: "使用您的 Web3 钱包生成 FxBlox 身份签名",

        // Step 1
        step1Title: "步骤 1：输入密码",
        passwordLabel: "密码：",
        passwordPlaceholder: "输入您在 Fxblox 应用中输入的相同密码",
        passwordHelp: "⚠️ 此密码将用于生成您的身份。请妥善保管！",
        nextButton: "下一步：连接您在 Fxblox 应用中输入的相同钱包地址",

        // Step 2
        step2Title: "步骤 2：连接钱包",
        walletInfo: "选择您的 Web3 钱包来签署消息。此钱包将用于从 FxBlox 应用领取您的 FULA 奖励：",
        allWallets: "所有钱包",
        backButton: "返回",

        // Step 3
        step3Title: "步骤 3：您的签名",
        signatureInfo: "您的签名已生成。复制它并粘贴到 FxBlox 应用中：",
        connectedAccount: "已连接账户：",
        signature: "签名：",
        copySignature: "📋 复制签名",
        startOver: "重新开始",

        // Notifications
        signatureCopied: "签名已复制到剪贴板！",
        accountCopied: "账户地址已复制到剪贴板！",
        failedCopySignature: "复制签名失败",
        failedCopyAccount: "复制账户地址失败",

        // Footer
        footerText: "🔒 您的密码和签名在本地生成。我们的服务器不会存储任何内容。",

        // Errors
        dismiss: "关闭"
    },

    fr: {
        // Header
        title: "Générateur de Signature FxBlox",
        subtitle: "Générez votre signature d'identité FxBlox en utilisant votre portefeuille Web3",

        // Step 1
        step1Title: "Étape 1 : Entrez le Mot de Passe",
        passwordLabel: "Mot de passe :",
        passwordPlaceholder: "Entrez le même mot de passe que vous avez saisi dans l'application Fxblox",
        passwordHelp: "⚠️ Ce mot de passe sera utilisé pour générer votre identité. Gardez-le en sécurité !",
        nextButton: "Suivant : Connectez la même adresse de portefeuille que vous avez saisie dans l'application Fxblox",

        // Step 2
        step2Title: "Étape 2 : Connecter le Portefeuille",
        walletInfo: "Sélectionnez votre portefeuille Web3 pour signer le message. Ce portefeuille sera utilisé pour réclamer vos récompenses FULA depuis l'application FxBlox :",
        allWallets: "Tous les Portefeuilles",
        backButton: "Retour",

        // Step 3
        step3Title: "Étape 3 : Votre Signature",
        signatureInfo: "Votre signature a été générée. Copiez-la et collez-la dans l'application FxBlox :",
        connectedAccount: "Compte Connecté :",
        signature: "Signature :",
        copySignature: "📋 Copier la Signature",
        startOver: "Recommencer",

        // Notifications
        signatureCopied: "Signature copiée dans le presse-papiers !",
        accountCopied: "Adresse du compte copiée dans le presse-papiers !",
        failedCopySignature: "Échec de la copie de la signature",
        failedCopyAccount: "Échec de la copie de l'adresse du compte",

        // Footer
        footerText: "🔒 Votre mot de passe et votre signature sont générés localement. Rien n'est stocké sur nos serveurs.",

        // Errors
        dismiss: "Fermer"
    }
};

// Language manager class
export class LanguageManager {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.translations = translations;
    }

    getStoredLanguage() {
        return localStorage.getItem('fxblox-language');
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLanguage = lang;
            localStorage.setItem('fxblox-language', lang);
            this.updateUI();
        }
    }

    t(key) {
        return this.translations[this.currentLanguage][key] || this.translations['en'][key] || key;
    }

    updateUI() {
        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);

            if (element.tagName === 'INPUT' && element.type === 'password') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update the language selector
        const langSelector = document.getElementById('languageSelector');
        if (langSelector) {
            langSelector.value = this.currentLanguage;
        }
    }
}
