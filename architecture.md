# Architecture

These rules describe how code in this app is organised. The goal is to keep the
UI separate from the logic, in the spirit of the **MVP (Model–View–Presenter)**
pattern, and to keep business rules separate from React:

| Layer         | Where it lives                    | Responsibility                                                |
| ------------- | --------------------------------- | ------------------------------------------------------------- |
| **Model**     | `src/api/`, `src/hooks/`          | Talking to the API, data types, reusable non-UI hooks         |
| **Tasks**     | `logic/tasks/` of a component     | Business logic: plain TypeScript functions, no framework      |
| **Presenter** | `logic/usePresenter.ts` of a view | State, effects, event handlers; calls tasks and wires deps in |
| **View**      | `index.tsx` of a component folder | Rendering only: takes data from the presenter or props        |

## 1. Folder layout

```
src/
├── api/                      # Model: HTTP client and API types
│   ├── tvmaze.ts
│   └── types.ts
├── hooks/                    # Reusable non-UI hooks (useDebounce, useShowSearch, ...)
│   ├── useDebounce.ts
│   └── useDebounce.test.ts
├── tasks/                    # Business tasks shared by more than one component or hook
│   ├── findShows.ts
│   └── findShows.test.ts
├── ui/                       # App-wide UI primitives that know nothing about the domain
│   ├── Button/
│   ├── Chip/
│   └── Spinner/
├── components/               # App-wide components that know about the domain
│   └── ErrorState/
├── pages/
│   └── HomePage/
│       ├── index.tsx             # the HomePage component itself (the view)
│       ├── HomePage.module.css
│       ├── HomePage.test.tsx
│       ├── logic/                # everything that isn't rendering
│       │   ├── usePresenter.ts
│       │   ├── usePresenter.test.ts
│       │   ├── useSearchParam.ts     # local hooks used only by this presenter
│       │   ├── useGenreFilter.ts
│       │   ├── useGenreFilter.test.ts
│       │   ├── usePagination.ts
│       │   ├── usePagination.test.ts
│       │   └── tasks/                # business logic: plain TS, no React
│       │       ├── countGenres.ts
│       │       ├── countGenres.test.ts
│       │       ├── filterByGenre.ts
│       │       └── filterByGenre.test.ts
│       ├── Header/               # used once by HomePage: its own folder, next to the parent
│       │   ├── index.tsx
│       │   ├── Header.module.css
│       │   └── Header.test.tsx
│       ├── ShowCard/             # used once by HomePage (inside a .map)
│       │   ├── index.tsx
│       │   ├── ShowCard.module.css
│       │   ├── ShowCard.test.tsx
│       │   └── logic/
│       │       ├── usePresenter.ts
│       │       ├── usePresenter.test.ts
│       │       └── tasks/
│       │           ├── formatShow.ts
│       │           └── formatShow.test.ts
│       └── components/           # reused inside HomePage's subtree
│           └── Pagination/
│               ├── index.tsx
│               ├── Pagination.module.css
│               └── Pagination.test.tsx
├── test/
│   └── setup.ts
├── index.css                 # Global resets and CSS variables only
└── main.tsx
```

## 2. Every component lives in its own folder

Two rules apply to **every** component, with no exceptions for small or
single-use ones:

1. **One component per file.** A file defines exactly one React component, and
   that file is always the `index.tsx` of the component's folder. There are no
   flat component files like `HomePage/Header.tsx`, and no second "helper"
   component declared next to the main one in the same file. If you need
   another component, give it its own folder.
2. **Every component has its own folder.** This holds for single-use children
   that live directly in the parent's folder (section 3), not only for
   components in `components/`, `src/components/`, or `src/ui/`. If the
   component has logic, it goes in a `logic/` folder inside the component's
   folder; a component without logic has no `logic/` folder (see section 4).

A component folder is named after the component (PascalCase) and contains:

| File / folder                | Required | Purpose                                                      |
| ---------------------------- | -------- | ------------------------------------------------------------ |
| `index.tsx`                  | yes      | The component itself (the view) and the folder's entry point |
| `Component.module.css`       | yes\*    | The component's styles (CSS Modules only)                    |
| `Component.test.tsx`         | yes      | Tests for the rendered view                                  |
| `logic/usePresenter.ts`      | if logic | The presenter: state, effects, handlers                      |
| `logic/usePresenter.test.ts` | if logic | Tests for the presenter, with `renderHook`                   |
| `logic/useSomething.ts`      | optional | Local hooks the presenter is split into (see section 5)      |
| `logic/tasks/someTask.ts`    | optional | Business tasks the presenter calls (see section 6)           |
| `Child/`                     | optional | Child components that are used once (see section 3)          |
| `components/`                | optional | Child components that are reused in this subtree             |

\* You can skip the CSS module only if the component renders no elements of its
own, for example a component that only composes other components.

The component is written directly in `index.tsx`; there is no separate
`Component.tsx` file and no re-export file. `index.tsx` exports only the public
component (and its props type if other code needs it).

Code outside the folder **always imports the folder itself**, which resolves to
`index.tsx`. It never imports the other files inside it, `logic/` included:

```ts
// ✅ good
import { HomePage } from './pages/HomePage'
import { Chip } from '../../ui/Chip'

// ❌ bad: reaches into another component's internals
import { usePresenter } from './pages/HomePage/logic/usePresenter'
import { countGenres } from './pages/HomePage/logic/tasks/countGenres'
import styles from '../../ui/Chip/Chip.module.css'
```

Use named exports only; don't use default exports.

## 3. Where a child component goes

Answer these questions in order:

1. **Is it used across the whole app (by more than one page or feature)?**
   Put it in a root folder:
   - `src/ui/` holds generic primitives with no domain knowledge: `Button`,
     `Chip`, `Spinner`, `Input`. They take only plain props such as `label`,
     `onClick`, and `selected`, and never import from `api/` or use domain types
     like `Show`.
   - `src/components/` holds shared components that know about the domain:
     `ErrorState`, or a `ShowCard` if several pages show it.
2. **Is it reused inside one parent's subtree (rendered from two or more places
   in it)?** Put it in that parent's `components/` folder, as a full component
   folder: `HomePage/components/Pagination/`.
3. **Is it used only once, by one parent?** Put it in its own component folder
   directly inside the parent's folder: `HomePage/Header/`, with `index.tsx`,
   `Header.module.css`, `Header.test.tsx`, and a `logic/` folder if it has
   logic. It isn't exported from the parent's `index.tsx`; it's an
   implementation detail.

"Used once" means a single place in the JSX. A component rendered inside one
`.map()` is still used once.

A single-use child is a full component folder like any other (section 2). If
it needs its own state or effects, add `logic/usePresenter.ts` to its folder.
A folder holds only one `logic/usePresenter.ts`, so giving every component a
folder keeps the rule "one presenter per view".

### Moving a component when its usage changes

- A single-use child starts being used in a second place in the subtree → move
  its folder into the parent's `components/`.
- A component in `Page/components/` is needed by another page → move it to
  `src/components/` (or to `src/ui/` if it has no domain knowledge).
- Never import from another component's `components/` folder. If you need
  something from there, move it up.

A component's `logic/` folder always moves with it.

## 4. Logic lives in `logic/`

The view (`index.tsx`) only renders. It:

- calls **one** hook, `usePresenter()` (or `usePresenter(props)` when the
  presenter needs the props), imported from `./logic/usePresenter`, and
  nothing else (`useState`, `useEffect`, and data hooks go in the presenter),
  or no hook at all if it has no logic;
- maps the presenter's values to JSX and connects event handlers;
- doesn't compute derived data (filtering, slicing, counting); the presenter
  returns it ready to render;
- never imports anything else from `logic/` (local hooks, tasks).

The presenter (`logic/usePresenter.ts`):

- holds the state, effects, and event handlers;
- composes hooks: shared ones from `src/hooks/` (like `useDebounce`) and local
  ones from its own `logic/` folder (like `useSearchParam`);
- delegates business rules to **tasks** (section 6) and passes them their
  dependencies; it doesn't implement business rules inline;
- reaches `src/api/` only through hooks or by handing an API module to a task;
  it never calls `fetch` directly;
- returns a plain object with everything the view needs, already derived;
- never returns JSX and never imports CSS.

A `logic/` folder is optional. Components without logic (most `ui/`
primitives, many single-use children) don't have one; they just render their
props. Add `logic/usePresenter.ts` as soon as a component needs state,
effects, or derived data. When the presenter needs the component's props,
declare the props type in `logic/usePresenter.ts` and call
`usePresenter(props)` from the view.

### Example: HomePage

```ts
// src/pages/HomePage/logic/usePresenter.ts
import { useDebounce } from '../../../hooks/useDebounce'
import { useShowSearch } from '../../../hooks/useShowSearch'

import { useGenreFilter } from './useGenreFilter'
import { usePagination } from './usePagination'
import { useSearchParam } from './useSearchParam'

const PAGE_SIZE = 3

export function usePresenter() {
  const [query, setQuery] = useSearchParam('q') // local: syncs with ?q= in the URL
  const debouncedQuery = useDebounce(query, 400) // shared
  const { shows, status, error } = useShowSearch(debouncedQuery) // shared

  // local: holds the selected genre and calls the countGenres and
  // filterByGenre tasks; resets the selection when `shows` changes
  const { genres, selectedGenre, selectGenre, filteredShows } =
    useGenreFilter(shows)

  // local: goes back to page 1 whenever `filteredShows` changes
  const { page, pageCount, setPage, pageItems } = usePagination(
    filteredShows,
    PAGE_SIZE,
  )

  return {
    query,
    changeQuery: setQuery,
    genres,
    selectedGenre,
    selectGenre,
    visibleShows: pageItems,
    page,
    pageCount,
    setPage,
    status,
    error,
  }
}
```

The presenter reads like a summary of the page's behaviour: each step is a
small hook in `logic/` or in `src/hooks/`, and the rules behind each step are
tasks in `logic/tasks/`. A local hook keeps the React state and leaves the
business rule to a task:

```ts
// src/pages/HomePage/logic/useGenreFilter.ts
import { useMemo, useState } from 'react'

import type { Show } from '../../../api/types'

import { countGenres } from './tasks/countGenres'
import { filterByGenre } from './tasks/filterByGenre'

export function useGenreFilter(shows: Show[]) {
  const [selectedGenre, selectGenre] = useState<string | null>(null)
  const [prevShows, setPrevShows] = useState(shows)

  // A new search clears the selection.
  if (shows !== prevShows) {
    setPrevShows(shows)
    selectGenre(null)
  }

  const genres = useMemo(() => countGenres(shows), [shows])
  const filteredShows = useMemo(
    () => filterByGenre(shows, selectedGenre),
    [shows, selectedGenre],
  )

  return { genres, selectedGenre, selectGenre, filteredShows }
}
```

```tsx
// src/pages/HomePage/index.tsx
import { ErrorState } from '../../components/ErrorState'
import { Chip } from '../../ui/Chip'
import { Spinner } from '../../ui/Spinner'

import { Pagination } from './components/Pagination'
import { Header } from './Header'
import { usePresenter } from './logic/usePresenter'
import { ShowCard } from './ShowCard'

import styles from './HomePage.module.css'

export function HomePage() {
  const {
    query,
    changeQuery,
    genres,
    selectedGenre,
    selectGenre,
    visibleShows,
    page,
    pageCount,
    setPage,
    status,
    error,
  } = usePresenter()

  return (
    <main className={styles.page}>
      <Header query={query} onQueryChange={changeQuery} />

      {status === 'loading' && <Spinner />}
      {status === 'error' && <ErrorState message={error} />}

      {status === 'success' && (
        <>
          <div className={styles.genres}>
            <Chip
              label="All"
              selected={selectedGenre === null}
              onClick={() => selectGenre(null)}
            />
            {genres.map((genre) => (
              <Chip
                key={genre.name}
                label={genre.name}
                selected={genre.name === selectedGenre}
                onClick={() => selectGenre(genre.name)}
              />
            ))}
          </div>

          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
          <ul className={styles.list}>
            {visibleShows.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </ul>
          <Pagination page={page} pageCount={pageCount} onChange={setPage} />
        </>
      )}
    </main>
  )
}
```

Notes on this example:

- `Header` and `ShowCard` are each used in one place → their own folders
  directly in `HomePage/` (`HomePage/Header/`, `HomePage/ShowCard/`).
- `Pagination` is rendered twice (above and below the list) → it goes in
  `HomePage/components/Pagination/`.
- `Chip` and `Spinner` are generic → `src/ui/`. `ErrorState` is shared by
  pages → `src/components/`.
- The view imports only `./logic/usePresenter` from `logic/`.

### Example: a single-use child without logic

```tsx
// src/pages/HomePage/Header/index.tsx
import styles from './Header.module.css'

type HeaderProps = {
  query: string
  onQueryChange: (value: string) => void
}

export function Header({ query, onQueryChange }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>TV Shows Explorer</h1>
      <input
        className={styles.search}
        type="search"
        aria-label="Search shows"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
    </header>
  )
}
```

`Header` has no state or derived data, so its folder has no `logic/`. It is
still a folder (`HomePage/Header/`), not a flat `HomePage/Header.tsx`.

### Example: a UI primitive

```tsx
// src/ui/Chip/index.tsx
import styles from './Chip.module.css'

export type ChipProps = {
  label: string
  selected?: boolean
  onClick: () => void
}

export function Chip({ label, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={selected ? `${styles.chip} ${styles.selected}` : styles.chip}
      aria-pressed={selected}
      onClick={onClick}
    >
      {label}
    </button>
  )
}
```

## 5. At most 120 lines per file

No file may be longer than **120 lines**, counted as formatted by Biome and
including imports. This applies to every source file: components, presenters,
hooks, tasks, API modules, CSS modules, and tests. When a file grows past the
limit, split it:

| What is too long        | How to split it                                                          |
| ----------------------- | ------------------------------------------------------------------------ |
| A view (`index.tsx`)    | Extract child components and place them by the rules in section 3        |
| `logic/usePresenter.ts` | Extract local hooks into `logic/` and business rules into `logic/tasks/` |
| A local or shared hook  | Extract smaller hooks, or move the rules it applies into tasks           |
| A task                  | Split it into smaller tasks in the same `tasks/` folder and compose them |
| A CSS module            | Usually means the component needs children; their styles move with them  |
| A test file             | Test extracted hooks, tasks, and children in their own test files        |
| An `api/` module        | One file per resource (`shows.ts`, `people.ts`), types in `types.ts`     |

### Local hooks

A presenter can import:

- **Local hooks from its own `logic/` folder**: `HomePage/logic/useSearchParam.ts`,
  `HomePage/logic/useGenreFilter.ts`. Use these for React logic that belongs
  to this component only.
- **Shared hooks from `src/hooks/`**: `useDebounce`, `useShowSearch`. Use these
  for React logic that more than one component needs.

Rules for local hooks:

- Each local hook is one file in `logic/` named after the hook
  (`useGenreFilter.ts`), with its own `useGenreFilter.test.ts` when it has
  logic worth testing.
- Only the presenter of the same `logic/` folder (or another local hook in it)
  imports a local hook. The view never calls them, and other folders never
  import them.
- A local hook holds React state and effects. When it starts applying a
  business rule (counting, filtering, validating, deciding), move that rule
  into a task.
- When a second component needs a local hook, move it to `src/hooks/`.

## 6. Business logic lives in `logic/tasks/`

A **task** is one unit of business logic: what the app does, independent of
how it's shown or which framework runs it. "Log the user out", "count the
genres of these shows", "filter shows by genre", and "format a show for a card"
are tasks. If a presenter or hook does more than wire state to the view, the
"more" is probably a task.

Tasks are **framework-agnostic**: plain TypeScript functions.

- One task per file, named after the function: `logic/tasks/logout.ts` exports
  `logout`. The file may also export the types of the task's input, output,
  and dependencies.
- No React: a task never imports `react`, never calls hooks, and never touches
  component state. It takes values as arguments and returns a result (or a
  `Promise` of one).
- No direct I/O: a task never calls `fetch`, `localStorage`, `window`, or an
  `src/api/` function itself. It declares what it needs as an **abstraction**
  (a TypeScript type describing the dependency) and receives the concrete
  implementation as an argument.
- It may import domain types with `import type` (for example `Show` from
  `src/api/types.ts`) and other tasks from the same `tasks/` folder or from
  `src/tasks/`.
- It never imports from the view, the presenter, local hooks, or CSS.

### Depending on abstractions

A task owns the interface of what it depends on; the presenter decides what
implements it. This keeps the task testable with plain fakes and lets the
implementation change (another API, a mock, storage) without touching the
business rule.

```ts
// src/pages/ProfileMenu/logic/tasks/logout.ts
export type AuthApi = {
  revokeSession: (token: string) => Promise<void>
}

export type TokenStore = {
  read: () => string | null
  clear: () => void
}

export type LogoutDeps = {
  auth: AuthApi
  tokens: TokenStore
}

export async function logout({ auth, tokens }: LogoutDeps): Promise<void> {
  const token = tokens.read()
  // Forget the token locally even if the server call fails.
  try {
    if (token) await auth.revokeSession(token)
  } finally {
    tokens.clear()
  }
}
```

The presenter wires the concrete implementations in and keeps the React side
(state, effects, handlers):

```ts
// src/pages/ProfileMenu/logic/usePresenter.ts
import { useState } from 'react'

import { authApi } from '../../../api/auth'
import { tokenStore } from '../../../api/tokenStore'

import { logout } from './tasks/logout'

export function usePresenter() {
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout({ auth: authApi, tokens: tokenStore })
    setIsLoggingOut(false)
  }

  return { isLoggingOut, logout: handleLogout }
}
```

`authApi` and `tokenStore` only need to match the `AuthApi` and `TokenStore`
shapes; the task never imports them. Concrete implementations live in
`src/api/` (or another Model module), not in `tasks/`.

### Pure tasks

Many tasks have no dependencies at all; they take data and return data:

```ts
// src/pages/HomePage/logic/tasks/countGenres.ts
import type { Show } from '../../../../api/types'

export type GenreOption = { name: string; count: number }

export function countGenres(shows: Show[]): GenreOption[] {
  const counts = new Map<string, number>()
  for (const show of shows) {
    for (const genre of show.genres) {
      counts.set(genre, (counts.get(genre) ?? 0) + 1)
    }
  }
  return [...counts]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
```

### Shared tasks

- A task in `logic/tasks/` is private to its component: only that
  component's presenter, local hooks, and other tasks in the same folder
  import it.
- When a second component, or a shared hook in `src/hooks/`, needs a task,
  move it to `src/tasks/`. Shared tasks follow the same rules: plain
  TypeScript, dependencies passed in as arguments, a test next to each one.
- Shared tasks are imported by presenters, local hooks, shared hooks, and
  other tasks. Views, `ui/`, and `api/` never import them.

`findShows` is a shared task. It declares the search it needs as a type and
never imports the TVmaze client:

```ts
// src/tasks/findShows.ts
import type { SearchResult, Show } from '../api/types'

/** Anything that can search shows: the TVmaze client, a fake in tests. */
export type SearchShows = (
  query: string,
  signal?: AbortSignal,
) => Promise<SearchResult[]>

export type FindShowsDeps = {
  search: SearchShows
  signal?: AbortSignal
}

/** Shows matching `query`, in the order the search ranks them. */
export async function findShows(
  query: string,
  { search, signal }: FindShowsDeps,
): Promise<Show[]> {
  const results = await search(query, signal)
  return results.map((result) => result.show)
}
```

The shared hook `useShowSearch` passes in the real client and keeps the React
side (the `AbortController`, the loading and error state, retries):

```ts
// src/hooks/useShowSearch.ts (excerpt)
import { searchShows } from '../api/tvmaze'
import { findShows } from '../tasks/findShows'

findShows(trimmed, { search: searchShows, signal: controller.signal })
```

## 7. Model layer: `api/` and `hooks/`

- `src/api/` holds plain TypeScript with no React: request functions, response
  types, and other concrete implementations that tasks depend on. Every
  request function accepts an `AbortSignal` so callers can cancel it.

  ```ts
  // src/api/tvmaze.ts
  import type { SearchResult } from './types'

  const BASE_URL = 'https://api.tvmaze.com'

  export async function searchShows(
    query: string,
    signal?: AbortSignal,
  ): Promise<SearchResult[]> {
    const response = await fetch(
      `${BASE_URL}/search/shows?q=${encodeURIComponent(query)}`,
      { signal },
    )
    if (!response.ok) {
      throw new Error(`TVmaze request failed: ${response.status}`)
    }
    return response.json()
  }
  ```

- `src/hooks/` holds reusable hooks that aren't tied to one view:
  `useDebounce`, and `useShowSearch`, which runs the `findShows` task with
  the TVmaze client, an `AbortController`, and the loading, error, and success
  states. Presenters use these hooks; views never import them. A shared hook
  may call tasks from `src/tasks/`, but never tasks from a component's
  `logic/tasks/`.

## 8. Dependency rules

Imports may only point "down" this list:

```
pages  →  components  →  ui
  │           │
  └─────┬─────┘
        ▼
  logic/usePresenter  →  logic/use*  →  logic/tasks  →  src/tasks
        │                    │               │
        └────────┬───────────┘               │ (import type only)
                 ▼                           ▼
               hooks  →  api  ─────────►  api/types
```

- `ui/` imports nothing from `api/`, `hooks/`, `tasks/`, `components/`, or
  `pages/`.
- `components/` never imports from `pages/`.
- `api/` imports nothing from React or from the rest of the app.
- Shared hooks (`src/hooks/`) may import shared tasks (`src/tasks/`).
- Tasks (`logic/tasks/`, `src/tasks/`) import nothing from React, `hooks/`,
  views, presenters, or local hooks, and only types from `api/`.
- A child never imports from its parent. Data goes down through props, and
  events come up through callbacks.
- A view imports `./logic/usePresenter`, child components, and its CSS module.
  It never imports from `hooks/`, `tasks/`, or `api/` (type-only imports of API
  types for props are fine), and never imports local hooks or tasks from its
  own `logic/` folder.
- Local hooks (`HomePage/logic/usePagination.ts`) and tasks
  (`HomePage/logic/tasks/countGenres.ts`) are imported only from inside the
  same `logic/` folder.

## 9. Tests

- Every component folder has `Component.test.tsx`, which tests what the user
  sees and does with Testing Library (queries by role or label, not by class
  name).
- Every `logic/usePresenter.ts` has `logic/usePresenter.test.ts`, which tests
  the logic with `renderHook` and `act`, without rendering any markup.
- Every task has a test next to it (`logic/tasks/logout.test.ts`). Tasks are
  plain functions, so their tests are plain too: no `renderHook`, no `render`,
  and no global `fetch` mocks. Pass fakes that match the task's dependency
  types:

  ```ts
  // src/pages/ProfileMenu/logic/tasks/logout.test.ts
  import { logout } from './logout'

  describe('logout', () => {
    it('clears the token even if revoking it fails', async () => {
      const tokens = { read: () => 'abc', clear: vi.fn() }
      const auth = { revokeSession: vi.fn().mockRejectedValue(new Error()) }

      await expect(logout({ auth, tokens })).rejects.toThrow()
      expect(tokens.clear).toHaveBeenCalled()
    })
  })
  ```

- A presenter test may mock its tasks (`vi.mock('./tasks/logout')`) to check
  only the wiring and the state, since the rules are covered by task tests.
- A view test may mock its presenter to check each state (loading, error,
  empty, results) in isolation:

  ```tsx
  // src/pages/HomePage/HomePage.test.tsx
  import { render, screen } from '@testing-library/react'

  import { HomePage } from '.'
  import { usePresenter } from './logic/usePresenter'

  vi.mock('./logic/usePresenter')

  const basePresenter = {
    query: '',
    changeQuery: vi.fn(),
    genres: [],
    selectedGenre: null,
    selectGenre: vi.fn(),
    visibleShows: [],
    page: 1,
    pageCount: 1,
    setPage: vi.fn(),
    status: 'idle',
    error: null,
  } satisfies ReturnType<typeof usePresenter>

  describe('HomePage', () => {
    it('shows a spinner while loading', () => {
      vi.mocked(usePresenter).mockReturnValue({
        ...basePresenter,
        status: 'loading',
      })
      render(<HomePage />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })
  ```

- Single-use children are component folders, so they have their own
  `Component.test.tsx` too (`HomePage/Header/Header.test.tsx`). The parent's
  test doesn't need to repeat what the child's test already covers.

## 10. Checklist for a new component

- [ ] Decide where it goes: `ui/`, `components/`, the parent's `components/`,
  or a folder directly inside the parent's folder (section 3).
- [ ] Create the folder with `index.tsx` (the component itself),
  `Component.module.css`, and `Component.test.tsx`, even if the component is
  small or used once.
- [ ] Keep one component per file: `index.tsx` defines only this component.
- [ ] If it has logic, put it in `logic/usePresenter.ts` and test it in
  `logic/usePresenter.test.ts`.
- [ ] Put business rules in tasks under `logic/tasks/`: plain TypeScript, no
  React, dependencies passed in as abstractions, each with its own test.
- [ ] Make sure the view calls only `usePresenter()` / `usePresenter(props)`
  (or no hook at all) and renders.
- [ ] Keep every file at 120 lines or fewer; split views into children,
  presenters into local hooks and tasks (section 5).
- [ ] Import other components only by their folder path, never their inner
  files.
- [ ] Run `npm run check` and `npm run test:run`.

## 11. How these rules are enforced

`npm run check` runs Biome, which checks most of these rules automatically. The
config is in `biome.json`; a custom GritQL rule is in `biome-plugins/`.

| Rule                                                     | Biome check                                                   |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| At most 120 lines per file (TS, TSX, CSS)                | `style/noExcessiveLinesPerFile`                               |
| Named exports only (except `*.config.ts`)                | `style/noDefaultExport`                                       |
| Import a component by its folder, not its inner files    | `style/noRestrictedImports`, all files                        |
| A view imports only `./logic/usePresenter` from `logic/` | `style/noRestrictedImports`, override for `src/**/index.tsx`  |
| A view calls only `usePresenter()`                       | plugin `biome-plugins/view-only-presenter.grit`               |
| Tasks import no React, hooks, or API implementations     | `style/noRestrictedImports`, override for `src/**/tasks/**`   |
| `ui/` doesn't depend on app code                         | `style/noRestrictedImports`, override for `src/ui/**`         |
| `components/` never imports from `pages/`                | `style/noRestrictedImports`, override for `src/components/**` |
| `api/` has no React or app imports                       | `style/noRestrictedImports`, override for `src/api/**`        |

Things to know when changing the config:

- When several overrides match a file, the last one **replaces** the
  `noRestrictedImports` options of the others instead of merging them. That's
  why every override repeats the "import by folder" pattern. Keep it in each
  new override too.
- Import patterns match the import path as written. A relative import that
  doesn't name the folder, like `../HomePage/logic/usePresenter` from a
  sibling page, isn't caught.
- The view rules apply to `index.tsx` files. Since every component lives in
  an `index.tsx` (section 2), they cover every component; a component in any
  other file escapes them, which is one more reason not to write one.

These rules can't be checked by Biome, so they stay with code review and the
checklist above:

- every component folder has its `.module.css` and `.test.tsx` files;
- a file defines only one component, and only in `index.tsx` (no flat
  component files like `Header.tsx`);
- a component is placed by how often it's used (section 3);
- a child never imports from its parent;
- a presenter returns no JSX and imports no CSS;
- business rules live in tasks, not inline in presenters or hooks;
- a task receives its dependencies as arguments instead of importing them.
