# Malabis Ledger

React app that talks to Firebase Auth and Firestore directly. No custom backend.

## Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Email/Password**
3. Create a **Cloud Firestore** database
4. Add a **Web** app in Project settings and copy the keys
5. Copy `.env.example` to `.env` and fill in the values
6. In Firestore → Rules, paste `firestore.rules` and publish
7. Run the app:

```bash
npm install
npm run dev
```

First visit shows **Create user**. After that, it shows **Log in**.
