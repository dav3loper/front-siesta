# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Bootstrapped with Create React App (react-scripts 5.0.1).

- `npm start` — dev server at http://localhost:3000
- `npm test` — Jest in interactive watch mode (via react-scripts). To run once/non-interactively: `CI=true npm test`. To run a single file: `npm test -- src/path/to/File.test.tsx`
- `npm run build` — production build
- There is no lint script; ESLint runs as part of `react-scripts start`/`build` using the `eslintConfig` block in `package.json` (`react-app`, `react-app/jest`)
- No test files exist yet in `src/` — when adding tests, colocate them next to the code under test (CRA convention: `*.test.tsx`)

Requires a `.env` (see `.env.example`) with the `REACT_APP_FIREBASE_*` keys for the Firebase project (Auth + Firestore) this build talks to.

## Architecture

There is no backend in this repo (or anywhere else) — the app talks directly to Firebase (Authentication + Firestore) from the client. It follows a lightweight ports-and-adapters split under `src/`:

- **`src/domain/`** — one folder per bounded concept (`Login`, `Movie`, `Dashboard`, `Vote`, `User`). Each contains plain data types/entities (e.g. `Movie.tsx`, `User.tsx`) and repository *interfaces* (e.g. `MovieRepository.tsx`) that declare the operations needed, independent of how data is stored.
- **`src/infrastructure/`** — mirrors the domain folders and provides concrete implementations of the repository interfaces, e.g. `FirebaseMovieRepository implements MovieRepository`, using the Firestore client SDK. `src/infrastructure/firebaseApp.ts` is the single place the Firebase app/`auth`/`db` singletons are initialized (from `REACT_APP_FIREBASE_*` env vars) — every other infrastructure file imports `auth`/`db` from there. `src/infrastructure/Vote/nextUnvotedMovie.ts` holds the "next unvoted movie for the current user's group" query logic shared by both `Vote/FirebaseVoteRepository` and `Dashboard/FirebaseVoteRepository` (same method, two narrower domain interfaces).
- **`src/sections/`** — the UI, one folder per screen/feature (`Dashboard`, `Login`, `Movie`, `List`, `Layout`). Each screen component receives its repositories as props (constructor-injection style) rather than importing infrastructure directly.
- **`*Factory.tsx`** files (one per section, e.g. `MovieDetailFactory.tsx`, `DashboardFactory.tsx`, `LoginFactory.tsx`) are the composition root for that screen: they instantiate the concrete `infrastructure` repositories and wire them into the section component. Routes in `App.tsx` call `SomeFactory.create()` to get the element — this is the place to look first when tracing how a screen gets its dependencies.

When adding a new feature, follow this same three-step shape: domain interface + entity → infrastructure implementation → section component wired up via a Factory.

Firestore collections (`filmFestivals`, `movies`, `groups`, `users`, `votes`) and the security rules (`firestore.rules`, deployed via `firebase deploy --only firestore:rules` with `firebase.json`) are documented in the plan this migration was implemented from; there's no ORM/schema file in the repo, so check the `Firebase*Repository` classes for the exact field names each collection expects.

### Auth

- Login is Firebase Authentication (email/password). Access is restricted by which accounts exist in the Firebase project — there is no in-app allowlist — so new users are provisioned by creating their Auth account and a matching `users/{uid}` Firestore profile doc (`userName`, `groupId`, `groupName`) by hand in the console, not through app UI.
- `src/sections/Login/UseToken.tsx` is a hook reading/writing the full `User` object (Firebase ID token + resolved profile) in `localStorage` (key `token`), so it's shared across tabs. `PrivateRoutes.tsx` and `App.tsx` gate on its presence.
- One logged-in account submits votes on behalf of their whole group in a single batch (see `MovieDetail.tsx`'s `voteList`) — Firestore repository methods still take a `token` parameter to match the unchanged domain interfaces, but Firestore itself relies on `auth.currentUser`/security rules, not that parameter; don't be surprised to see it unused inside a `Firebase*Repository`.
- `src/infrastructure/Fetcher.tsx` is a leftover `fetch`-interceptor from the pre-Firebase REST backend; it was never wired into `App.tsx`/routes even back then and is still unused — don't build on it without checking first.

### Styling

SCSS Modules per component (`Component.module.scss` alongside `Component.tsx`), via `sass` devDependency.
