# Plugins

Optional features that can be added or removed per project. Each plugin is self-contained — you can delete any folder without affecting the rest of the app.

| Plugin | Description | Packages to install |
|---|---|---|
| `biometrics/` | Face ID / fingerprint authentication | `expo-local-authentication` |
| `push-notifications/` | Push notification registration & permission UI | `expo-notifications expo-device` |
| `social-login/` | Google, Apple, Facebook OAuth | `@react-native-google-signin/google-signin expo-apple-authentication expo-auth-session expo-crypto expo-web-browser` |
| `sentry/` | Error tracking & crash reporting | `@sentry/react-native` |

> **Note:** All plugin packages are pre-installed in this boilerplate. If you don't need a plugin, delete its folder and run `npm uninstall <packages>` to keep your bundle lean.

## How to remove a plugin

1. Delete the plugin folder (e.g. `src/plugins/sentry/`)
2. Remove its import/usage from `App.tsx`
3. Uninstall its packages: `npm uninstall <packages>`
4. Remove from `app.json` plugins array if applicable (see table above)

## How to use a plugin

Import from the plugin's index:

```ts
import { BiometricButton, useBiometricAuth } from '@/plugins/biometrics'
import { SocialLoginButtons, useSocialAuth } from '@/plugins/social-login'
import { NotificationProvider, usePushNotifications } from '@/plugins/push-notifications'
import { initSentry, captureException } from '@/plugins/sentry'
```

## Plugin setup guides

### Sentry
1. Create a project at [sentry.io](https://sentry.io)
2. Copy your DSN to `.env`: `EXPO_PUBLIC_SENTRY_DSN=your_dsn_here`
3. Call `initSentry()` in `App.tsx` (already wired)

### Social Login
1. **Google**: Create OAuth credentials at [console.cloud.google.com](https://console.cloud.google.com), add to `.env`:
   ```
   EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id
   EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id
   ```
2. **Apple**: Enable "Sign in with Apple" capability in Xcode
3. **Facebook**: Create an app at [developers.facebook.com](https://developers.facebook.com), add to `.env`:
   ```
   EXPO_PUBLIC_FACEBOOK_CLIENT_ID=your_app_id
   ```

### Push Notifications
1. Follow [Expo Push Notifications setup](https://docs.expo.dev/push-notifications/overview/)
2. Add `NotificationProvider` to your provider tree in `App.tsx`

### Biometrics
No extra setup required — uses `expo-local-authentication` which works out of the box.
