// Global mocks for Jest
global.__DEV__ = true;

// Mock expo modules at the global level
jest.mock('expo-modules-core', () => ({
  NativeModulesProxy: {},
  EventEmitter: class MockEventEmitter {
    addListener() {}
    removeListener() {}
  },
}));

// Mock expo runtime
jest.mock('expo/src/winter/runtime.native.ts', () => ({}));

// Suppress console warnings for tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};