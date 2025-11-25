import { BrowserProvider } from 'ethers';
import { HDKEY } from '@functionland/fula-sec-web';

/**
 * SignatureGenerator - Handles the complete signature generation flow
 * 
 * Process:
 * 1. User enters password
 * 2. HDKEY derives chainCode from password
 * 3. User connects wallet (MetaMask, WalletConnect, or Coinbase)
 * 4. App requests personal_sign of chainCode from wallet
 * 5. Wallet returns signature
 * 6. Signature is displayed for user to copy and use in FxBlox app
 */
export class SignatureGenerator {
    constructor() {
        this.password = null;
        this.chainCode = null;
        this.provider = null;
        this.signer = null;
        this.account = null;
        this.signature = null;
    }

    /**
     * Set the password and derive chainCode
     * @param {string} password - User's password
     */
    setPassword(password) {
        try {
            this.password = password;
            // Derive chainCode from password using HDKEY (same as mobile app)
            const hdkey = new HDKEY(password);
            this.chainCode = hdkey.chainCode;
            console.log('ChainCode derived from password');
        } catch (error) {
            console.error('Error setting password:', error);
            window.showError('Failed to process password: ' + error.message);
            throw error;
        }
    }

    /**
     * Connect to wallet and request signature
     * @param {string} walletType - Type of wallet ('metamask', 'walletconnect', 'coinbase')
     */
    async connectAndSign(walletType) {
        try {
            if (!this.password) {
                window.showError('Please enter a password first');
                return;
            }

            window.showConnectionStatus(`Connecting to ${walletType}...`);

            // Connect to wallet based on type
            switch (walletType) {
                case 'metamask':
                    await this.connectMetaMask();
                    break;
                case 'walletconnect':
                    await this.connectWalletConnect();
                    break;
                case 'coinbase':
                    await this.connectCoinbase();
                    break;
                default:
                    throw new Error('Unknown wallet type');
            }

            window.showConnectionStatus('Wallet connected. Requesting signature...');

            // Request signature
            await this.requestSignature();

            // Display result
            window.displaySignatureResult(this.account, this.signature);

        } catch (error) {
            console.error('Error in connectAndSign:', error);
            window.showError(error.message || 'Failed to generate signature');
        }
    }

    /**
     * Connect to MetaMask
     */
    async connectMetaMask() {
        if (!window.ethereum) {
            throw new Error('MetaMask is not installed. Please install MetaMask extension or mobile app.');
        }

        try {
            // Request account access
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts available');
            }

            this.account = accounts[0];
            this.provider = new BrowserProvider(window.ethereum);
            console.log('Connected to MetaMask:', this.account);

        } catch (error) {
            if (error.code === 4001) {
                throw new Error('MetaMask connection rejected by user');
            }
            throw new Error('Failed to connect to MetaMask: ' + error.message);
        }
    }

    /**
     * Connect to WalletConnect (using Web3Modal)
     */
    async connectWalletConnect() {
        try {
            // Check if Web3Modal is available
            if (!window.WalletConnectModal) {
                throw new Error('WalletConnect not available. Please use MetaMask or Coinbase Wallet instead.');
            }

            // This would require Web3Modal setup
            // For now, we'll provide a fallback message
            throw new Error('WalletConnect support requires additional setup. Please use MetaMask or Coinbase Wallet.');

        } catch (error) {
            throw error;
        }
    }

    /**
     * Connect to Coinbase Wallet
     */
    async connectCoinbase() {
        try {
            // Check if Coinbase Wallet is available
            if (!window.coinbaseWalletProvider) {
                throw new Error('Coinbase Wallet is not installed. Please install Coinbase Wallet extension or use MetaMask.');
            }

            // Request account access
            const accounts = await window.coinbaseWalletProvider.request({
                method: 'eth_requestAccounts',
            });

            if (!accounts || accounts.length === 0) {
                throw new Error('No accounts available');
            }

            this.account = accounts[0];
            this.provider = new BrowserProvider(window.coinbaseWalletProvider);
            console.log('Connected to Coinbase Wallet:', this.account);

        } catch (error) {
            if (error.code === 4001) {
                throw new Error('Coinbase Wallet connection rejected by user');
            }
            throw new Error('Failed to connect to Coinbase Wallet: ' + error.message);
        }
    }

    /**
     * Request signature from connected wallet
     * Uses personal_sign method (same as mobile app)
     */
    async requestSignature() {
        if (!this.provider || !this.account) {
            throw new Error('Wallet not connected');
        }

        if (!this.chainCode) {
            throw new Error('ChainCode not derived');
        }

        try {
            // Convert chainCode to hex format (same as mobile app)
            // chainCode is already a Uint8Array from HDKEY, convert to hex string
            let msgHex;
            if (typeof this.chainCode === 'string') {
                // If it's already a string, encode it to hex
                msgHex = '0x' + Array.from(new TextEncoder().encode(this.chainCode))
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
            } else if (this.chainCode instanceof Uint8Array) {
                // If it's a Uint8Array, convert directly to hex
                msgHex = '0x' + Array.from(this.chainCode)
                    .map(b => b.toString(16).padStart(2, '0'))
                    .join('');
            } else {
                throw new Error('Invalid chainCode format');
            }

            console.log('Requesting signature for account:', this.account);
            console.log('Message (hex):', msgHex);

            // Request personal_sign from wallet
            this.signature = await this.provider.send('personal_sign', [msgHex, this.account]);

            if (!this.signature) {
                throw new Error('No signature received from wallet');
            }

            console.log('Signature received:', this.signature);

        } catch (error) {
            if (error.code === 4001) {
                throw new Error('Signature request rejected by user');
            }
            throw new Error('Failed to get signature: ' + error.message);
        }
    }

    /**
     * Reset the generator to initial state
     */
    reset() {
        this.password = null;
        this.chainCode = null;
        this.provider = null;
        this.signer = null;
        this.account = null;
        this.signature = null;
    }

    /**
     * Get the current signature
     * @returns {string} The generated signature
     */
    getSignature() {
        return this.signature;
    }

    /**
     * Get the connected account
     * @returns {string} The connected wallet account
     */
    getAccount() {
        return this.account;
    }
}
