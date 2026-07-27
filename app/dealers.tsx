/**
 * MundaWise — Dealer Map Screen
 * Receives: disease, chemical, confidence from results screen via router params.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator, Linking, Platform, SafeAreaView,
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { fetchNearestDealers, logLeadEvent, Dealer } from '../src/api/client';
import { COLORS, RADIUS, SHADOW } from '../src/theme';

const HARARE: Region = { latitude: -17.8292, longitude: 31.0522, latitudeDelta: 0.4, longitudeDelta: 0.4 };

export default function DealersScreen() {
  const { disease, chemical, confidence } = useLocalSearchParams<{ disease: string; chemical: string; confidence: string }>();
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [selected, setSelected] = useState<Dealer | null>(null);
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let lat = HARARE.latitude, lng = HARARE.longitude;
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        lat = loc.coords.latitude; lng = loc.coords.longitude;
      }
      setUserLoc({ lat, lng });

      try {
        if (!chemical) throw new Error('No chemical specified for this diagnosis.');
        const results = await fetchNearestDealers(lat, lng, chemical, 3);
        setDealers(results);
        if (results.length > 0) setSelected(results[0]);
        mapRef.current?.animateToRegion({ latitude: lat, longitude: lng, latitudeDelta: 0.35, longitudeDelta: 0.35 }, 800);
      } catch (e: any) {
        setError(e?.message ?? 'Could not fetch dealer data.');
      } finally {
        setLoading(false);
      }
    })();
  }, [chemical]);

  const flyTo = (dealer: Dealer) => {
    setSelected(dealer);
    mapRef.current?.animateToRegion({ latitude: dealer.latitude, longitude: dealer.longitude, latitudeDelta: 0.06, longitudeDelta: 0.06 }, 400);
  };

  const call = useCallback(async (d: Dealer) => {
    if (!d.phone) return;
    await logLeadEvent(d.id, 'call', chemical).catch(() => {});
    Linking.openURL(`tel:${d.phone.replace(/\s/g, '')}`);
  }, [chemical]);

  const directions = useCallback(async (d: Dealer) => {
    await logLeadEvent(d.id, 'directions', chemical).catch(() => {});
    const url = Platform.select({
      ios: `maps:0,0?q=${d.latitude},${d.longitude}(${encodeURIComponent(d.name)})`,
      android: `geo:${d.latitude},${d.longitude}?q=${d.latitude},${d.longitude}(${encodeURIComponent(d.name)})`,
    });
    if (url) Linking.openURL(url);
  }, [chemical]);

  if (loading) return (
    <SafeAreaView style={[styles.root, { justifyContent: 'center', alignItems: 'center' }]}>
      <ActivityIndicator size="large" color={COLORS.accent} />
      <Text style={styles.loadText}>Finding nearest dealers…</Text>
      <Text style={styles.loadSub}>Looking for {chemical}</Text>
    </SafeAreaView>
  );

  if (error || dealers.length === 0) return (
    <SafeAreaView style={[styles.root, { justifyContent: 'center', alignItems: 'center', padding: 32 }]}>
      <Text style={{ fontSize: 48, marginBottom: 16 }}>📍</Text>
      <Text style={styles.errTitle}>{error ? 'Could Not Load Dealers' : 'No Dealers Found'}</Text>
      <Text style={styles.errDesc}>{error ?? `No dealers currently stock ${chemical} in your area.`}</Text>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>← Back to Result</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.root}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={userLoc ? { latitude: userLoc.lat, longitude: userLoc.lng, latitudeDelta: 0.4, longitudeDelta: 0.4 } : HARARE}
        showsUserLocation
        showsMyLocationButton
      >
        {dealers.map((d, i) => (
          <Marker key={d.id} coordinate={{ latitude: d.latitude, longitude: d.longitude }} onPress={() => flyTo(d)}>
            <View style={[styles.pin, d.is_sponsored && styles.pinSponsored]}>
              <Text style={styles.pinNum}>{i + 1}</Text>
            </View>
            <Callout tooltip>
              <View style={styles.callout}>
                <Text style={styles.calloutName}>{d.name}</Text>
                <Text style={styles.calloutDist}>{d.distance_km} km away</Text>
                {d.is_sponsored && <Text style={styles.calloutVerified}>✓ Verified Dealer</Text>}
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Fit all button */}
      {dealers.length > 1 && (
        <TouchableOpacity
          style={styles.fitBtn}
          onPress={() => mapRef.current?.fitToCoordinates(dealers.map(d => ({ latitude: d.latitude, longitude: d.longitude })), { edgePadding: { top: 80, bottom: 300, left: 60, right: 60 }, animated: true })}
        >
          <Text style={styles.fitBtnText}>Show All {dealers.length} Dealers</Text>
        </TouchableOpacity>
      )}

      {/* Bottom panel */}
      <View style={styles.panel}>
        <View style={styles.panelHandle} />
        <Text style={styles.panelTitle}>
          {dealers.length} dealer{dealers.length !== 1 ? 's' : ''} stocking{' '}
          <Text style={styles.chemHighlight}>{chemical}</Text>
        </Text>
        {confidence && <Text style={styles.panelSub}>Diagnosis confidence: {Math.round(parseFloat(confidence) * 100)}%</Text>}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cardScroll}>
          {dealers.map((d, i) => {
            const isSelected = selected?.id === d.id;
            return (
              <TouchableOpacity key={d.id} style={[styles.dealerCard, isSelected && styles.dealerCardSelected]} onPress={() => flyTo(d)}>
                {/* Rank + verified */}
                <View style={styles.cardTopRow}>
                  <View style={[styles.rankBadge, d.is_sponsored && styles.rankBadgeSponsored]}>
                    <Text style={styles.rankNum}>#{i + 1}</Text>
                  </View>
                  {d.is_sponsored && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓ Verified</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.dealerName} numberOfLines={2}>{d.name}</Text>
                <Text style={styles.dealerAddr} numberOfLines={2}>{d.address ?? d.region ?? '—'}</Text>
                <Text style={styles.dealerDist}>📍 {d.distance_km} km away</Text>

                {d.stock && (
                  <View style={styles.stockRow}>
                    <View style={styles.stockDot} />
                    <Text style={styles.stockText}>
                      In stock{d.stock.price_usd ? ` · $${d.stock.price_usd}` : ''}
                      {d.stock.pack_size ? ` / ${d.stock.pack_size}` : ''}
                    </Text>
                  </View>
                )}

                <View style={styles.cardActions}>
                  {d.phone && (
                    <TouchableOpacity style={styles.callBtn} onPress={() => call(d)}>
                      <Text style={styles.callBtnText}>📞 Call</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={styles.dirBtn} onPress={() => directions(d)}>
                    <Text style={styles.dirBtnText}>🗺 Go</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  loadText: { fontSize: 17, fontWeight: '700', color: COLORS.text, marginTop: 16 },
  loadSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  errTitle: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  errDesc: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  backBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 28, paddingVertical: 13, borderRadius: RADIUS.lg },
  backBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  pin: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.warning, justifyContent: 'center', alignItems: 'center', borderWidth: 2.5, borderColor: '#fff', ...SHADOW.sm },
  pinSponsored: { backgroundColor: COLORS.primary },
  pinNum: { color: '#fff', fontSize: 13, fontWeight: '900' },
  callout: { backgroundColor: '#fff', borderRadius: 10, padding: 10, minWidth: 140, ...SHADOW.md },
  calloutName: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  calloutDist: { fontSize: 12, color: COLORS.textMuted },
  calloutVerified: { fontSize: 11, color: COLORS.primary, fontWeight: '700', marginTop: 3 },

  fitBtn: { position: 'absolute', top: 16, alignSelf: 'center', backgroundColor: '#fff', borderRadius: RADIUS.full, paddingHorizontal: 18, paddingVertical: 9, ...SHADOW.md },
  fitBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.primary },

  panel: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingBottom: 28, ...SHADOW.lg },
  panelHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  panelTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, paddingHorizontal: 16 },
  panelSub: { fontSize: 12, color: COLORS.textMuted, paddingHorizontal: 16, marginTop: 2, marginBottom: 12 },
  chemHighlight: { color: COLORS.primary },
  cardScroll: { paddingHorizontal: 12 },

  dealerCard: { width: 220, backgroundColor: COLORS.background, borderRadius: RADIUS.lg, padding: 14, marginHorizontal: 4, borderWidth: 2, borderColor: 'transparent' },
  dealerCardSelected: { borderColor: COLORS.primary, backgroundColor: '#fff', ...SHADOW.sm },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  rankBadge: { backgroundColor: COLORS.divider, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
  rankBadgeSponsored: { backgroundColor: COLORS.accentLight },
  rankNum: { fontSize: 11, fontWeight: '800', color: COLORS.textSecondary },
  verifiedBadge: { backgroundColor: COLORS.accentLight, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
  verifiedText: { fontSize: 10, fontWeight: '800', color: COLORS.primary },
  dealerName: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  dealerAddr: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4, lineHeight: 17 },
  dealerDist: { fontSize: 12, fontWeight: '700', color: COLORS.textSecondary, marginBottom: 8 },
  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  stockDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.success },
  stockText: { fontSize: 11, color: COLORS.textSecondary, flex: 1 },
  cardActions: { flexDirection: 'row', gap: 8 },
  callBtn: { flex: 1, backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingVertical: 9, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  callBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  dirBtn: { flex: 1, backgroundColor: COLORS.primary, borderRadius: RADIUS.md, paddingVertical: 9, alignItems: 'center' },
  dirBtnText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
