import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, SafeAreaView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { registerFarmer } from '../src/api/client';
import { COLORS, RADIUS, SHADOW } from '../src/theme';

type Lang = 'en' | 'sn' | 'nd';
type Step = 'welcome' | 'language' | 'phone';
type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const LANGUAGES: { code: Lang; label: string; native: string; icon: IoniconsName }[] = [
  { code: 'en', label: 'English',  native: 'English',    icon: 'language-outline' },
  { code: 'sn', label: 'Shona',    native: 'ChiShona',   icon: 'language-outline' },
  { code: 'nd', label: 'Ndebele',  native: 'IsiNdebele', icon: 'language-outline' },
];

const FEATURES: { icon: IoniconsName; text: string }[] = [
  { icon: 'camera-outline',      text: 'Offline AI diagnosis — no internet needed' },
  { icon: 'medkit-outline',      text: 'Treatment plans with chemical names & dosages' },
  { icon: 'location-outline',    text: 'Find nearest dealer with stock in real time' },
  { icon: 'chatbubble-outline',  text: 'Shona & Ndebele language support' },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState<Step>('welcome');
  const [lang, setLang] = useState<Lang>('en');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem('@mundawise:onboarded', '1');
      await AsyncStorage.setItem('@mundawise:language', lang);
      if (phone.trim()) {
        await AsyncStorage.setItem('@mundawise:phone', phone.trim());
        registerFarmer(phone.trim(), lang).catch(() => {});
      }
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Could not save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Welcome ───────────────────────────────────────────────────────────
  if (step === 'welcome') return (
    <SafeAreaView style={styles.root}>
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Ionicons name="leaf" size={52} color={COLORS.accent} />
        </View>
        <Text style={styles.heroTitle}>MundaWise</Text>
        <Text style={styles.heroTagline}>AI Agronomist in Your Pocket</Text>
        <Text style={styles.heroDesc}>
          Diagnose crop diseases in seconds. Get treatment plans in English, Shona, or Ndebele.
          Find the nearest agro-dealer with the medicine in stock.
        </Text>
        <View style={styles.featureList}>
          {FEATURES.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Ionicons name={f.icon} size={18} color={COLORS.accent} />
              <Text style={styles.featureText}> {f.text}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep('language')}>
          <Text style={styles.primaryBtnText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.freeNote}>100% free for farmers · No subscription needed</Text>
      </View>
    </SafeAreaView>
  );

  // ── Language ──────────────────────────────────────────────────────────
  if (step === 'language') return (
    <SafeAreaView style={styles.root}>
      <View style={styles.stepContent}>
        <Text style={styles.stepNum}>1 of 2</Text>
        <Text style={styles.stepTitle}>Choose Your Language</Text>
        <Text style={styles.stepDesc}>MundaWise will show treatment advice in your language.</Text>
        <View style={styles.langGrid}>
          {LANGUAGES.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={[styles.langCard, lang === l.code && styles.langCardActive]}
              onPress={() => setLang(l.code)}
            >
              <Ionicons name={l.icon} size={26} color={lang === l.code ? COLORS.accent : 'rgba(255,255,255,0.5)'} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[styles.langLabel, lang === l.code && styles.langLabelActive]}>{l.label}</Text>
                <Text style={styles.langNative}>{l.native}</Text>
              </View>
              {lang === l.code && (
                <View style={styles.langCheck}>
                  <Ionicons name="checkmark" size={13} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep('phone')}>
          <Text style={styles.primaryBtnText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // ── Phone ─────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <SafeAreaView style={styles.root}>
        <View style={styles.stepContent}>
          <Text style={styles.stepNum}>2 of 2</Text>
          <Text style={styles.stepTitle}>Your Phone Number</Text>
          <Text style={styles.stepDesc}>
            Optional — lets us send WhatsApp alerts and link your scan history. We never share your number.
          </Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={18} color="rgba(255,255,255,0.7)" style={{ marginLeft: 14 }} />
            <Text style={styles.inputPrefix}> +263</Text>
            <TextInput
              style={styles.input}
              placeholder="77 123 4567"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(t) => setPhone(t.replace(/[^0-9\s]/g, ''))}
              maxLength={12}
            />
          </View>
          <View style={styles.privacyRow}>
            <Ionicons name="lock-closed-outline" size={13} color="rgba(255,255,255,0.55)" />
            <Text style={styles.privacyNote}> Your data is stored securely and never shared with third parties.</Text>
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryBtn} onPress={finish} disabled={saving}>
            <Ionicons name="leaf" size={18} color="#fff" />
            <Text style={styles.primaryBtnText}>  {saving ? 'Setting up…' : 'Start Using MundaWise'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtn} onPress={finish}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.primary },

  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28 },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255,255,255,0.12)', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  heroTitle: { fontSize: 38, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  heroTagline: { fontSize: 16, color: COLORS.accentLight, fontWeight: '600', marginTop: 4, marginBottom: 24 },
  heroDesc: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  featureList: { alignSelf: 'stretch', gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RADIUS.md, padding: 12 },
  featureText: { fontSize: 13, color: '#fff', fontWeight: '500', flex: 1 },

  footer: { padding: 24, paddingBottom: 40, gap: 12, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingVertical: 17, gap: 8 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  freeNote: { textAlign: 'center', fontSize: 12, color: COLORS.textMuted },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontSize: 14, color: COLORS.textMuted },

  stepContent: { flex: 1, padding: 28, paddingTop: 48 },
  stepNum: { fontSize: 12, fontWeight: '800', color: COLORS.accentLight, letterSpacing: 1, marginBottom: 12 },
  stepTitle: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 10 },
  stepDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 22, marginBottom: 32 },

  langGrid: { gap: 12 },
  langCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RADIUS.lg, padding: 16, borderWidth: 2, borderColor: 'transparent' },
  langCardActive: { borderColor: COLORS.accent, backgroundColor: 'rgba(82,183,136,0.2)' },
  langLabel: { fontSize: 17, fontWeight: '800', color: 'rgba(255,255,255,0.7)' },
  langLabelActive: { color: '#fff' },
  langNative: { fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 2 },
  langCheck: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center' },

  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: RADIUS.lg, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' },
  inputPrefix: { paddingRight: 4, fontSize: 15, color: '#fff', fontWeight: '600' },
  input: { flex: 1, paddingVertical: 16, paddingRight: 14, fontSize: 16, color: '#fff', fontWeight: '500' },
  privacyRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 16 },
  privacyNote: { flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 18 },
});
