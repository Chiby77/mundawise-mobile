import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator, RefreshControl, SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fetchScanSummary } from '../../src/api/client';
import { COLORS, RADIUS, SHADOW } from '../../src/theme';

interface TopDisease { disease_detected: string; count: string }

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function getDiseaseIcon(disease: string): IoniconsName {
  const d = disease.toLowerCase();
  if (d.includes('rust')) return 'alert-circle';
  if (d.includes('blight')) return 'flame';
  if (d.includes('spot')) return 'ellipse';
  if (d.includes('mold')) return 'cloud';
  if (d.includes('virus')) return 'nuclear';
  if (d.includes('healthy')) return 'checkmark-circle';
  return 'warning';
}

function getDiseaseColor(disease: string): string {
  const d = disease.toLowerCase();
  if (d.includes('healthy')) return COLORS.success ?? '#16A34A';
  if (d.includes('blight') || d.includes('virus')) return COLORS.danger;
  return COLORS.warning;
}

function formatDisease(raw: string): string {
  return raw.replace(/[_()]/g, ' ').replace(/\s+/g, ' ').trim()
    .split('___').map(s => s.trim()).join(' — ');
}

export default function AlertsScreen() {
  const [data, setData] = useState<{ totals: any; top_diseases: TopDisease[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const summary = await fetchScanSummary();
      setData(summary);
    } catch (e: any) {
      setError('Could not load outbreak data. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <SafeAreaView style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={COLORS.accent} />
      <Text style={styles.loadText}>Loading outbreak data…</Text>
    </SafeAreaView>
  );

  if (error) return (
    <SafeAreaView style={[styles.root, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
      <Ionicons name="wifi-outline" size={48} color={COLORS.textMuted} style={{ marginBottom: 16 }} />
      <Text style={styles.errorTitle}>No data available</Text>
      <Text style={styles.errorDesc}>{error}</Text>
      <TouchableOpacity style={styles.retryBtn} onPress={load}>
        <Text style={styles.retryText}>Try Again</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={COLORS.accent} />}
      >
        {/* Header banner */}
        <View style={styles.banner}>
          <View style={styles.bannerRow}>
            <Ionicons name="radio" size={18} color="#fff" />
            <Text style={styles.bannerTitle}> Zimbabwe Crop Outbreak Monitor</Text>
          </View>
          <Text style={styles.bannerSub}>Live data from MundaWise field scans · Last 30 days</Text>
        </View>

        {/* National totals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>National Summary</Text>
          <View style={styles.statsGrid}>
            <StatCard icon="search" value={data?.totals?.scans ?? 0} label="Total Scans" color={COLORS.primary} />
            <StatCard icon="bug" value={data?.totals?.disease_detections ?? 0} label="Diseases" color={COLORS.danger} />
            <StatCard icon="map" value={data?.totals?.active_regions ?? 0} label="Districts" color={COLORS.warning} />
          </View>
        </View>

        {/* Top diseases */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Active Threats</Text>
          {(data?.top_diseases ?? []).length === 0 ? (
            <View style={[styles.card, { alignItems: 'center', padding: 24 }]}>
              <Ionicons name="checkmark-circle" size={40} color={COLORS.success ?? '#16A34A'} style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 15, fontWeight: '700', color: COLORS.text }}>No active outbreaks</Text>
              <Text style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>All monitored crops are healthy.</Text>
            </View>
          ) : (data?.top_diseases ?? []).map((d, i) => (
            <View key={i} style={[styles.card, SHADOW.sm]}>
              <View style={styles.alertRow}>
                <View style={styles.alertRank}>
                  <Text style={styles.alertRankNum}>#{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.alertTopRow}>
                    <Ionicons name={getDiseaseIcon(d.disease_detected)} size={20} color={getDiseaseColor(d.disease_detected)} style={{ marginTop: 1 }} />
                    <Text style={styles.alertName} numberOfLines={2}>{formatDisease(d.disease_detected)}</Text>
                  </View>
                  <View style={styles.alertMeta}>
                    <View style={[styles.alertCountBadge, { backgroundColor: i === 0 ? COLORS.dangerLight : '#FFF7ED' }]}>
                      <Text style={[styles.alertCountText, { color: i === 0 ? COLORS.danger : COLORS.warning }]}>
                        {d.count} reports
                      </Text>
                    </View>
                    {i === 0 && (
                      <View style={styles.alertHighBadge}>
                        <Text style={styles.alertHighText}>HIGHEST THREAT</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <View style={styles.threatBar}>
                <View style={[styles.threatFill, {
                  width: `${Math.round((parseInt(d.count) / parseInt(data!.top_diseases[0].count)) * 100)}%`,
                  backgroundColor: i === 0 ? COLORS.danger : COLORS.warning,
                }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Info footer */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color="#1E40AF" style={{ marginTop: 1 }} />
          <Text style={styles.infoText}>
            Outbreak alerts are generated automatically from farmer scans. If you detect a disease, scanning it helps protect your community.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, value, label, color }: { icon: IoniconsName; value: number; label: string; color: string }) {
  return (
    <View style={[styles.statCard, { borderTopColor: color, borderTopWidth: 3 }]}>
      <Ionicons name={icon} size={24} color={color} style={{ marginBottom: 4 }} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  scroll: { paddingBottom: 40 },
  loadText: { marginTop: 12, color: COLORS.textSecondary, fontSize: 14 },

  banner: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 24 },
  bannerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  bannerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.65)', fontSize: 12 },

  section: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: COLORS.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 },

  statsGrid: { flexDirection: 'row', gap: 10 },
  statCard: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 12, alignItems: 'center', ...SHADOW.sm },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600', marginTop: 2, textAlign: 'center' },

  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 14, marginBottom: 10 },
  alertRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
  alertRank: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
  alertRankNum: { fontSize: 13, fontWeight: '800', color: COLORS.textSecondary },
  alertTopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 6 },
  alertName: { flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.text, lineHeight: 20 },
  alertMeta: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  alertCountBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  alertCountText: { fontSize: 11, fontWeight: '700' },
  alertHighBadge: { backgroundColor: '#FFEBEE', paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  alertHighText: { fontSize: 9, fontWeight: '800', color: COLORS.danger, letterSpacing: 0.5 },
  threatBar: { height: 5, backgroundColor: COLORS.divider, borderRadius: 3, overflow: 'hidden' },
  threatFill: { height: 5, borderRadius: 3 },

  infoCard: { flexDirection: 'row', margin: 16, backgroundColor: '#EFF6FF', borderRadius: RADIUS.lg, padding: 14, gap: 10, alignItems: 'flex-start' },
  infoText: { flex: 1, fontSize: 12, color: '#1E40AF', lineHeight: 18 },

  errorTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  errorDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  retryBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 12, borderRadius: RADIUS.lg },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
