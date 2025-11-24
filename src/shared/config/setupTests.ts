import '@testing-library/jest-native/extend-expect';

// Mock react-native modules
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
  Animated: {
    View: 'View',
    timing: jest.fn(() => ({ start: jest.fn() })),
    Value: jest.fn(() => ({ setValue: jest.fn() })),
  },
  TouchableOpacity: 'TouchableOpacity',
  View: 'View',
  Text: 'Text',
  TextInput: 'TextInput',
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-keychain (commented out as not used in this project)
// jest.mock('react-native-keychain', () => ({
//   setInternetCredentials: jest.fn(() => Promise.resolve()),
//   getInternetCredentials: jest.fn(() => Promise.resolve({ username: 'test', password: 'test' })),
//   resetInternetCredentials: jest.fn(() => Promise.resolve()),
// }));

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        apiUrl: 'http://localhost:3000',
      },
    },
  },
}));

// Mock expo-apple-authentication
jest.mock('expo-apple-authentication', () => ({
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
  signInAsync: jest.fn(() => Promise.resolve({
    user: 'test-user-id',
    email: 'test@example.com',
    fullName: { givenName: 'Test', familyName: 'User' },
  })),
  AppleAuthenticationScope: {
    FULL_NAME: 0,
    EMAIL: 1,
  },
}));

// Mock expo-auth-session
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'http://localhost:3000/auth'),
  AuthRequest: jest.fn().mockImplementation(() => ({
    promptAsync: jest.fn(() => Promise.resolve({
      type: 'success',
      params: { code: 'test-code' },
    })),
  })),
  ResponseType: {
    Code: 'code',
  },
}));

// Mock expo-crypto
jest.mock('expo-crypto', () => ({
  digestStringAsync: jest.fn(() => Promise.resolve('test-hash')),
  CryptoDigestAlgorithm: {
    SHA256: 'SHA256',
  },
}));

// Mock @react-native-google-signin/google-signin
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    signIn: jest.fn(() => Promise.resolve({
      data: {
        user: {
          id: 'test-google-id',
          email: 'test@gmail.com',
          name: 'Test User',
          photo: 'https://example.com/photo.jpg',
        },
      },
    })),
    getCurrentUser: jest.fn(() => Promise.resolve(null)),
    signOut: jest.fn(() => Promise.resolve()),
  },
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
  },
}));

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      reset: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Global test utilities
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};