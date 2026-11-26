# TV Shows Explorer

A small React app for searching and browsing TV shows with the public [TVmaze API](https://www.tvmaze.com/api), through its own API server on Cloudflare Workers. It is homework #1; the full spec (in Russian) is in [task.md](task.md).

## Features

- [x] **Search:** shows are fetched from the API server (`server/`), which searches TVmaze. The page starts with only a search field and a few suggested queries. The query is kept in the URL (`?q=murder`), so a search survives a reload and can be shared as a link.
- [x] **Pagination:** results are shown 3 per page, with controls to move between pages. The server returns one page at a time.
- [x] **Genre filter:** the unique genres from the current results are shown as clickable chips above the list, with a count for each. Selecting one shows only the shows in that genre, and the filter can be reset. The server filters, and pagination applies to the filtered list.
- [x] **UX:** input is debounced instead of sending a request per keystroke, outdated requests (a new query, genre or page) are cancelled with `AbortController`, and loading, error (with a retry button) and empty states are handled. While the next search, genre or page loads, the previous results stay on screen.
- [x] **Sign-in:** a separate login page with a single email field (no password, sign-up or recovery). The API server starts a session and keeps its id in an `HttpOnly` cookie. The header shows the signed-in email and a "Log out" button. Search works without signing in.
- [x] **Stretch goal:** data fetching is written by hand, without `useQuery`.

## Tech stack

- [Vite](https://vite.dev/), [React](https://react.dev/) 19 and TypeScript
- CSS Modules for styling
- [Vitest](https://vitest.dev/) and [Testing Library](https://testing-library.com/) for tests
- [Biome](https://biomejs.dev/) for linting and formatting

## Getting started

Requires Node.js 20.19+ or 22.12+ (developed on Node 24).

```sh
npm install
cp .env.example .env   # sets VITE_API_URL to the deployed API
npm run dev
```

## Scripts

| Command             | Description                                      |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Start the dev server                             |
| `npm run build`     | Type-check and build for production into `dist/` |
| `npm run preview`   | Serve the production build locally               |
| `npm run typecheck` | Type-check only                                  |
| `npm test`          | Run tests in watch mode                          |
| `npm run test:run`  | Run all tests once                               |
| `npm run check`     | Run Biome lint, format check and import sorting  |
| `npm run check:fix` | Apply Biome fixes and formatting                 |
| `npm run lint`      | Biome lint only                                  |
| `npm run format`    | Format all files with Biome                      |

To run a single test file: `npx vitest run src/pages/HomePage/HomePage.test.tsx` (add `-t "<name>"` to filter by test name).

## Project structure

The code follows a Model–View–Presenter split. The full rules are in [architecture.md](architecture.md).

```
src/
  main.tsx                # entry point, renders App
  App/                    # app shell: checks the session, shows HomePage or LoginPage
  index.css               # global styles (reset, root variables)
  api/                    # Model: API client (shows.ts) and types (no React)
  hooks/                  # shared non-UI hooks: useDebounce, useShowsPage
  tasks/                  # shared business tasks (plain TS): toggleFavorite
  ui/                     # generic UI primitives with no domain knowledge (Chip)
  components/             # shared components that know the domain (ErrorState)
  pages/
    HomePage/
      index.tsx           # the page view
      HomePage.module.css
      HomePage.test.tsx
      logic/
        usePresenter.ts   # the page's presenter: state, effects, handlers
        usePresenter.test.ts
        useSearchParam.ts # local hooks used only by this presenter
        useBrowseState.ts # selected genre and page; reset on a new query
        tasks/            # business logic as plain TS functions (no React)
          getHomeView.ts
          describeResults.ts
          describeRange.ts
      Header/             # child components used once by the page,
      SearchField/        # each in its own folder
      IdleState/
      LoadingState/
      EmptyState/
      GenreFilter/
      ShowCard/           # logic/usePresenter.ts + logic/tasks/formatShow.ts
      UserMenu/           # "Sign in", or the email and "Log out"
    LoginPage/            # the email form; logic/tasks/logIn.ts
      Pagination/         # logic/usePresenter.ts (page buttons state)
  test/
    setup.ts              # Vitest setup: jest-dom matchers, cleanup
```

## API server (`server/`)

A small backend on [Cloudflare Workers](https://workers.cloudflare.com/) (free tier) built with [Hono](https://hono.dev/). It calls TVmaze and does the genre filtering and pagination on the server. The frontend reads its URL from `VITE_API_URL`. Locally, copy `.env.example` to `.env` (it is git-ignored) and change the URL to `http://localhost:8787` to use a local server. The GitHub Pages build gets the deployed URL from `.github/workflows/deploy.yml`.

```
GET /shows?q=<query>&genre=<genre>&page=<page>
→ { query, genre, genres, totalCount, matchCount, page, pageCount, pageSize, firstIndex, items }
```

- `q` is required. `genre` and `page` (default 1) are optional, and a page past the end is clamped to the last page.
- `genres` is counted over all results for `q`, not just the filtered ones, so the chips stay visible while a genre is selected.
- Errors come back as `{ error }` with status 400 (invalid parameters), 404 or 502 (TVmaze failed).
- TVmaze responses are cached in memory for 5 minutes, so changing the page or genre usually doesn't call TVmaze again. Responses also send `Cache-Control: max-age=300`.
- CORS is limited to the origins in `ALLOWED_ORIGINS` in `server/wrangler.jsonc`.

The response types are in `server/src/contract.ts`, and the frontend re-exports them from `src/api/types.ts`. The code follows the same split as the frontend: `app.ts` handles HTTP, `tasks/` holds plain TypeScript business logic that gets its dependencies as arguments, and `tvmaze/` and `cache/` hold the concrete implementations, which are wired together in `index.ts`.

```sh
cd server
npm install
npm run dev        # http://localhost:8787/shows?q=girls
npm run test:run
npm run typecheck
```

Pushing changes under `server/` to `main` deploys the Worker through `.github/workflows/deploy-api.yml`. This needs two repository secrets: `CLOUDFLARE_API_TOKEN` (a token created from the "Edit Cloudflare Workers" template) and `CLOUDFLARE_ACCOUNT_ID`.

## Conventions

- One component per file. Every component, even a small single-use one, is its own folder: `index.tsx` (the view), `Component.module.css` and `Component.test.tsx`.
- Logic lives in the component's `logic/` folder: `logic/usePresenter.ts` holds the state and handlers, and the view only calls `usePresenter()` and renders. A component without logic has no `logic/` folder.
- Business rules are tasks in `logic/tasks/`: plain TypeScript functions with no React that receive their dependencies (such as API modules) as arguments.
- Other code imports a component by its folder (`./ShowCard`), never by its inner files.
- No file is longer than 120 lines.
- Styling uses CSS Modules only. Only resets and root variables go in global CSS.
- Tests sit next to the code they test, as `*.test.ts(x)`.
- Code style and most architecture rules are enforced by Biome (`npm run check`): 2-space indent, single quotes, no semicolons and trailing commas.

## Sign-in and the session cookie

`POST /auth/login` (`{ email }`) starts a session on the server and sets `__Host-sid=<random id>; HttpOnly; Secure; SameSite=None; Partitioned`. `GET /auth/session` returns `{ user }` (`null` for a guest), and `POST /auth/logout` ends the session and clears the cookie. Sessions last 7 days and live in Worker memory (`server/src/sessions/memorySessions.ts`), so a restart signs everyone out.

The app (GitHub Pages) and the API (workers.dev) are different sites, so the cookie is a third-party one: it needs `SameSite=None; Secure`, every auth request is sent with `credentials: 'include'`, and the API answers with `Access-Control-Allow-Credentials`. `Partitioned` (CHIPS) keeps it working in Chrome and Firefox, which block unpartitioned third-party cookies. **Safari blocks third-party cookies altogether, so there sign-in doesn't persist** until the app and the API share a site (for example by serving the app from the Worker). Because the cookie goes with cross-site requests, the API refuses `POST`/`PUT`/`DELETE` from any origin not in `ALLOWED_ORIGINS` (`server/src/originGuard.ts`).
