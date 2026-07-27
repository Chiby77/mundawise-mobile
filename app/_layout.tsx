import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator } from 'react-native';
import { COLORS } from '../src/theme';

export default function RootLayout() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('@mundawise:onboarded')
      .then((value) => {
        if (!value) {
          // First launch — send to onboarding
          router.replace('/onboarding');
        }
      })
      .catch(() => {
        // If AsyncStorage fails, proceed to main app
      })
      .finally(() => {
        setChecking(false);
      });
  }, []);

  if (checking) {
    // Splash-like loading state while we check AsyncStorage
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: COLORS.primary },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          contentStyle: { backgroundColor: COLORS.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="results"
          options={{ title: 'Diagnosis Result', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="dealers"
          options={{ title: 'Find Nearest Dealer', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="onboarding"
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack>
    </>
  );
}
