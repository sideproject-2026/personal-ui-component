# AGENTS.md

## Purpose

This repository is a publishable React component package, not a demo app. Keep all work focused on reusable library code that can be consumed from npm across multiple projects.

## Stack

- Vite in library mode
- React + TypeScript
- Tailwind CSS
- React Hook Form
- TanStack Table

## Working rules

- Do not add `App.tsx`, demo pages, or app-only routing unless explicitly requested.
- Put public exports behind `src/index.ts`.
- Keep components generic and package-friendly.
- Treat `react`, `react-dom`, `react-hook-form`, and `@tanstack/react-table` as peer dependencies.
- Preserve minimal bundle surface and avoid project-specific business logic.
- Import package styles from `src/index.ts` so consumers can also access `styles.css` from the built package.

## Validation

- Run `npm run typecheck` for TypeScript validation.
- Run `npm run build` before finishing changes.
- Keep emitted artifacts in `dist/` only.

## Publishing notes

- Update `package.json` name before publishing if you need a scoped npm package name.
- Ensure `README.md` reflects the exported API and install steps.