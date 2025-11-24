module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/src/shared/config/jestSetup.js'],
  setupFilesAfterEnv: ['<rootDir>/src/shared/config/setupTests.ts'],
  testMatch: [
    '**/__tests__/**/*.(ts|tsx|js)',
    '**/*.(test|spec).(ts|tsx|js)'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.ts',
    '!src/temporary/**/*'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?@?react-native|@react-native-community|@react-navigation|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-native-masked-view|react-native-screens|react-native-safe-area-context|react-native-vector-icons)'
  ],
  testEnvironment: 'jsdom'
};