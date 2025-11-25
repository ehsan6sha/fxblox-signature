# FxBlox Signature Generator

A clean, minimal web portal for generating FxBlox identity signatures using Web3 wallets (MetaMask, Coinbase Wallet, etc.).

## Overview

This web application replicates the signature generation process from the FxBlox mobile app, allowing users to:

1. Enter a password
2. Connect their Web3 wallet (MetaMask, Coinbase, etc.)
3. Sign a message derived from their password
4. Copy the signature to use in the FxBlox mobile app

## How It Works

### Signature Generation Process

1. **Password Input**: User enters a secure password
2. **ChainCode Derivation**: The password is processed through HDKEY to derive a chainCode (same as mobile app)
3. **Wallet Connection**: User connects their Web3 wallet
4. **Message Signing**: The app requests the wallet to sign the chainCode using `personal_sign`
5. **Signature Display**: The resulting signature is displayed for the user to copy

### Security

- ✅ All processing happens in the browser (client-side only)
- ✅ No data is sent to any server
- ✅ Password and signature are never stored
- ✅ Uses standard Web3 signing methods (`personal_sign`)

## Installation

### Prerequisites

- Node.js 16+ and npm/yarn
- A Web3 wallet installed (MetaMask, Coinbase Wallet, etc.)

### Setup

```bash
# Install dependencies
npm install
# or
yarn install

# Start development server
npm run dev
# or
yarn dev

# Build for production
npm run build
# or
yarn build
```

## Usage

### Local Development

```bash
npm run dev
```

The app will open at `http://localhost:5173`

### Deployment to GitHub Pages

1. Update the `homepage` field in `package.json` if needed
2. Deploy using:

```bash
npm run deploy
```

This will build the app and push it to the `gh-pages` branch.

### Manual Deployment

1. Build the app:
```bash
npm run build
```

2. The `dist/` folder contains the production-ready files
3. Upload the contents of `dist/` to any static hosting service:
   - GitHub Pages
   - Netlify
   - Vercel
   - AWS S3
   - Any web server

## Features

- 🎨 Clean, modern UI
- 📱 Fully responsive (works on desktop and mobile)
- 🔐 Client-side only (no server required)
- 🦊 MetaMask support
- 💙 Coinbase Wallet support
- 🔗 WalletConnect ready (requires additional setup)
- ⚡ Fast and lightweight
- 🌐 Can be hosted on GitHub Pages

## Supported Wallets

- **MetaMask** - Full support
- **Coinbase Wallet** - Full support
- **WalletConnect** - Requires additional setup

## File Structure

```
fxblox-signature/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── README.md               # This file
├── .gitignore              # Git ignore rules
└── src/
    ├── main.js             # Application entry point
    ├── styles.css          # Styling
    └── signatureGenerator.js # Core signature generation logic
```

## How to Use in FxBlox App

1. Open this web portal in your browser
2. Enter your password
3. Connect your Web3 wallet
4. Sign the message when prompted
5. Copy the signature
6. In the FxBlox app, select "Sign Manually" option
7. Paste the signature you copied
8. Complete the setup

## Technical Details

### Dependencies

- **ethers.js** - Web3 interaction
- **@functionland/fula-sec** - HDKEY and DID generation (same as mobile app)
- **Vite** - Build tool

### Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Project Structure

- `index.html` - UI markup
- `src/styles.css` - Responsive styling
- `src/main.js` - Event handlers and UI logic
- `src/signatureGenerator.js` - Core signature generation logic

### Adding New Wallet Support

To add support for a new wallet:

1. Add a new button in `index.html`
2. Create a `connect<WalletName>()` method in `signatureGenerator.js`
3. Add event listener in `main.js`

## Troubleshooting

### MetaMask not detected

- Ensure MetaMask is installed as a browser extension or mobile app
- Try refreshing the page
- Check that you're not in a private/incognito window

### Signature request rejected

- Make sure you approve the signature request in your wallet
- Check that you're using the correct account

### "No accounts available" error

- Ensure your wallet is unlocked
- Try disconnecting and reconnecting your wallet

## License

Same as FxBlox project

## Support

For issues or questions, please refer to the main FxBlox project documentation.

---

**Note**: This is a companion tool for the FxBlox application. It generates signatures using the same cryptographic process as the mobile app, allowing users to set up their identity on any device with a Web3 wallet.
