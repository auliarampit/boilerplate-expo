# Expo React Native Boilerplate

A production-ready starter kit for React Native apps using Expo. Built with modern tooling and a clean architecture that's easy to understand, extend, and strip down.

**Stack:** React Native 0.79 · Expo 53 · TypeScript 5.8 · Redux Toolkit · React Query · NativeWind · React Navigation v7 · i18next · Zod

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Architecture Overview](#architecture-overview)
- [Environment Variables](#environment-variables)
- [Adding a New Feature](#adding-a-new-feature)
- [State Management](#state-management)
- [Authentication Flow](#authentication-flow)
- [Theming](#theming)
- [Internationalization](#internationalization)
- [Plugins](#plugins)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Scripts Reference](#scripts-reference)
- [Dependencies](#dependencies)

---

## Quick Start

**Prerequisites:** Node.js 18+, Expo CLI, iOS Simulator or Android Emulator

```bash
# 1. Clone and install
git clone <repository-url>
cd boilerplate-expo
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your API base URL (minimum required)

# 3. Start
npm start
```

Then press `i` for iOS, `a` for Android, or `w` for web in the Expo terminal.

> **Note:** Plugins that use native modules (biometrics, social login) require a **development build** and won't work in Expo Go. Run `npx expo run:ios` or `npx expo run:android` to create one.

---

## Project Structure

```
boilerplate-expo/
├── App.tsx                   # Entry point — providers & navigation root
├── app.json                  # Expo config
├── .env.example              # Environment variables template
├── tailwind.config.js        # NativeWind/Tailwind configuration
└── src/
    ├── components/           # Shared UI components & app-level providers
    ├── config/               # Jest setup files
    ├── features/             # Screen modules (vertical slices)
    │   ├── auth/             #   Login, Register, ForgotPassword
    │   ├── home/             #   Home screen
    │   ├── profile/          #   Profile screen
    │   └── settings/         #   Settings screen
    ├── hooks/                # Custom React hooks
    ├── i18n/                 # Translations (EN/ID) + i18next config
    ├── navigation/           # React Navigation stack setup
    ├── plugins/              # Optional feature modules (delete if unused)
    │   ├── biometrics/       #   Face ID / fingerprint
    │   ├── push-notifications/ # Push notification setup
    │   ├── social-login/     #   Google, Apple, Facebook OAuth
    │   └── sentry/           #   Error tracking
    ├── services/
    │   └── apiClient.ts      # Axios HTTP client (typed, with interceptors)
    ├── store/                # Redux Toolkit — global UI state
    │   └── slices/           #   authSlice, appSlice
    ├── types/                # Shared TypeScript types
    └── utils/                # Constants, helpers, validation schemas
```

### Feature module anatomy

Each feature under `src/features/` follows the same structure:

```
features/auth/
├── components/       # Components used only within this feature
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── screens/          # Screen components (registered in navigation)
│   ├── LoginScreen.tsx
│   ├── RegisterScreen.tsx
│   └── ForgotPasswordScreen.tsx
└── index.ts          # Public exports for this feature
```

---

## Architecture Overview

### Provider stack (App.tsx)

```
App
└── ErrorBoundary          ← catches unhandled errors, reports to Sentry
    └── Redux Provider     ← global auth + app state
        └── QueryProvider  ← React Query (server state + caching)
            └── ThemeProvider  ← dark/light mode
                └── NetworkProvider  ← online/offline detection
                    └── ToastProvider  ← in-app toast notifications
                        └── RootNavigator  ← auth-gated navigation
```

### State management split

| State type | Tool | Example |
|---|---|---|
| Server data (API responses) | React Query (`useAuthQueries`) | user profile, preferences |
| Global UI state | Redux Toolkit | `isAuthenticated`, `isOnline` |
| Local component state | `useState` / custom hooks | form inputs, modal visibility |

### Two auth hooks — when to use which

- **`useAuth`** — reads Redux auth state (`isAuthenticated`, `user`, `token`) and provides raw `login`/`logout` actions. Use this when you need to read auth state anywhere in the app.
- **`useAuthQueries`** exports (`useLogin`, `useRegister`, `useLogout`, etc.) — React Query mutations that wrap `useAuth` and add toast notifications + query invalidation. Use these in screens.

### Path alias

All imports use `@/` as an alias for `src/`:

```ts
import { apiClient } from '@/services/apiClient'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/Button'
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in your values. All variables are prefixed with `EXPO_PUBLIC_` so they are accessible in client-side code.

```env
# Required
EXPO_PUBLIC_API_BASE_URL=https://api.yourapp.com

# Optional — only needed if you use the corresponding plugin
EXPO_PUBLIC_SENTRY_DSN=
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=
EXPO_PUBLIC_FACEBOOK_CLIENT_ID=
EXPO_PUBLIC_PROJECT_ID=          # Expo project ID (for push notifications)
```

Environment variables are accessed via `src/utils/env.ts`. Add new variables there rather than accessing `process.env` directly.

---

## Adding a New Feature

1. **Create the feature folder:**
   ```
   src/features/orders/
   ├── components/
   ├── screens/
   │   └── OrderListScreen.tsx
   └── index.ts
   ```

2. **Register screens in navigation** — add routes to `src/navigation/AppNavigator.tsx` and `src/utils/navigation.ts`:
   ```ts
   // src/utils/navigation.ts
   export const APP_ROUTES = {
     HOME: 'Home',
     ORDERS: 'Orders',   // add this
   } as const
   ```

3. **Add API methods** to `src/services/apiClient.ts`:
   ```ts
   async getOrders(): Promise<ApiResponse<Order[]>> {
     const response = await this.instance.get<ApiResponse<Order[]>>('/orders')
     return response.data
   }
   ```

4. **Add React Query hook** in a new file `src/hooks/useOrders.ts`:
   ```ts
   export const useOrders = () => useQuery({
     queryKey: ['orders'],
     queryFn: () => apiClient.getOrders(),
     select: (data) => data.data,
   })
   ```

5. **Add TypeScript types** to `src/types/api.ts` if needed.

---

## State Management

### Redux — `src/store/`

Used for global app state that persists across navigation. Currently tracks:

```ts
store: {
  auth: {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    token: string | null
  },
  app: {
    isLoading: boolean
    isOnline: boolean
  }
}
```

Use the pre-typed hooks from `src/store/hooks.ts`:
```ts
import { useAppDispatch, useAppSelector } from '@/store/hooks'

const { isAuthenticated } = useAppSelector((state) => state.auth)
const dispatch = useAppDispatch()
```

### React Query — `src/hooks/useAuthQueries.ts`

Used for all server-fetched data. Provides automatic caching, background refetching, and loading/error states.

```ts
// Reading server data
const { data: profile, isLoading } = useProfile()

// Mutations with built-in toast feedback
const { mutate: login, isPending } = useLogin()
login({ email, password })
```

---

## Authentication Flow

```
App launch
  └── RootNavigator checks Redux state.auth.isAuthenticated
        ├── false → AuthNavigator (Login / Register / ForgotPassword)
        └── true  → AppNavigator (Home / Profile / Settings)

Login:
  LoginScreen
    → useLogin() mutation
      → useAuth().login()
        → apiClient.login()             (HTTP POST /auth/login)
        → save tokens to AsyncStorage
        → dispatch loginSuccess()       (updates Redux state)
        → React Query invalidates profile cache
```

**Tokens** are stored in `AsyncStorage` and automatically attached to every request via the Axios request interceptor in `apiClient.ts`.

---

## Theming

Theming is handled by `ThemeProvider` (`src/components/ThemeProvider.tsx`) using the device's system preference by default.

```ts
// In any component
import { useTheme } from '@/components/ThemeProvider'

const { isDark, toggleTheme } = useTheme()
```

Apply theme-aware styles using the helper:
```ts
import { getThemeClass } from '@/utils/themeClasses'

<View className={getThemeClass(isDark, 'background.primary')}>
```

Color tokens are defined in `src/utils/Colors.ts`. To change the app's color palette, edit that file. To add new semantic tokens (e.g. `background.card`), add them to `src/utils/themeClasses.ts`.

---

## Internationalization

Translations live in `src/i18n/en.json` and `src/i18n/id.json`. The language is auto-detected from the device on first launch.

```ts
import { useTranslate } from '@/i18n'

const { t, i18n } = useTranslate()
t('auth.login')                      // "Login"
i18n.changeLanguage('id')            // switch to Indonesian
```

**Adding a new language:**

1. Create `src/i18n/fr.json` mirroring the structure of `en.json`
2. Import and register it in `src/i18n/i18n.ts`:
   ```ts
   import fr from './fr.json'
   resources: { en: { translation: en }, id: { translation: id }, fr: { translation: fr } }
   ```

---

## Plugins

Plugins are self-contained optional modules in `src/plugins/`. Each plugin can be removed completely without affecting the rest of the app.

See [`src/plugins/README.md`](src/plugins/README.md) for full setup and removal instructions.

| Plugin | What it does | Key package |
|---|---|---|
| `biometrics/` | Face ID / Touch ID login | `expo-local-authentication` |
| `push-notifications/` | Push notification registration & permission UI | `expo-notifications` |
| `social-login/` | Google, Apple, Facebook OAuth | `@react-native-google-signin/google-signin` |
| `sentry/` | Error tracking | `@sentry/react-native` |

**To remove a plugin:**
1. Delete `src/plugins/<name>/`
2. Remove its usage from `App.tsx`
3. `npm uninstall <packages>` (listed in `src/plugins/README.md`)

---

## Testing

```bash
npm test                  # Run all tests
npm run test:watch        # Watch mode
npm run test:coverage     # With coverage report
npx jest path/to/test.ts  # Single file
```

**Test structure:**
- Unit tests live in `__tests__/` folders next to the code they test
- Integration tests live in `src/__tests__/integration/`
- All native/Expo modules are mocked in `src/config/setupTests.ts`

**Example — mocking the API client:**
```ts
jest.mock('@/services/apiClient')
const mockApiClient = apiClient as jest.Mocked<typeof apiClient>
mockApiClient.login.mockResolvedValue({ success: true, data: { ... } })
```

---

## Building for Production

This project uses [EAS Build](https://docs.expo.dev/build/introduction/).

```bash
# Install EAS CLI
npm install -g eas-cli
eas login

# Configure (first time only)
eas build:configure

# Build
eas build --platform ios
eas build --platform android
eas build --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```

---

## Scripts Reference

| Script | Description |
|---|---|
| `npm start` | Start Expo dev server (Expo Go compatible) |
| `npm run ios` | Run on iOS simulator |
| `npm run android` | Run on Android emulator |
| `npm run web` | Run in browser |
| `npm run lint` | ESLint check |
| `npm run format` | Format all files with Prettier |
| `npm run format:check` | Check formatting without writing |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Jest in watch mode |
| `npm run test:coverage` | Jest with coverage report |
| `npm run reset-project` | Strip to blank Expo project |

---

## Dependencies

### Core

| Package | Version | Purpose |
|---|---|---|
| `expo` | ~53 | React Native framework + tooling |
| `react-native` | 0.79 | Mobile UI framework |
| `typescript` | ~5.8 | Type safety |

### Navigation & State

| Package | Purpose |
|---|---|
| `@react-navigation/native` v7 | Screen navigation |
| `@react-navigation/native-stack` | Stack navigator |
| `@react-navigation/bottom-tabs` | Tab navigator |
| `@reduxjs/toolkit` | Global state management |
| `react-redux` | React bindings for Redux |
| `@tanstack/react-query` v5 | Server state + caching |

### UI & Styling

| Package | Purpose |
|---|---|
| `nativewind` v4 | TailwindCSS for React Native |
| `tailwindcss` | CSS utility classes |
| `@expo/vector-icons` | Icon library |
| `@expo-google-fonts/inter` | Inter font family |

### Forms & Validation

| Package | Purpose |
|---|---|
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Zod integration for RHF |
| `zod` v4 | Schema validation |

### Networking & Storage

| Package | Purpose |
|---|---|
| `axios` | HTTP client |
| `@react-native-async-storage/async-storage` | Persistent key-value storage |
| `@react-native-community/netinfo` | Network state detection |

### Internationalization

| Package | Purpose |
|---|---|
| `i18next` | i18n framework |
| `react-i18next` | React bindings |
| `expo-localization` | Device locale detection |

### Plugin packages (optional — uninstall if plugin is removed)

| Package | Plugin |
|---|---|
| `expo-local-authentication` | biometrics |
| `expo-notifications`, `expo-device` | push-notifications |
| `@react-native-google-signin/google-signin`, `expo-apple-authentication`, `expo-auth-session`, `expo-crypto`, `expo-web-browser` | social-login |
| `@sentry/react-native` | sentry |
