import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList, RefreshControl, SafeAreaView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getScans, CachedScan, clearAllScans } from '../../src/utils/cache';
import { COLORS, RADIUS, SEVERITY_CONFIG, SHADOW } from '../../src/theme';

export default function HistoryScreen() {
  const [scans, setScans] = useState<CachedScan[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    setScans(await getScans());
  }, []);

  useEffect(() => { load(); }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  }, [load]);

  const renderScan = ({ item }: { item: CachedScan }) => {
    const info = item.result?.info;
    const pct = Math.round((item.result?.confidence ?? 0) * 100);
    const sev = SEVERITY_CONFIG[info?.severity ?? 'Medium'];
    const date = new Date(item.createdAt);

    return (
      <TouchableOpacity
        style={[styles.card, SHADOW.sm]}
        onPress={() => router.push({ pathname: '/results', params: { resultJson: JSON.stringify(item.result), imageUri: item.imageUri } })}
        activeOpacity={0.75}
      >
        <View style={styles.cardLeft}>
          <View style={[styles.sevDot, { backgroundColor: info?.color ?? '#888' }]} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.cardTop}>
            <Text style={styles.diseaseName} numberOfLines={1}>{info?.name ?? item.result?.label?.replace(/_/g,' ') ?? 'Unknown'}</Text>
            <View style={[styles.sevPill, { backgroundColor: sev.bg }]}>
              <Text style={[styles.sevPillText, { color: sev.text }]}>{info?.severity}</Text>
            </View>
          </View>
          <Text style={styles.shona} numberOfLines={1}>{info?.nameShona ?? ''}</Text>
          <View style={styles.cardMeta}>
            <Text style={styles.metaText}>
              {date.toLocaleDateString('en-ZW', { day: 'numeric', month: 'short' })} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Text style={styles.metaConf}>{pct}% confidence</Text>
            {!item.synced && (
              <View style={styles.unsyncBadge}>
                <Ionicons name="time-outline" size={10} color={COLORS.warning} />
                <Text style={styles.unsyncText}> Pending sync</Text>
              </View>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      {/* Stats bar */}
      <View style={styles.statsBar}>
        <StatChip icon="search" value={scans.length} label="Total Scans" />
        <StatChip icon="warning" value={scans.filter(s => s.result?.info?.severity !== 'Healthy').length} label="Diseases" />
        <StatChip icon="checkmark-circle" value={scans.filter(s => s.result?.info?.severity === 'Healthy').length} label="Healthy" />
      </View>

      <FlatList
        data={scans}
        keyExtractor={(item) => item.id}
        renderItem={renderScan}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.accent} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="leaf-outline" size={56} color={COLORS.textMuted} style={{ marginBottom: 16 }} />
            <Text style={styles.emptyTitle}>No scans yet</Text>
            <Text style={styles.emptyDesc}>Go to the Diagnose tab and take your first crop scan.</Text>
          </View>
        }
        ListFooterComponent={
          scans.length > 0 ? (
            <TouchableOpacity style={styles.clearBtn} onPress={async () => { await clearAllScans(); load(); }}>
              <Ionicons name="trash-outline" size={15} color={COLORS.danger} />
              <Text style={styles.clearText}>  Clear all history</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

function StatChip({ icon, value, label }: { icon: React.ComponentProps<typeof Ionicons>['name']; value: number; label: string }) {
  return (
    <View style={styles.chip}>
      <Ionicons name={icon} size={20} color="#fff" style={{ marginBottom: 2 }} />
      <Text style={styles.chipValue}>{value}</Text>
      <Text style={styles.chipLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  statsBar: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingVertical: 16, paddingHorizontal: 12, gap: 8 },
  chip: { flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: RADIUS.md, paddingVertical: 10 },
  chipValue: { fontSize: 22, fontWeight: '800', color: '#fff' },
  chipLabel: { fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: '600', marginTop: 1 },

  list: { padding: 14, gap: 10, paddingBottom: 40 },
  card: { flexDirection: 'row', backgroundColor: COLORS.surface, borderRadius: RADIUS.lg, padding: 14, gap: 12, alignItems: 'center' },
  cardLeft: { justifyContent: 'center' },
  sevDot: { width: 12, height: 12, borderRadius: 6 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  diseaseName: { flex: 1, fontSize: 14, fontWeight: '700', color: COLORS.text },
  sevPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: RADIUS.full },
  sevPillText: { fontSize: 10, fontWeight: '700' },
  shona: { fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic', marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  metaConf: { fontSize: 11, color: COLORS.textSecondary, fontWeight: '600' },
  unsyncBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', paddingHorizontal: 6, paddingVertical: 2, borderRadius: RADIUS.full },
  unsyncText: { fontSize: 10, color: COLORS.warning },

  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22 },

  clearBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, marginTop: 8 },
  clearText: { fontSize: 13, color: COLORS.danger },
});
