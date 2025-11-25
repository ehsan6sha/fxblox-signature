# FxBlox Signature Generator - Quick Start Guide

## For End Users

### How to Generate Your Signature

#### Step 1: Open the Web Portal
- Visit: [fxblox-signature.fx.land](https://fxblox-signature.fx.land) (or your deployment URL)
- Or run locally: `npm run dev` and open `http://localhost:5173`

#### Step 2: Enter Your Password
- Enter the same password you plan to use in FxBlox app
- ⚠️ **Important**: Remember this password! You'll need it in the app.

#### Step 3: Connect Your Wallet
- Click one of the wallet options:
  - 🦊 MetaMask
  - 💙 Coinbase Wallet
  - 🔗 WalletConnect
- Approve the connection in your wallet

#### Step 4: Sign the Message
- Your wallet will show a signature request
- Review the message (it's your password's chainCode in hex)
- Click "Sign" in your wallet

#### Step 5: Copy the Signature
- The signature will appear on screen
- Click "📋 Copy Signature" button
- Signature is now in your clipboard

#### Step 6: Use in FxBlox App
- Open FxBlox mobile app
- Go to "Link Password" screen
- Enter the same password
- Select "Sign Manually"
- Paste the signature you copied
- Complete setup

---

## For Developers

### Installation

```bash
# Clone the repository
cd fxblox-signature

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development

```bash
# Watch mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Project Structure

```
fxblox-signature/
├── index.html              # Main UI
├── src/
│   ├── main.js            # Event handlers
│   ├── styles.css         # Styling
│   └── signatureGenerator.js  # Core logic
├── package.json           # Dependencies
└── vite.config.js         # Build config
```

### Key Files

- **index.html** - UI with 3 steps
- **src/main.js** - Event listeners and UI logic
- **src/signatureGenerator.js** - Signature generation logic
- **src/styles.css** - Responsive styling

### Adding a New Wallet

1. Add button to `index.html`:
```html
<button id="myWalletBtn" class="wallet-btn">
    <span class="wallet-icon">🔷</span>
    <span>My Wallet</span>
</button>
```

2. Add method to `src/signatureGenerator.js`:
```javascript
async connectMyWallet() {
    if (!window.myWallet) {
        throw new Error('My Wallet not installed');
    }
    const accounts = await window.myWallet.request({
        method: 'eth_requestAccounts',
    });
    this.account = accounts[0];
    this.provider = new BrowserProvider(window.myWallet);
}
```

3. Add event listener to `src/main.js`:
```javascript
document.getElementById('myWalletBtn').addEventListener('click', async () => {
    await app.connectAndSign('myWallet');
});
```

### Customization

#### Change Colors
Edit `src/styles.css`:
```css
:root {
    --primary-color: #your-color;
    --primary-dark: #your-dark-color;
    /* ... other colors ... */
}
```

#### Change Text
Edit `index.html` and `src/main.js` to update strings.

#### Change Layout
Modify CSS in `src/styles.css` or HTML structure in `index.html`.

### Deployment

#### To GitHub Pages

```bash
# Automatic (via GitHub Actions)
git push origin main

# Manual
npm run deploy
```

#### To Other Platforms

```bash
# Build
npm run build

# Upload dist/ folder to:
# - Netlify
# - Vercel
# - AWS S3
# - Any web server
```

### Troubleshooting

#### MetaMask not detected
- Install MetaMask extension or mobile app
- Refresh the page
- Try a different browser

#### "No accounts available"
- Unlock your wallet
- Try disconnecting and reconnecting
- Check wallet permissions

#### Signature request rejected
- Approve the request in your wallet
- Make sure you're using the correct account

#### Build errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Testing Locally

```bash
# Start dev server
npm run dev

# Open http://localhost:5173

# Test with MetaMask:
# 1. Install MetaMask extension
# 2. Create test account
# 3. Go through signature flow

# Test mobile:
# 1. Get local IP: ipconfig getifaddr en0 (Mac) or ipconfig (Windows)
# 2. Open http://<your-ip>:5173 on mobile
# 3. Test with mobile wallet
```

### Building for Production

```bash
# Build optimized version
npm run build

# Check output
ls -lh dist/

# Preview
npm run preview
```

### Environment Variables

Create `.env` file (optional):
```
VITE_API_URL=https://api.example.com
VITE_WALLET_CONNECT_ID=your-id
```

### Dependencies

- **ethers.js** - Web3 interaction
- **@functionland/fula-sec** - HDKEY and DID
- **Vite** - Build tool

Update dependencies:
```bash
npm update
```

### Performance Tips

1. **Minimize bundle size**
   - Tree-shake unused code
   - Use dynamic imports for large libraries

2. **Optimize images**
   - Use SVG for icons
   - Compress images

3. **Cache busting**
   - Vite handles automatically
   - Check dist/ for hash filenames

### Security Checklist

- ✅ No sensitive data in localStorage
- ✅ No API keys in code
- ✅ HTTPS only for production
- ✅ Content Security Policy headers
- ✅ No third-party analytics

### Monitoring

Check browser console for:
- Errors: `console.error()`
- Warnings: `console.warn()`
- Info: `console.log()`

### Support

For issues:
1. Check browser console for errors
2. Review ARCHITECTURE.md
3. Check ANALYSIS.md for technical details
4. Open issue on GitHub

---

## Common Workflows

### Workflow 1: Local Development

```bash
# 1. Start dev server
npm run dev

# 2. Make changes to files
# (Auto-reload in browser)

# 3. Test in browser
# (Open http://localhost:5173)

# 4. Build when ready
npm run build

# 5. Preview production build
npm run preview
```

### Workflow 2: Deploy to GitHub Pages

```bash
# 1. Commit changes
git add .
git commit -m "Update signature generator"

# 2. Push to main
git push origin main

# 3. GitHub Actions automatically:
#    - Builds the project
#    - Deploys to gh-pages
#    - Available at GitHub Pages URL

# 4. Verify deployment
# Visit: https://functionland.github.io/fx/fxblox-signature/
```

### Workflow 3: Custom Domain

```bash
# 1. Update vite.config.js
# base: '/fxblox-signature/' → base: '/'

# 2. Add CNAME file to root:
# fxblox-signature.fx.land

# 3. Configure DNS:
# CNAME → functionland.github.io

# 4. Deploy
npm run deploy
```

---

## FAQ

**Q: Is my password safe?**
A: Yes! Your password is only used locally in your browser. It's never sent to any server.

**Q: Can I use the same signature in multiple apps?**
A: Yes! The signature is derived from your password and wallet, so it's the same everywhere.

**Q: What if I lose my signature?**
A: You can regenerate it anytime by using the same password and wallet.

**Q: Can I use a different wallet later?**
A: Yes, but you'll get a different signature. Keep your original signature if you need it.

**Q: Is this app open source?**
A: Yes! Check the repository for source code.

**Q: Can I host this myself?**
A: Yes! Build and deploy to any static hosting service.

**Q: Does this work offline?**
A: No, you need internet to connect to your wallet and sign messages.

**Q: Which wallets are supported?**
A: MetaMask and Coinbase Wallet. WalletConnect support coming soon.

---

## Next Steps

1. ✅ Generate your signature using this web portal
2. ✅ Copy the signature
3. ✅ Open FxBlox mobile app
4. ✅ Go to "Link Password" screen
5. ✅ Enter your password
6. ✅ Select "Sign Manually"
7. ✅ Paste your signature
8. ✅ Complete FxBlox setup

Enjoy! 🎉
