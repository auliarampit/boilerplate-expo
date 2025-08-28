# 🚀 Expo React Native Boilerplate

A comprehensive and production-ready React Native boilerplate built with Expo, featuring modern development tools, best practices, and essential features for mobile app development.

## ✨ Features

### 🎨 UI & Styling
- **NativeWind (TailwindCSS)** - Utility-first CSS framework for React Native
- **Custom Theme System** - Dark/Light mode support with automatic detection
- **Inter Font Family** - Modern typography with multiple weights
- **Responsive Design** - Optimized for various screen sizes

### 🔐 Authentication & Security
- **Biometric Authentication** - Face ID, Touch ID, and Fingerprint support
- **Social Login** - Google and Apple authentication
- **Form Validation** - React Hook Form with Zod schema validation
- **Secure Storage** - AsyncStorage with encryption support

### 🌐 Internationalization
- **Multi-language Support** - i18next integration
- **Dynamic Language Switching** - Runtime language changes
- **Locale Detection** - Automatic device language detection
- **Translation Management** - Structured translation files (EN/ID)

### 📱 Navigation & State Management
- **React Navigation v7** - Stack and Tab navigation
- **Redux Toolkit** - Predictable state management
- **React Query** - Server state management and caching
- **Type-safe Navigation** - TypeScript navigation types

### 🔔 Notifications & Permissions
- **Push Notifications** - Expo Notifications integration
- **Permission Management** - Runtime permission handling
- **Background Notifications** - Handle notifications when app is closed

### 🛠️ Developer Experience
- **TypeScript** - Full type safety
- **ESLint & Prettier** - Code formatting and linting
- **Husky & Lint-staged** - Pre-commit hooks
- **Error Boundary** - Graceful error handling
- **Sentry Integration** - Error tracking and monitoring

### 🌐 Network & API
- **Axios Client** - HTTP client with interceptors
- **Network State Detection** - Online/offline status
- **API Error Handling** - Centralized error management
- **Mock API Support** - Development-friendly API mocking

### 📊 Additional Features
- **Bottom Sheets** - Native-like modal presentations
- **Toast Notifications** - User feedback system
- **Loading States** - Skeleton screens and spinners
- **Search Functionality** - Debounced search with filters
- **Contact Forms** - Pre-built contact and feedback forms

## 🏗️ Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── auth/          # Authentication screens and logic
│   ├── home/          # Home screen components
│   ├── profile/       # User profile management
│   └── settings/      # App settings and preferences
├── navigations/       # Navigation configuration
├── shared/           # Shared utilities and components
│   ├── components/   # Reusable UI components
│   ├── hooks/        # Custom React hooks
│   ├── store/        # Redux store and slices
│   ├── services/     # API services and clients
│   ├── utils/        # Utility functions
│   └── types/        # TypeScript type definitions
├── translate/        # Internationalization files
└── temporary/        # Development examples and mock data
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd boilerplate-expo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on specific platforms**
   ```bash
   # iOS Simulator
   npm run ios
   
   # Android Emulator
   npm run android
   
   # Web Browser
   npm run web
   ```

## 📱 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run on web browser |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run reset-project` | Reset to blank project |

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
EXPO_PUBLIC_API_BASE_URL=your_api_base_url
```

### Theme Customization

Modify `tailwind.config.js` to customize your design system:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
      },
    },
  },
}
```

### Adding New Languages

1. Create translation files in `src/translate/`:
   - `fr.json` (French)
   - `es.json` (Spanish)

2. Update `src/translate/types.ts` with new language keys

3. Configure language detection in `TranslateContext.tsx`

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📦 Building for Production

### iOS
```bash
# Build for iOS
eas build --platform ios

# Submit to App Store
eas submit --platform ios
```

### Android
```bash
# Build for Android
eas build --platform android

# Submit to Google Play
eas submit --platform android
```

## 🔍 Code Quality

This project enforces code quality through:

- **TypeScript** - Static type checking
- **ESLint** - Code linting and best practices
- **Prettier** - Consistent code formatting
- **Husky** - Pre-commit hooks
- **Lint-staged** - Staged file linting

## 📚 Key Dependencies

| Package | Purpose |
|---------|----------|
| `expo` | React Native framework |
| `@react-navigation/native` | Navigation library |
| `@reduxjs/toolkit` | State management |
| `@tanstack/react-query` | Server state management |
| `react-hook-form` | Form handling |
| `nativewind` | TailwindCSS for React Native |
| `i18next` | Internationalization |
| `expo-notifications` | Push notifications |
| `expo-local-authentication` | Biometric authentication |
| `@sentry/react-native` | Error tracking |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Expo Documentation](https://docs.expo.dev/)
2. Search existing [GitHub Issues](https://github.com/expo/expo/issues)
3. Join the [Expo Discord Community](https://chat.expo.dev)

## 🙏 Acknowledgments

- [Expo Team](https://expo.dev) for the amazing framework
- [React Navigation](https://reactnavigation.org) for navigation solutions
- [NativeWind](https://www.nativewind.dev) for TailwindCSS integration
- [React Hook Form](https://react-hook-form.com) for form management

---

**Happy Coding! 🎉**
