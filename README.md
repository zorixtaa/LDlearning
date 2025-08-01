# LDlearning

This project is a learning platform built with React and Vite. Authentication and data storage are handled by [Firebase](https://firebase.google.com/).

## Roles

Users can log in as **admin**, **trainer** or **learner**. Navigation options adapt to the current role. Trainers and admins have access to the new course builder interface. For testing, the login page now includes a role selector so you can choose the desired role before signing in. A demo super admin account is available with the username **zorino** and password **demo123**.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `credentials.env` to `.env` and ensure the Firebase values match your project:
   ```bash
   cp credentials.env .env
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` – start Vite in development mode
- `npm run build` – build for production
- `npm run preview` – preview the production build
- `npm run lint` – run ESLint

## Firebase Initialization Example

Below is a basic example of how Firebase is initialized in this project. The configuration values come from the `.env` file.

```ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
```


