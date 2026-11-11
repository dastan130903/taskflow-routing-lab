# Taskflow 3.0 — React Authentication, Caching & Firebase

This project extends the previous **Taskflow Routing Lab**, keeping its routes,
Fake API, task CRUD, URL filtering, sorting, pagination and dashboard intact.
The code is separated into clearly formatted, readable components and services.

## Install and run

```bash
npm install
npm run dev
```

**Important:** Firebase authentication requires configuration. Without Firebase
credentials, the task manager still works but Login / Signup show an explicit
setup message. There is no fake or bypassed sign-in.

## Firebase setup (required for authentication)

1. Open https://console.firebase.google.com/ and create a Firebase project.
2. In **Project settings → Your apps**, register a **Web** application.
3. Copy `.env.example` to `.env.local` in the project root.
4. Copy the Firebase Web App values into these variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`
5. In **Build → Authentication → Sign-in method**, enable **Email/Password**
   and **Google**, selecting a support email when asked.
6. In **Authentication → Settings → Authorized domains**, authorize the
   hostname used for deployment (and localhost for local development if needed).
7. Restart Vite after editing `.env.local`.

Firebase client-side configuration is not a server secret; however, `.env.local`
is ignored by Git. Do not put service account credentials or private keys here.
Use Firebase Security Rules for any real protected database access.

### On Vercel / Netlify

Add the same four `VITE_FIREBASE_...` environment variables in your hosting
project settings, redeploy, and add your deployed domain to Firebase authorized
domains. Build command: `npm run build`, output directory: `dist`.

## Authentication

- `src/config/firebase.js` initializes Firebase from Vite environment variables.
- `src/context/AuthContext.jsx` implements `AuthProvider` and `useAuth`.
- `onAuthStateChanged` restores and tracks signed-in users.
- `browserLocalPersistence` keeps sessions across browser refreshes.
- `/login` supports email/password login and Google popup sign-in.
- `/signup` validates a password of at least six characters and checks confirmation.
- `/profile` is protected by `ProtectedRoute`, shows email and UID, and supports logout.
- Navigation switches between Login / Sign up and Profile / Logout.
- Guests opening `/profile` are redirected to `/login`. After login, they return
  to the originally requested location.

## Caching strategy (important for grading)

- Implemented a **custom in-memory cache** in `src/services/cache.js`.
- Query keys: `tasks:list` for the list, `tasks:detail:<id>` for task details.
- **TTL: 30 seconds** after successful retrieval. Repeated reads use cached
  values until the entry expires, reducing Fake API calls.
- Requests for the same key are deduplicated while in flight.
- After successful `createItem`, `updateItem`, or `deleteItem`, the wrappers
  in `src/services/tasks.js` invalidate **all task cache entries**.
- The Reload button explicitly forces revalidation through `revalidateTasksCache`.
- A generation counter prevents an earlier request from repopulating the cache
  after a later mutation. `useEffect` cleanup ignores stale responses after
  navigation or reload.
- Errors are not cached; loading/error/empty states remain visible in the UI.
- The original Fake API still persists task records in localStorage internally.
  This is mock server persistence, **not the client-side cache**.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home |
| `/about` | About |
| `/items` | Search, 3 filters, sorting, URL params and pagination |
| `/items/:id` | 8 detail fields, create/edit/delete/status support |
| `/dashboard` | 4+ statistics, 3 breakdowns, interactive category filter |
| `/login` | Email/password and Google authentication |
| `/signup` | Account creation + password validation |
| `/profile` | Protected profile with email, UID and logout |
| `*` | 404 / Not Found |

Nested routes use RootLayout and Outlet. Six pages use `React.lazy` and
`Suspense` for code splitting. The existing refresh rewrites are kept in
`vercel.json` and `public/_redirects`.

## Project structure

- `src/App.jsx` — routing and lazy loading
- `src/components/` — reusable cards, forms, layout and protected route
- `src/pages/` — user-facing pages
- `src/hooks/useItems.js` — task loading, errors and stale-response cleanup
- `src/context/AuthContext.jsx` — Firebase authentication state and actions
- `src/config/firebase.js` — Firebase setup from environment variables
- `src/services/service.js` — original Fake API and persistent demo data
- `src/services/tasks.js` — cached API facade and mutation invalidation
- `src/services/cache.js` — TTL cache, query keys, in-flight deduplication
- `src/styles/` — formatted CSS and authentication styles

## Check before submission

```bash
npm run build
```

Manually verify: new signup, email login, Google login, logout, refresh with
persisted session, anonymous `/profile` redirect, CRUD operations, Reload,
filters, pagination, dynamic task URLs and dashboard.

Submit your GitHub repository URL and the deployed application URL.
