/**
 * MundaWise — Diagnose Tab (Main Screen)
 * State machine: camera → preview → loading → done (navigates to results)
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Alert, Image, SafeAreaView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import NetInfo from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';

import { loadModel, classifyImage, isModelReady } from '../../src/utils/classifier';
import { saveScan, syncPendingScans } from '../../src/utils/cache';
import { OfflineBanner } from '../../src/components/OfflineBanner';
import { COLORS, SHADOW, RADIUS } from '../../src/theme';
import { BACKEND_URL } from '../../src/api/client';

type Stage = 'camera' | 'preview' | 'classifying';

export default function DiagnoseScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [stage, setStage] = useState<Stage>('camera');
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    loadModel().then(() => setModelReady(true)).catch(console.error);
    const unsub = NetInfo.addEventListener((s) => {
      if (s.isConnected) syncPendingScans(BACKEND_URL).catch(() => {});
    });
    return unsub;
  }, []);

  const capture = useCallback(async () => {
    if (!cameraRef.current || !modelReady) return;
    const photo = await cameraRef.current.takePictureAsync({ quality: 0.85 });
    if (photo?.uri) { setCapturedUri(photo.uri); setStage('preview'); }
  }, [modelReady]);

  const pickFromGallery = useCallback(async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.85 });
    if (!result.canceled && result.assets[0]) {
      setCapturedUri(result.assets[0].uri); setStage('preview');
    }
  }, []);

  const runDiagnosis = useCallback(async () => {
    if (!capturedUri) return;
    setStage('classifying');
    try {
      const result = await classifyImage(capturedUri);
      await saveScan(capturedUri, result);
      router.push({ pathname: '/results', params: { resultJson: JSON.stringify(result), imageUri: capturedUri } });
      setTimeout(() => { setCapturedUri(null); setStage('camera'); }, 600);
    } catch (e: any) {
      Alert.alert('Diagnosis Failed', e?.message ?? 'Please try a clearer photo.', [
        { text: 'Retry', onPress: () => setStage('camera') },
      ]);
    }
  }, [capturedUri]);

  const retake = useCallback(() => { setCapturedUri(null); setStage('camera'); }, []);

  // ── Permission ─────────────────────────────────────────────────────────
  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.permRoot}>
        <View style={styles.permCard}>
          <Ionicons name="camera" size={56} color={COLORS.primary} style={{ marginBottom: 16 }} />
          <Text style={styles.permTitle}>Camera Access Needed</Text>
          <Text style={styles.permDesc}>MundaWise needs your camera to photograph crop leaves for diagnosis.</Text>
          <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
            <Text style={styles.permBtnText}>Grant Camera Access</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Classifying ────────────────────────────────────────────────────────
  if (stage === 'classifying') {
    return (
      <SafeAreaView style={[styles.permRoot, { backgroundColor: COLORS.primary }]}>
        <View style={styles.loadingBox}>
          <Ionicons name="search" size={48} color={COLORS.accent} style={{ marginBottom: 24 }} />
          <ActivityIndicator size="large" color={COLORS.accent} style={{ marginBottom: 20 }} />
          <Text style={styles.loadTitle}>Analysing your crop...</Text>
          <Text style={styles.loadSub}>On-device AI · No data sent</Text>
          {capturedUri && <Image source={{ uri: capturedUri }} style={styles.loadThumb} />}
        </View>
      </SafeAreaView>
    );
  }

  // ── Preview ────────────────────────────────────────────────────────────
  if (stage === 'preview' && capturedUri) {
    return (
      <SafeAreaView style={styles.root}>
        <Image source={{ uri: capturedUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        <View style={styles.previewOverlay}>
          <View style={styles.previewBadge}>
            <Text style={styles.previewBadgeText}>Is the affected area clearly visible?</Text>
          </View>
          <TouchableOpacity style={styles.diagnoseBtn} onPress={runDiagnosis}>
            <Ionicons name="search" size={18} color={COLORS.primary} />
            <Text style={styles.diagnoseBtnText}>  Diagnose Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.retakeBtn} onPress={retake}>
            <Ionicons name="arrow-undo" size={16} color="#fff" />
            <Text style={styles.retakeBtnText}>  Retake Photo</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Camera ─────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.root}>
      <OfflineBanner />
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={'back' as CameraType}>
        {/* Top header */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.appName}>MundaWise</Text>
            <Text style={styles.appSub}>AI Crop Diagnostic</Text>
          </View>
          <View style={[styles.aiBadge, { backgroundColor: modelReady ? 'rgba(82,183,136,0.9)' : 'rgba(255,255,255,0.25)' }]}>
            <View style={[styles.aiDot, { backgroundColor: modelReady ? '#fff' : '#aaa' }]} />
            <Text style={styles.aiText}>{modelReady ? 'AI Ready' : 'Loading AI…'}</Text>
          </View>
        </View>

        {/* Target frame */}
        <View style={styles.frameArea}>
          <View style={styles.frame}>
            {(['tl','tr','bl','br'] as const).map((pos) => (
              <View key={pos} style={[styles.corner,
                pos === 'tl' && styles.ctl, pos === 'tr' && styles.ctr,
                pos === 'bl' && styles.cbl, pos === 'br' && styles.cbr,
              ]} />
            ))}
          </View>
          <Text style={styles.frameHint}>Align crop leaf within the frame</Text>
        </View>

        {/* Tip strip */}
        <View style={styles.tipStrip}>
          <Ionicons name="bulb-outline" size={13} color="rgba(255,255,255,0.7)" />
          <Text style={styles.tipText}>  Tip: Ensure good lighting · Capture one leaf at a time</Text>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.sideBtn} onPress={pickFromGallery}>
            <View style={styles.sideBtnInner}>
              <Ionicons name="images-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.sideBtnLabel}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.shutter, !modelReady && styles.shutterDisabled]}
            onPress={capture}
            disabled={!modelReady}
          >
            <View style={styles.shutterRing}>
              <View style={styles.shutterCore} />
            </View>
          </TouchableOpacity>

          <View style={styles.sideBtn} />
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const C = 28;
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  permRoot: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  permCard: { ...SHADOW.lg, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 32, margin: 24, alignItems: 'center' },
  permTitle: { fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 10 },
  permDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  permBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 15, borderRadius: RADIUS.lg },
  permBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  loadTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 8 },
  loadSub: { fontSize: 13, color: COLORS.accentLight, marginBottom: 28 },
  loadThumb: { width: 120, height: 120, borderRadius: 16, borderWidth: 2, borderColor: COLORS.accent },

  previewOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: 24, paddingBottom: 48,
    backgroundColor: 'rgba(0,0,0,0.72)',
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    gap: 12,
  },
  previewBadge: { alignItems: 'center', marginBottom: 8 },
  previewBadgeText: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  diagnoseBtn: { flexDirection: 'row', backgroundColor: COLORS.accent, borderRadius: RADIUS.lg, paddingVertical: 17, alignItems: 'center', justifyContent: 'center' },
  diagnoseBtnText: { color: COLORS.primary, fontSize: 16, fontWeight: '800' },
  retakeBtn: { flexDirection: 'row', borderRadius: RADIUS.lg, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.35)' },
  retakeBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  topBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8,
  },
  appName: { color: '#fff', fontSize: 20, fontWeight: '800' },
  appSub: { color: 'rgba(255,255,255,0.6)', fontSize: 11, marginTop: 1 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full },
  aiDot: { width: 7, height: 7, borderRadius: 4 },
  aiText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  frameArea: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  frame: { width: 270, height: 270, position: 'relative' },
  corner: { position: 'absolute', width: C, height: C, borderColor: 'rgba(255,255,255,0.95)' },
  ctl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  ctr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  cbl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
  cbr: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },
  frameHint: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 16, fontWeight: '500' },

  tipStrip: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingVertical: 9, paddingHorizontal: 20 },
  tipText: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },

  controls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 28, paddingHorizontal: 20 },
  sideBtn: { width: 68, alignItems: 'center' },
  sideBtnInner: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  sideBtnLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 5, fontWeight: '600' },
  shutter: { alignItems: 'center', justifyContent: 'center' },
  shutterDisabled: { opacity: 0.35 },
  shutterRing: { width: 80, height: 80, borderRadius: 40, borderWidth: 4, borderColor: '#fff', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)' },
  shutterCore: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#fff' },
});
