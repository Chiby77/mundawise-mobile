import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../src/theme';

function TabIcon({ focused, emoji, label }: { focused: boolean; emoji: string; label: string }) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, { color: focused ? COLORS.accent : COLORS.textMuted }]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '800', fontSize: 18, letterSpacing: 0.3 },
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '🌱 MundaWise',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="🌿" label="Diagnose" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Scan History',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="📋" label="History" />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Outbreak Alerts',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="⚠️" label="Alerts" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} emoji="⚙️" label="Settings" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.primary,
    borderTopWidth: 0,
    height: 72,
    paddingBottom: 8,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  tabIcon: {
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  tabIconActive: {
    backgroundColor: 'rgba(82, 183, 136, 0.15)',
  },
  emoji: { fontSize: 22 },
  label: { fontSize: 10, fontWeight: '600', marginTop: 3 },
});
