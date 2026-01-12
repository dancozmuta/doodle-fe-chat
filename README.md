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

## TECH STACK

- Angular 21
- TypeScript
- RxJS (for reactive programming and polling)
- SCSS (with CSS variables for theming)
