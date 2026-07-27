import React, { useState } from 'react';
import {
  Alert, Linking, SafeAreaView, ScrollView,
  StyleSheet, Switch, Text, TouchableOpacity, View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearAllScans } from '../../src/utils/cache';
import { COLORS, RADIUS, SHADOW } from '../../src/theme';

type Lang = 'en' | 'sn' | 'nd';

export default function SettingsScreen() {
  const [language, setLanguage] = useState<Lang>('en');
  const [notifications, setNotifications] = useState(true);

  const languages: { code: Lang; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'sn', label: 'Shona', native: 'ChiShona' },
    { code: 'nd', label: 'Ndebele', native: 'IsiNdebele' },
  ];

  const handleClearHistory = () => {
    Alert.alert('Clear Scan History', 'This will delete all locally saved diagnoses. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => { await clearAllScans(); Alert.alert('Cleared', 'Scan history deleted.'); } },
    ]);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* Profile header */}
        <View style={styles.profileBanner}>
          <View style={styles.avatar}><Text style={styles.avatarText}>🌱</Text></View>
          <View>
            <Text style={styles.profileName}>MundaWise Farmer</Text>
            <Text style={styles.profileSub}>Harare, Zimbabwe</Text>
          </View>
        </View>

        {/* Language */}
        <SectionHeader title="Language / Mutauro" />
        <View style={styles.card}>
          {languages.map((l) => (
            <TouchableOpacity key={l.code} style={styles.langRow} onPress={() => setLanguage(l.code)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.langName}>{l.label}</Text>
                <Text style={styles.langNative}>{l.native}</Text>
              </View>
              <View style={[styles.radio, language === l.code && styles.radioActive]}>
                {language === l.code && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Outbreak Alerts</Text>
              <Text style={styles.switchSub}>Get notified of disease outbreaks in your district</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: COLORS.border, true: COLORS.accent }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        {/* Data & Privacy */}
        <SectionHeader title="Data & Privacy" />
        <View style={styles.card}>
          <SettingsRow icon="📱" label="Your scans stay on your device" sublabel="Only anonymous summaries are shared" />
          <View style={styles.divider} />
          <TouchableOpacity onPress={handleClearHistory}>
            <SettingsRow icon="🗑" label="Clear Scan History" sublabel="Delete all locally saved diagnoses" danger />
          </TouchableOpacity>
        </View>

        {/* About */}
        <SectionHeader title="About" />
        <View style={styles.card}>
          <SettingsRow icon="🌐" label="Website" sublabel="mundawise.vercel.app" onPress={() => Linking.openURL('https://mundawise.vercel.app')} />
          <View style={styles.divider} />
          <SettingsRow icon="📧" label="Contact" sublabel="hello@mundawise.co.zw" onPress={() => Linking.openURL('mailto:hello@mundawise.co.zw')} />
          <View style={styles.divider} />
          <SettingsRow icon="📄" label="Version" sublabel="MundaWise v1.0.0 · Built in Zimbabwe" />
        </View>

        {/* Brand footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>🌱 MundaWise · Free for farmers, forever</Text>
          <Text style={styles.footerSub}>Harare, Zimbabwe · Built with ❤️ for African farmers</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>;
}

function SettingsRow({ icon, label, sublabel, danger, onPress }: {
  icon: string; label: string; sublabel?: string; danger?: boolean; onPress?: () => void;
}) {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[styles.settingLabel, danger && { color: COLORS.danger }]}>{label}</Text>
        {sublabel && <Text style={styles.settingSub}>{sublabel}</Text>}
      </View>
      {onPress && <Text style={styles.settingArrow}>›</Text>}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 40 },

  profileBanner: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: COLORS.primary, padding: 20, paddingTop: 28 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 28 },
  profileName: { fontSize: 18, fontWeight: '800', color: '#fff' },
  profileSub: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 2 },

  sectionHeader: { fontSize: 11, fontWeight: '800', color: COLORS.textMuted, letterSpacing: 1, marginTop: 20, marginBottom: 6, marginHorizontal: 16 },

  card: { backgroundColor: COLORS.surface, marginHorizontal: 16, borderRadius: RADIUS.lg, overflow: 'hidden', ...SHADOW.sm },
  divider: { height: 1, backgroundColor: COLORS.divider, marginLeft: 48 },

  langRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  langName: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  langNative: { fontSize: 12, color: COLORS.textMuted, marginTop: 1 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.border, justifyContent: 'center', alignItems: 'center' },
  radioActive: { borderColor: COLORS.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },

  switchRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  switchLabel: { fontSize: 15, fontWeight: '700', color: COLORS.text },
  switchSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2, maxWidth: '85%' },

  settingRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  settingIcon: { fontSize: 20, width: 28, textAlign: 'center' },
  settingLabel: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  settingSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 1 },
  settingArrow: { fontSize: 20, color: COLORS.textMuted },

  footer: { alignItems: 'center', padding: 32, gap: 6 },
  footerText: { fontSize: 14, fontWeight: '700', color: COLORS.textSecondary },
  footerSub: { fontSize: 12, color: COLORS.textMuted },
});
