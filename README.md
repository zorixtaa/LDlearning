# LDlearning

This project is a learning platform built with React and Vite. Authentication and data storage are handled by [Firebase](https://firebase.google.com/).

## Roles

Users can log in as **admin**, **trainer** or **learner**. Navigation options adapt to the current role. Trainers and admins have access to the new course builder interface.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example` and fill in your Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=<your-api-key>
   VITE_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
   VITE_FIREBASE_PROJECT_ID=<your-project-id>
   VITE_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
   VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
   VITE_FIREBASE_APP_ID=<your-app-id>
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

## Credentials


```

```

