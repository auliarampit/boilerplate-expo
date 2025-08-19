import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthNavigator } from '../features/auth';
import { Colors } from '../shared/constants/Colors';
import { ROOT_ROUTES } from '../shared/constants/navigation';
import { useColorScheme } from '../shared/hooks/useColorScheme';
import { AuthState, RootStackParamList, User } from '../shared/types/navigation';
import { AppNavigator } from './AppNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AUTH_STORAGE_KEY = '@auth_state';
const USER_STORAGE_KEY = '@user_data';

interface AuthContextType extends AuthState {
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  const checkAuthState = async () => {
    try {
      const [authData, userData] = await Promise.all([
        AsyncStorage.getItem(AUTH_STORAGE_KEY),
        AsyncStorage.getItem(USER_STORAGE_KEY),
      ]);

      const isAuthenticated = authData === 'true';
      const user = userData ? JSON.parse(userData) : null;

      setAuthState({
        isAuthenticated,
        isLoading: false,
        user,
      });
    } catch (error) {
      console.error('Error checking auth state:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    }
  };

  const login = async (user: User) => {
    try {
      await Promise.all([
        AsyncStorage.setItem(AUTH_STORAGE_KEY, 'true'),
        AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user)),
      ]);

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user,
      });
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(AUTH_STORAGE_KEY),
        AsyncStorage.removeItem(USER_STORAGE_KEY),
      ]);

      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
    } catch (error) {
      console.error('Error during logout:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

function LoadingScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    }}>
      <ActivityIndicator size="large" color={colors.tint} />
    </View>
  );
}

function RootNavigatorContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: NAVIGATION_OPTIONS.HEADER_SHOWN,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen 
          name={ROOT_ROUTES.APP} 
          component={AppNavigator} 
        />
      ) : (
        <Stack.Screen 
          name={ROOT_ROUTES.AUTH} 
          component={AuthNavigator} 
        />
      )}
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <AuthProvider>
      <RootNavigatorContent />
    </AuthProvider>
  );
}

export { AuthProvider };
