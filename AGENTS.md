# Agent Instructions for LDlearning

This repository contains a React + TypeScript learning platform built with Vite.

## Coding Guidelines
- Use strict TypeScript; avoid `any` whenever possible.
- Prefer functional React components and hooks.
- Style with Tailwind CSS utility classes.
- Keep all source under `src/`.

## Contribution Workflow
1. Run `npm install` if dependencies are missing.
2. Ensure the project still builds with `npm run build`.
3. Run `npm run lint` to check for lint errors. Existing errors may appear; ensure new code does not introduce additional issues.
4. Update documentation in `README.md` when behavior changes.

## Commit Messages
- Use the imperative mood in the subject line (e.g. "Add feature" not "Added feature").
- Keep the subject under 50 characters and separate the body with a blank line when needed.

## Pull Request Notes
- Summarize changes and mention whether `npm run build` and `npm run lint` succeeded.
- Reference relevant files or lines when explaining the changes.
