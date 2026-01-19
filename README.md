# DOODLE CHAT FRONTEND - DAN COZMUTA

Angular 21 chat application frontend implementation with real-time message updates, responsive design, and accessible user interface.

# WHY ANGULAR

I chose Angular because it is the framework I have used the most, allowing me to focus on delivering a clean, well-structured solution rather than framework setup or experimentation.

## SETUP

### INSTALLATION

```
npm install
npm start
```

The application will be available at `http://localhost:4200`

### ENVIRONMENT CONFIGURATION

RENAME `src/environments/environment.example.ts` TO `src/environments/environment.ts` AND UPDATE THE `authToken` VALUE WITH YOUR API TOKEN.

**NOTE:** The backend API must be running on `http://localhost:3000` (or update the `apiUrl` in the environment file accordingly).

## FEATURES

- Incremental message fetching with polling
- Clear distinction between sent and received messages
- Responsive layout (mobile and desktop)
- Accessible UI (semantic HTML)
- Performance optimizations (OnPush change detection, trackBy)
- Environment-based configuration (no tokens committed)

## ARCHITECTURE

The application follows Angular best practices with a clean, scalable structure:

```
src/app/
├── features/
│   └── chat/              # Chat feature module
│       ├── components/    # Feature-specific components
│       ├── services/      # Business logic services
│       └── models/        # TypeScript interfaces
├── shared/
│   └── ui/                # Reusable UI components
│       ├── button/
│       └── textarea/
└── core/
    └── services/          # Core services (future use)
```

## TESTING

The project uses a simple testing pyramid:

- Unit tests: Vitest (fast, logic-focused tests)
- Component tests: Testing Library (DOM-focused component behavior)
- E2E tests: Playwright (happy-path user journeys)

### RUNNING TESTS

Unit + component tests (Vitest):

npm test            # watch mode (TDD-friendly)
npm run test:run    # single run (CI-style)
npm run test:coverage


E2E tests (Playwright):

# first time only (installs browser binaries)
npx playwright install chromium

# run e2e tests (starts the app on port 4201)
npm run e2e


### VISUAL SNAPSHOTS (PLAYWRIGHT)

This repo includes a visual regression snapshot for the chat UI.

Create/update snapshots:
npm run e2e -- --update-snapshots

Open playwright
npx playwright test --ui

Baseline images live next to the test file (for example: `e2e/chat.spec.ts-snapshots/`).
Failure artifacts are written to `test-results/` / `playwright-report/` and should not be committed.

## TECH STACK

- Angular 21
- TypeScript
- RxJS (for reactive programming and polling)
- SCSS (with CSS variables for theming)


