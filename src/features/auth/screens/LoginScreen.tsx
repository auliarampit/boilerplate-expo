import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthStackScreenProps } from '../../../shared/types/navigation';
import { AUTH_ROUTES } from '../../../shared/constants/navigation';
import { Colors } from '../../../shared/constants/Colors';
import { useColorScheme } from '../../../shared/hooks/useColorScheme';

export function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log('Login pressed');
  };

  const navigateToRegister = () => {
    navigation.navigate(AUTH_ROUTES.REGISTER);
  };

  const navigateToForgotPassword = () => {
    navigation.navigate(AUTH_ROUTES.FORGOT_PASSWORD);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Login</Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.tint }]} 
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={navigateToRegister}
      >
        <Text style={[styles.linkText, { color: colors.tint }]}>Register</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.linkButton} 
        onPress={navigateToForgotPassword}
      >
        <Text style={[styles.linkText, { color: colors.tint }]}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});