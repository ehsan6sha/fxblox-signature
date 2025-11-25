# FxBlox Signature Generator - Visual Diagrams

## 1. User Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FxBlox Signature Generator                    │
│                         Web Portal Flow                          │
└─────────────────────────────────────────────────────────────────┘

                              START
                                │
                                ▼
                    ┌──────────────────────┐
                    │  Step 1: Password    │
                    │  Input Password      │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  Step 2: Wallet      │
                    │  Select Wallet       │
                    │  - MetaMask          │
                    │  - Coinbase          │
                    │  - WalletConnect     │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  Connect to Wallet   │
                    │  Request Accounts    │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  User Approves in    │
                    │  Wallet App          │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  Request Signature   │
                    │  personal_sign       │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  User Signs in       │
                    │  Wallet App          │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  Step 3: Display     │
                    │  Show Signature      │
                    │  Copy Button         │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  User Copies         │
                    │  Signature           │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  User Opens FxBlox   │
                    │  App                 │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  Select "Sign       │
                    │  Manually"           │
                    └──────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │  Paste Signature     │
                    │  Complete Setup      │
                    └──────────────────────┘
                                │
                                ▼
                              END
```

## 2. Signature Generation Process

```
┌─────────────────────────────────────────────────────────────────┐
│              Signature Generation Process                        │
│         (Same in Mobile App and Web Portal)                     │
└─────────────────────────────────────────────────────────────────┘

INPUT: Password
  │
  ├─────────────────────────────────────────────────────────────┐
  │                                                               │
  │  ┌──────────────────────────────────────────────────────┐   │
  │  │  HDKEY Derivation                                    │   │
  │  │  ─────────────────────────────────────────────────   │   │
  │  │  Library: @functionland/fula-sec                     │   │
  │  │  Input: Password                                     │   │
  │  │  Output: ChainCode (deterministic)                   │   │
  │  │                                                       │   │
  │  │  const hdkey = new HDKEY(password);                  │   │
  │  │  const chainCode = hdkey.chainCode;                  │   │
  │  └──────────────────────────────────────────────────────┘   │
  │                                                               │
  └─────────────────────────────────────────────────────────────┘
  │
  ▼
  ChainCode (Hex Format)
  │
  ├─────────────────────────────────────────────────────────────┐
  │                                                               │
  │  ┌──────────────────────────────────────────────────────┐   │
  │  │  Wallet Connection                                   │   │
  │  │  ─────────────────────────────────────────────────   │   │
  │  │  Method: eth_requestAccounts                         │   │
  │  │  Result: Connected Account Address                   │   │
  │  │                                                       │   │
  │  │  const accounts = await provider.request({           │   │
  │  │    method: 'eth_requestAccounts'                     │   │
  │  │  });                                                 │   │
  │  └──────────────────────────────────────────────────────┘   │
  │                                                               │
  └─────────────────────────────────────────────────────────────┘
  │
  ▼
  Connected Account + ChainCode
  │
  ├─────────────────────────────────────────────────────────────┐
  │                                                               │
  │  ┌──────────────────────────────────────────────────────┐   │
  │  │  Message Signing                                     │   │
  │  │  ─────────────────────────────────────────────────   │   │
  │  │  Method: personal_sign (EIP-191)                     │   │
  │  │  Input: ChainCode (hex), Account                     │   │
  │  │  Output: Signature (hex string)                      │   │
  │  │                                                       │   │
  │  │  const msgHex = '0x' + Buffer.from(                  │   │
  │  │    chainCode).toString('hex');                       │   │
  │  │  const signature = await provider.send(              │   │
  │  │    'personal_sign', [msgHex, account]                │   │
  │  │  );                                                  │   │
  │  └──────────────────────────────────────────────────────┘   │
  │                                                               │
  └─────────────────────────────────────────────────────────────┘
  │
  ▼
OUTPUT: Signature (0x1234...abcd)
  │
  └─────────────────────────────────────────────────────────────┐
                                                                 │
                    Used in FxBlox App:                          │
                                                                 │
                    const did = getMyDID(                        │
                      password,                                  │
                      signature                                  │
                    );                                           │
                                                                 │
                    Result: DID (did:...)                        │
                                                                 │
                    └─────────────────────────────────────────────┘
```

## 3. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    Web Portal Architecture                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        Browser                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   User Interface                         │   │
│  │              (HTML + CSS + JavaScript)                   │   │
│  │                                                          │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │  index.html                                        │ │   │
│  │  │  ─────────────────────────────────────────────────│ │   │
│  │  │  • Step 1: Password Input                          │ │   │
│  │  │  • Step 2: Wallet Selection                        │ │   │
│  │  │  • Step 3: Signature Display                       │ │   │
│  │  │  • Error/Status Messages                           │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  │                          ▲                               │   │
│  │                          │                               │   │
│  │                          ▼                               │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │  src/main.js                                       │ │   │
│  │  │  ─────────────────────────────────────────────────│ │   │
│  │  │  • Event Listeners                                 │ │   │
│  │  │  • UI State Management                             │ │   │
│  │  │  • Error Handling                                  │ │   │
│  │  │  • Copy to Clipboard                               │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  │                          ▲                               │   │
│  │                          │                               │   │
│  │                          ▼                               │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │  src/signatureGenerator.js                         │ │   │
│  │  │  ─────────────────────────────────────────────────│ │   │
│  │  │  • Password Processing (HDKEY)                     │ │   │
│  │  │  • Wallet Connection                               │ │   │
│  │  │  • Message Signing                                 │ │   │
│  │  │  • State Management                                │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  │                          ▲                               │   │
│  │                          │                               │   │
│  │                          ▼                               │   │
│  │  ┌────────────────────────────────────────────────────┐ │   │
│  │  │  src/styles.css                                    │ │   │
│  │  │  ─────────────────────────────────────────────────│ │   │
│  │  │  • Responsive Design                               │ │   │
│  │  │  • Animations                                      │ │   │
│  │  │  • Mobile Support                                  │ │   │
│  │  └────────────────────────────────────────────────────┘ │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ▲                                       │
│                          │                                       │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  External Libraries                      │   │
│  │                                                          │   │
│  │  • ethers.js (Web3 Interaction)                          │   │
│  │  • @functionland/fula-sec (HDKEY/DID)                    │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ▲                                       │
│                          │                                       │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Web3 Provider (window.ethereum)             │   │
│  │                                                          │   │
│  │  • MetaMask                                              │   │
│  │  • Coinbase Wallet                                       │   │
│  │  • WalletConnect                                         │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                          ▲                                       │
│                          │                                       │
│                          ▼                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │           User's Wallet (Mobile or Extension)            │   │
│  │                                                          │   │
│  │  • Account Management                                    │   │
│  │  • Message Signing                                       │   │
│  │  • Transaction Approval                                  │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 4. Comparison: Mobile App vs Web Portal

```
┌──────────────────────────────────────────────────────────────────┐
│         FxBlox Mobile App vs Signature Generator Web Portal      │
└──────────────────────────────────────────────────────────────────┘

MOBILE APP                          WEB PORTAL
─────────────────────────────────────────────────────────────────

┌──────────────────────┐            ┌──────────────────────┐
│  React Native App    │            │  Web Browser         │
│  (iOS/Android)       │            │  (Desktop/Mobile)    │
└──────────────────────┘            └──────────────────────┘
         │                                   │
         ▼                                   ▼
┌──────────────────────┐            ┌──────────────────────┐
│  MetaMask SDK React  │            │  ethers.js           │
│  (Mobile SDK)        │            │  (Web3 Library)      │
└──────────────────────┘            └──────────────────────┘
         │                                   │
         ▼                                   ▼
┌──────────────────────┐            ┌──────────────────────┐
│  sdk?.connect()      │            │  window.ethereum     │
│  (MetaMask only)     │            │  (Multiple Wallets)  │
└──────────────────────┘            └──────────────────────┘
         │                                   │
         ▼                                   ▼
┌──────────────────────┐            ┌──────────────────────┐
│  personal_sign       │            │  personal_sign       │
│  (Same Method)       │            │  (Same Method)       │
└──────────────────────┘            └──────────────────────┘
         │                                   │
         ▼                                   ▼
┌──────────────────────┐            ┌──────────────────────┐
│  Signature           │            │  Signature           │
│  (Stored in KeyChain)│            │  (Copied by User)    │
└──────────────────────┘            └──────────────────────┘
         │                                   │
         ▼                                   ▼
┌──────────────────────┐            ┌──────────────────────┐
│  DID Generated       │            │  Pasted in App       │
│  (Automatic)         │            │  (Manual)            │
└──────────────────────┘            └──────────────────────┘

SAME CRYPTOGRAPHY ✓
SAME SIGNATURE OUTPUT ✓
SAME DID GENERATION ✓
```

## 5. Deployment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Deployment Pipeline                          │
└─────────────────────────────────────────────────────────────────┘

Developer
    │
    ▼
┌─────────────────────────────────────────┐
│  Make Changes to Code                   │
│  (index.html, src/*, package.json)      │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  Commit and Push to GitHub              │
│  git push origin main                   │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  GitHub Actions Triggered               │
│  (.github/workflows/deploy.yml)         │
└─────────────────────────────────────────┘
    │
    ├─────────────────────────────────────┐
    │                                     │
    ▼                                     ▼
┌──────────────────────┐      ┌──────────────────────┐
│  npm install         │      │  npm run build       │
│  (Install deps)      │      │  (Build project)     │
└──────────────────────┘      └──────────────────────┘
    │                                     │
    └─────────────────────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │  dist/ folder        │
        │  (Production build)   │
        └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │  Push to gh-pages    │
        │  branch              │
        └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │  GitHub Pages        │
        │  (Live Website)      │
        └──────────────────────┘
                    │
                    ▼
        ┌──────────────────────┐
        │  https://github.com/ │
        │  functionland/fx/    │
        │  fxblox-signature/   │
        └──────────────────────┘
                    │
                    ▼
                Users Access
```

## 6. State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              SignatureGenerator State Flow                       │
└─────────────────────────────────────────────────────────────────┘

Initial State
    │
    ├─ password: null
    ├─ chainCode: null
    ├─ provider: null
    ├─ account: null
    └─ signature: null
    │
    ▼
User Enters Password
    │
    ├─ password: "user_password"
    ├─ chainCode: "0x1234...abcd"
    │
    ▼
User Selects Wallet
    │
    ├─ provider: BrowserProvider
    │
    ▼
Wallet Connected
    │
    ├─ account: "0x742d35Cc6634C0532925a3b844Bc9e7595f42e1"
    │
    ▼
Signature Requested
    │
    ├─ signature: "0x5678...efgh"
    │
    ▼
Signature Displayed
    │
    └─ Ready for Copy/Paste
```

## 7. Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  Error Handling Flow                            │
└─────────────────────────────────────────────────────────────────┘

User Action
    │
    ▼
Try Block
    │
    ├─ Success ──────────────────────────┐
    │                                    │
    │                                    ▼
    │                          Display Result
    │                          (Step 3)
    │
    └─ Error ────────────────────────────┐
                                         │
                                         ▼
                                    Catch Block
                                         │
                                         ├─ MetaMask not installed
                                         ├─ Connection rejected
                                         ├─ Signature rejected
                                         ├─ No account available
                                         └─ Other errors
                                         │
                                         ▼
                                    Extract Error Message
                                         │
                                         ▼
                                    Display Error Box
                                    (User can dismiss)
                                         │
                                         ▼
                                    User Can Retry
```

---

## Legend

```
┌─────┐
│ Box │ = Component/Process
└─────┘

  │
  ▼   = Flow/Connection

─ ─ ─ = Optional/Alternative Path

✓     = Success/Confirmed
```

---

These diagrams provide a visual representation of:
- User flow through the application
- Signature generation process
- System architecture
- Comparison with mobile app
- Deployment pipeline
- State management
- Error handling
