# LDlearning

This project is a learning platform built with React and Vite. Authentication and data storage are handled by [Supabase](https://supabase.com/).

## Roles

Users can log in as **admin**, **trainer** or **learner**. Navigation options adapt to the current role. Trainers and admins have access to the new course builder interface.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file based on `.env.example` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=<your-project-url>
   VITE_SUPABASE_ANON_KEY=<your-anon-key>
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

