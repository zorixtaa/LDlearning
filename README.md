# LDlearning

This project is a learning platform built with React and Vite. Authentication and data storage are handled by [Firebase](https://firebase.google.com/).

## Roles

Users can log in as **admin**, **trainer** or **learner**. Navigation options adapt to the current role. Trainers and admins have access to the new course builder interface.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env`. The example file already contains demo
   Firebase credentials you can use:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyCnCx-swPIRKplcNgMU_S1U82OkOwpLs1w
   VITE_FIREBASE_AUTH_DOMAIN=ldlearning-eda8f.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=ldlearning-eda8f
   VITE_FIREBASE_STORAGE_BUCKET=ldlearning-eda8f.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=780982601608
   VITE_FIREBASE_APP_ID=1:780982601608:web:7b73593b5d350d1cd21c3d
   VITE_FIREBASE_MEASUREMENT_ID=G-75ERG1069D
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


