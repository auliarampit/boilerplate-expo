import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppStackScreenProps } from '../../../shared/types/navigation';
import { APP_ROUTES } from '../../../shared/constants/navigation';
import { Colors } from '../../../shared/constants/Colors';
import { useColorScheme } from '../../../shared/hooks/useColorScheme';

export function SettingsScreen({ navigation }: AppStackScreenProps<'Settings'>) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const navigateToHome = () => {
    navigation.navigate(APP_ROUTES.HOME);
  };

  const navigateToProfile = () => {
    navigation.navigate(APP_ROUTES.PROFILE);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout pressed');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>App settings and preferences</Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.tint }]} 
        onPress={navigateToHome}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.tint }]} 
        onPress={navigateToProfile}
      >
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.logoutButton, { borderColor: colors.tint }]} 
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: colors.tint }]}>Logout</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
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
  logoutButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
});