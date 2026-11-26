# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev`: start the Vite dev server
- `npm run build`: type-check (`tsc -b`) and build for production
- `npm run typecheck`: type-check only
- `npm run check`: Biome lint + format check + import sorting (run this before finishing a change)
- `npm run check:fix`: apply Biome's safe fixes and formatting
- `npm run lint` / `npm run format`: Biome lint only / format only (with `--write`)
- `npm test`: run Vitest in watch mode
- `npm run test:run`: run all tests once
- `npx vitest run src/pages/HomePage/HomePage.test.tsx`: run a single test file (add `-t "<name>"` to filter by test name)
- `cd server && npm run dev | test:run | typecheck`: the API Worker in `server/` has its own package, tests (Node environment, explicit `vitest` imports) and tsconfig; root `npm run check` lints it too

## Stack and setup

- Vite + React 19 + TypeScript. The entry point `src/main.tsx` renders `App` (`src/App/`), which checks the session on start and shows `HomePage` or `LoginPage` by the `page` in `src/stores/navigationStore.ts`. There is no router: switching pages is state (`openLogin` / `closeLogin` tasks).
- Vitest + Testing Library, configured in `vite.config.ts` under `test`: jsdom, `globals: true` (so `describe`/`it`/`expect` need no imports), and the setup file `src/test/setup.ts`, which loads the jest-dom matchers and runs cleanup.
- **Follow `architecture.md`** for where code goes. In short: one component per file, and every component (single-use children included) is a folder whose `index.tsx` is the component itself, next to `Component.module.css`, `Component.test.tsx`, and, if the component has logic, a `logic/` folder: `logic/usePresenter.ts` (state, effects, handlers; the view only calls `usePresenter()` or `usePresenter(props)`), local hooks, and `logic/tasks/` (business logic as verb-named, framework-agnostic TypeScript functions that use the stores directly and receive the API as an argument). No file may exceed 120 lines. Pages live in `src/pages/`, shared components in `src/components/` and `src/ui/`. Import anything in `src/` outside the current component folder through the `~/` alias (`~/tasks/isFavorite`, `~/ui/Chip`), not `../`; the alias is set in `tsconfig.app.json` and `vite.config.ts`.
- **Shared state uses zustand** (`src/stores/`): module-level `zustand/vanilla` stores that hold data only, like a database. All rules that read or change them are tasks, and tasks use the stores directly (they import `~/stores/favoritesStore` and call `getState`/`setState`; only the API is passed in as an argument). A task is a function named with a verb (`toggleFavorite`, `formatShow`), independent of React; reusable tasks are global and live in `src/tasks/` (`~/tasks/...`), and tasks call each other (`toggleFavorite` calls `showToast`). Local hooks of the component that needs the data (`Favorites/logic/useFavorites`, `ShowCard/logic/useFavoriteStatus`, `HomePage/logic/useToast`) read the stores in React, and presenters call the tasks that change them with the real API passed in (`toggleFavorite(show, favoritesApi)`); a hook wraps a task only when it needs React, like the effect in `HomePage/logic/useLoadFavorites`. There is no `src/services/` layer for now. Local UI state stays in `useState`.
- **Styling uses CSS Modules only:** import a component's styles as `import styles from './Component.module.css'`. Global CSS is limited to `src/index.css` (resets and root variables).
- **Biome** (`biome.json`) is the only linter and formatter; there is no ESLint or Prettier. Code style is 2-space indent, single quotes, no semicolons, and trailing commas. Biome's React and test rule sets are enabled, and `public/` is excluded. Biome also enforces the architecture rules (import restrictions per folder, the 120-line limit, named exports, and the GritQL plugin in `biome-plugins/`); see section 10 of `architecture.md`.

`task.md` is the homework spec (written in Russian).

## What is being built

"TV Shows Explorer" is a small React app that searches TV shows through the public TVmaze API, via its own API server in `server/`.

- **Search:** the app calls `GET ${VITE_API_URL}/shows?q=&genre=&page=` (`src/api/shows.ts`); the server calls TVmaze's `GET https://api.tvmaze.com/search/shows?q=<query>`, which returns `{ score, show }[]`.
- **Initial state:** an empty list and a search field only.
- **Pagination:** **3 items per page**, done on the server; the client keeps the selected page.
- **Favorites:** every show card has a star button that adds or removes the show. The header has a "Favorites N" button that opens the list. Each change shows a toast. All favorites logic is on the server (`GET /favorites`, `PUT`/`DELETE /favorites/:id`), which looks the show up on TVmaze and keeps it in a plain object (`server/src/favorites/memoryFavorites.ts`) behind an async, database-like interface. Favorites are personal: the routes need a session (`401` for a guest) and keep one list per user email (`favorites.forUser(email)`), so signing in again with the same email brings the list back. The lists live in Worker memory and are lost when the instance restarts. On the client, `HomePage/logic/useLoadFavorites` loads them when someone signs in and clears them (`~/tasks/clearFavorites`) for a guest; a guest sees no star on the cards and no "Favorites" button (both read `~/hooks/useSignedInEmail`), and `toggleFavorite` still refuses a guest with a toast.
- **Sign-in:** email only, no password. `LoginPage` posts to `POST /auth/login`; the server (`server/src/authRoutes.ts`) keeps sessions in memory (`sessions/memorySessions.ts`) and sets `__Host-sid` as an `HttpOnly; Secure; SameSite=None; Partitioned` cookie, because the app (GitHub Pages) and the API (workers.dev) are different sites. Auth and favorites requests (`src/api/auth.ts`, `src/api/favorites.ts`) use `credentials: 'include'`; CORS allows credentials, and `originGuard.ts` refuses changing requests from other origins (CSRF). `GET /auth/session` returns `{ user }` (`null` for a guest), loaded into `src/stores/sessionStore.ts` on start. The header's `UserMenu` shows "Sign in" or the email and "Log out". Search doesn't need a session; favorites do.
- **Genre filter:** collect the unique genres from the current search results and show them as clickable chips above the list. Selecting a chip filters the list to shows with that genre, and there must be a way to reset the filter. Pagination applies to the filtered list. The server returns the genre counts over all results, filters, and paginates.

## Requirements to keep in mind

- **UX is graded:** debounce input instead of sending a request on every keystroke, cancel in-flight requests when the query, genre or page changes (for example with `AbortController`), and handle loading, error, and empty states explicitly.
- **Stretch goal:** implement the data-fetching layer by hand, without `useQuery` (TanStack Query). Don't add react-query unless the user asks for it.
- **Design is free-form:** there is no mockup, and a polished, original UI is encouraged.
- **Backend:** `server/` is a Cloudflare Worker (Hono) that serves `GET /shows?q=&genre=&page=` (it calls TVmaze and does the genre filtering and pagination) `/favorites` (`favoritesRoutes.ts`) and `/auth` (`authRoutes.ts`). Its response types are in `server/src/contract.ts`; the frontend re-exports them from `src/api/types.ts`, so change both sides together. The frontend needs `VITE_API_URL`: locally from the git-ignored `.env` (template: `.env.example`), in CI from the env of the build step in `.github/workflows/deploy.yml`. Inside it, `app.ts` is HTTP only, `tasks/` holds plain TS that receives its dependencies as arguments (enforced by Biome), and `index.ts` wires in the real implementations.
- The repo is named "simple-architecture", so keep a clear separation between the API client, the data-fetching/state logic (hooks), and presentational components.
