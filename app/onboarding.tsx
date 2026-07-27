/**
 * MundaWise — Onboarding Screen
 * Shown once on first launch. Collects language preference and phone number.
 * Stores preference in AsyncStorage, then navigates to main app.
 */
import React, { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, SafeAreaView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerFarmer } from '../src/api/client';
import { COLORS, RADIUS, SHADOW } from '../src/theme';

type Lang = 'en' | 'sn' | 'nd';
type Step = 'welcome' | 'language' | 'phone' | 'done';

const LANGUAGES: { code: Lang; label: string; native: string; flag: string }[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'sn', label: 'Shona', native: 'ChiShona', flag: '🇿🇼' },
  { code: 'nd', label: 'Ndebele', native: 'IsiNdebele', flag: '🇿🇼' },
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
        registerFarmer(phone.trim(), lang).catch(() => {}); // fire-and-forget
      }
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Could not save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Welcome step ──────────────────────────────────────────────────────
  if (step === 'welcome') return (
    <SafeAreaView style={styles.root}>
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🌱</Text>
        <Text style={styles.heroTitle}>MundaWise</Text>
        <Text style={styles.heroTagline}>AI Agronomist in Your Pocket</Text>
        <Text style={styles.heroDesc}>
          Diagnose crop diseases in seconds. Get treatment plans in English, Shona, or Ndebele.
          Find the nearest agro-dealer with the medicine in stock.
        </Text>
        <View style={styles.featureList}>
          {['📸 Offline AI diagnosis — no internet needed', '💊 Treatment plans with chemical names & dosages', '📍 Find nearest dealer with stock in real time', '🌍 Shona & Ndebele language support'].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep('language')}>
          <Text style={styles.primaryBtnText}>Get Started →</Text>
        </TouchableOpacity>
        <Text style={styles.freeNote}>100% free for farmers · No subscription needed</Text>
      </View>
    </SafeAreaView>
  );

  // ── Language step ─────────────────────────────────────────────────────
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
              <Text style={styles.langFlag}>{l.flag}</Text>
              <Text style={[styles.langLabel, lang === l.code && styles.langLabelActive]}>{l.label}</Text>
              <Text style={styles.langNative}>{l.native}</Text>
              {lang === l.code && <View style={styles.langCheck}><Text style={{ color: '#fff', fontSize: 12 }}>✓</Text></View>}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep('phone')}>
          <Text style={styles.primaryBtnText}>Continue →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // ── Phone step ────────────────────────────────────────────────────────
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
            <Text style={styles.inputPrefix}>🇿🇼 +263</Text>
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
          <Text style={styles.privacyNote}>🔒 Your data is stored securely and never shared with third parties.</Text>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.primaryBtn} onPress={finish} disabled={saving}>
            <Text style={styles.primaryBtnText}>{saving ? 'Setting up…' : 'Start Using MundaWise 🌱'}</Text>
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
  heroEmoji: { fontSize: 72, marginBottom: 16 },
  heroTitle: { fontSize: 38, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  heroTagline: { fontSize: 16, color: COLORS.accentLight, fontWeight: '600', marginTop: 4, marginBottom: 24 },
  heroDesc: { fontSize: 14, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  featureList: { alignSelf: 'stretch', gap: 10 },
  featureRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RADIUS.md, padding: 12 },
  featureText: { fontSize: 13, color: '#fff', fontWeight: '500', flex: 1 },

  footer: { padding: 24, paddingBottom: 40, gap: 12, backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingVertical: 17, alignItems: 'center' },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  freeNote: { textAlign: 'center', fontSize: 12, color: COLORS.textMuted },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontSize: 14, color: COLORS.textMuted },

  stepContent: { flex: 1, padding: 28, paddingTop: 48 },
  stepNum: { fontSize: 12, fontWeight: '800', color: COLORS.accentLight, letterSpacing: 1, marginBottom: 12 },
  stepTitle: { fontSize: 26, fontWeight: '900', color: '#fff', marginBottom: 10 },
  stepDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 22, marginBottom: 32 },

  langGrid: { gap: 12 },
  langCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: RADIUS.lg, padding: 16, borderWidth: 2, borderColor: 'transparent' },
  langCardActive: { borderColor: COLORS.accent, backgroundColor: 'rgba(82,183,136,0.2)' },
  langFlag: { fontSize: 28 },
  langLabel: { fontSize: 17, fontWeight: '800', color: 'rgba(255,255,255,0.7)', flex: 1 },
  langLabelActive: { color: '#fff' },
  langNative: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  langCheck: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center' },

  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' },
  inputPrefix: { paddingHorizontal: 14, fontSize: 15, color: '#fff', fontWeight: '600' },
  input: { flex: 1, paddingVertical: 16, paddingRight: 14, fontSize: 16, color: '#fff', fontWeight: '500' },
  privacyNote: { marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,0.55)', textAlign: 'center', lineHeight: 18 },
});
