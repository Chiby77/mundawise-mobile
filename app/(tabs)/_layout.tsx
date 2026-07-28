import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../src/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({
  focused,
  icon,
  iconOutline,
  label,
}: {
  focused: boolean;
  icon: IoniconsName;
  iconOutline: IoniconsName;
  label: string;
}) {
  return (
    <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
      <Ionicons
        name={focused ? icon : iconOutline}
        size={22}
        color={focused ? COLORS.accent : COLORS.textMuted}
      />
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
          title: 'MundaWise',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="leaf" iconOutline="leaf-outline" label="Diagnose" />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Scan History',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="time" iconOutline="time-outline" label="History" />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Outbreak Alerts',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="warning" iconOutline="warning-outline" label="Alerts" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="settings" iconOutline="settings-outline" label="Settings" />
          ),
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
  label: { fontSize: 10, fontWeight: '600', marginTop: 3 },
});
