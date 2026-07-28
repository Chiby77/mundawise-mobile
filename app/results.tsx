import React, { useState } from 'react';
import {
  LayoutAnimation, Platform, UIManager, SafeAreaView, ScrollView,
  StyleSheet, Text, TouchableOpacity, View, Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SEVERITY_CONFIG, SHADOW } from '../src/theme';
import type { ClassificationResult } from '../src/utils/classifier';

if (Platform.OS === 'android') UIManager.setLayoutAnimationEnabledExperimental?.(true);

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

export default function ResultsScreen() {
  const { resultJson, imageUri } = useLocalSearchParams<{ resultJson: string; imageUri: string }>();
  const result: ClassificationResult = JSON.parse(resultJson ?? '{}');
  const { info, confidence, topResults, inferenceMs } = result;

  const [lang, setLang] = useState<'en' | 'sn'>('en');
  const [expanded, setExpanded] = useState(false);

  const pct = Math.round(confidence * 100);
  const sev = SEVERITY_CONFIG[info.severity];
  const isHealthy = info.severity === 'Healthy';

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((v) => !v);
  };

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Leaf image thumbnail */}
        {imageUri ? (
          <View style={styles.imageRow}>
            <Image source={{ uri: imageUri }} style={styles.leafThumb} />
            <View style={styles.imageMeta}>
              <Text style={styles.imageMetaLabel}>Scanned leaf</Text>
              <Text style={styles.imageMetaTime}>
                {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {inferenceMs && (
                <View style={styles.speedBadge}>
                  <Ionicons name="flash" size={11} color={COLORS.primary} />
                  <Text style={styles.speedText}> {inferenceMs}ms</Text>
                </View>
              )}
            </View>
          </View>
        ) : null}

        {/* Main disease card */}
        <View style={[styles.card, SHADOW.md]}>

          {/* Disease header */}
          <View style={[styles.cardHeader, { borderLeftColor: info.color }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.diseaseName}>{info.name}</Text>
              <Text style={styles.shonaName}>{info.nameShona}</Text>
            </View>
            <View style={[styles.sevBadge, { backgroundColor: sev.bg, borderColor: sev.border }]}>
              <Text style={[styles.sevText, { color: sev.text }]}>{sev.label}</Text>
            </View>
          </View>

          {/* Confidence bar */}
          <View style={styles.confRow}>
            <Text style={styles.confLabel}>AI Confidence</Text>
            <View style={styles.progressBg}>
              <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: info.color }]} />
            </View>
            <Text style={[styles.confPct, { color: info.color }]}>{pct}%</Text>
          </View>

          {/* Language toggle */}
          <View style={styles.langToggle}>
            <TouchableOpacity style={[styles.langBtn, lang === 'en' && styles.langActive]} onPress={() => setLang('en')}>
              <Text style={[styles.langText, lang === 'en' && styles.langActiveText]}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.langBtn, lang === 'sn' && styles.langActive]} onPress={() => setLang('sn')}>
              <Text style={[styles.langText, lang === 'sn' && styles.langActiveText]}>Shona</Text>
            </TouchableOpacity>
          </View>

          {/* Treatment */}
          <View style={styles.treatBox}>
            <View style={styles.treatTitleRow}>
              <Ionicons
                name={isHealthy ? 'checkmark-circle' : 'medkit'}
                size={15}
                color={isHealthy ? COLORS.success ?? '#16A34A' : COLORS.primary}
              />
              <Text style={styles.treatTitle}> {isHealthy ? 'Crop Status' : 'Treatment Advice'}</Text>
            </View>
            <Text style={styles.treatText}>{lang === 'sn' ? info.treatmentShona : info.treatment}</Text>

            {info.chemical && (
              <View style={styles.chemBox}>
                <Text style={styles.chemLabel}>Prescribed Chemical</Text>
                <Text style={styles.chemName}>{info.chemical}</Text>
                {info.dosage && (
                  <View style={styles.dosageRow}>
                    <Text style={styles.dosageLabel}>Dosage</Text>
                    <Text style={styles.dosageValue}>{info.dosage}</Text>
                  </View>
                )}
              </View>
            )}

            {info.preventionTip && (
              <View style={styles.tipRow}>
                <Ionicons name="shield-checkmark-outline" size={14} color={COLORS.textSecondary} style={{ marginTop: 1 }} />
                <Text style={styles.tipText}> {info.preventionTip}</Text>
              </View>
            )}
          </View>

          {/* Other possibilities */}
          {topResults?.length > 1 && (
            <>
              <TouchableOpacity style={styles.expandRow} onPress={toggle}>
                <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.textMuted} />
                <Text style={styles.expandLabel}> {expanded ? 'Hide' : 'Show'} other possibilities</Text>
              </TouchableOpacity>
              {expanded && (
                <View style={styles.altList}>
                  {topResults.slice(1).map((r, i) => (
                    <View key={i} style={styles.altRow}>
                      <Text style={styles.altLabel} numberOfLines={1}>
                        {r.label.replace(/[_()\[\]]/g, ' ').replace(/\s+/g, ' ').trim()}
                      </Text>
                      <Text style={styles.altPct}>{Math.round(r.confidence * 100)}%</Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          {!isHealthy && (
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => router.push({
                pathname: '/dealers',
                params: { disease: result.label, chemical: info.chemical ?? '', confidence: String(confidence) },
              })}
            >
              <Ionicons name="location" size={17} color="#fff" />
              <Text style={styles.primaryBtnText}>  Find Nearest Dealer</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.back()}>
            <Ionicons name="camera" size={17} color={COLORS.text} />
            <Text style={styles.secondaryBtnText}>  Scan Another Crop</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { padding: 16, paddingBottom: 40 },

  imageRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 16, backgroundColor: COLORS.surface, padding: 14, borderRadius: RADIUS.lg, ...SHADOW.sm },
  leafThumb: { width: 72, height: 72, borderRadius: RADIUS.md },
  imageMeta: { flex: 1 },
  imageMetaLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  imageMetaTime: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  speedBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 6, backgroundColor: COLORS.accentLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  speedText: { fontSize: 11, color: COLORS.primary, fontWeight: '700' },

  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: 20, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', borderLeftWidth: 4, paddingLeft: 14, marginBottom: 16 },
  diseaseName: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 3 },
  shonaName: { fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic' },
  sevBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: RADIUS.full, borderWidth: 1, marginLeft: 8, alignSelf: 'flex-start' },
  sevText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

  confRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  confLabel: { fontSize: 12, color: COLORS.textMuted, width: 100 },
  progressBg: { flex: 1, height: 8, backgroundColor: COLORS.divider, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  confPct: { fontSize: 13, fontWeight: '800', width: 38, textAlign: 'right' },

  langToggle: { flexDirection: 'row', backgroundColor: COLORS.divider, borderRadius: RADIUS.md, padding: 3, marginBottom: 14 },
  langBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: RADIUS.sm },
  langActive: { backgroundColor: COLORS.surface, ...SHADOW.sm },
  langText: { fontSize: 13, color: COLORS.textMuted, fontWeight: '600' },
  langActiveText: { color: COLORS.primary },

  treatBox: { backgroundColor: COLORS.surfaceAlt, borderRadius: RADIUS.md, padding: 14, gap: 10 },
  treatTitleRow: { flexDirection: 'row', alignItems: 'center' },
  treatTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary },
  treatText: { fontSize: 14, color: COLORS.text, lineHeight: 22 },
  chemBox: { backgroundColor: '#EEF2FF', borderRadius: RADIUS.md, padding: 12, gap: 4 },
  chemLabel: { fontSize: 11, color: '#7986CB', fontWeight: '700' },
  chemName: { fontSize: 16, color: '#3949AB', fontWeight: '800' },
  dosageRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 2 },
  dosageLabel: { fontSize: 11, color: '#5C6BC0' },
  dosageValue: { fontSize: 13, color: '#3949AB', fontWeight: '700' },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start' },
  tipText: { flex: 1, fontSize: 12, color: COLORS.textSecondary, lineHeight: 18 },

  expandRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 },
  expandLabel: { fontSize: 12, color: COLORS.textMuted },
  altList: { gap: 4 },
  altRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  altLabel: { flex: 1, fontSize: 12, color: COLORS.textSecondary },
  altPct: { fontSize: 12, color: COLORS.textMuted },

  actions: { gap: 10 },
  primaryBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, borderRadius: RADIUS.lg, paddingVertical: 16, alignItems: 'center', justifyContent: 'center', ...SHADOW.sm },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  secondaryBtn: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, paddingVertical: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: COLORS.border },
  secondaryBtnText: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
});
