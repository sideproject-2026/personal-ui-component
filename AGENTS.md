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

## Component file structure

- Put reusable components under `src/components/`.
- Use a single file for standalone components such as `src/components/stack.tsx` or `src/components/input-form.tsx`.
- Use a folder with an `index.ts` barrel when a component family has multiple related files, such as `src/components/buttons/`.
- Keep component-specific helpers close to the component when they are not shared package-wide.
- Put shared utilities under `src/utils/`.
- Export component families through their local `index.ts` first, then re-export them from `src/index.ts`.
- Avoid adding app-only folders or example-only component structures inside `src/`.

## Validation

- Run `npm run typecheck` for TypeScript validation.
- Run `npm run build` before finishing changes.
- Keep emitted artifacts in `dist/` only.

## Publishing notes

- Update `package.json` name before publishing if you need a scoped npm package name.
- Ensure `README.md` reflects the exported API and install steps.