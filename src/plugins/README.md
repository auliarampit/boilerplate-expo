# Modules

Optional features that can be included or removed per project. Each module is self-contained.

| Module | Description | Key Packages |
|---|---|---|
| `biometrics/` | Face ID / fingerprint authentication | `expo-local-authentication` |
| `push-notifications/` | Push notification registration & permission UI | `expo-notifications`, `expo-device` |
| `social-login/` | Google, Apple, Facebook OAuth | `@react-native-google-signin/google-signin`, `expo-apple-authentication`, `expo-auth-session`, `expo-crypto`, `expo-web-browser` |
| `sentry/` | Error tracking & crash reporting | `@sentry/react-native` |

## How to remove a module

1. Delete the module folder
2. Remove its import from `App.tsx`
3. Uninstall its packages (`npm uninstall <packages>`)
4. Remove from `app.json` plugins if applicable

## How to use a module

Import from the module's index:

```ts
import { BiometricButton } from '@/modules/biometrics'
import { SocialLoginButtons } from '@/modules/social-login'
import { NotificationProvider, useNotificationPermission } from '@/modules/push-notifications'
import { initSentry, captureException } from '@/modules/sentry'
```
