import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { COLORS } from '../theme';

export function OfflineBanner() {
  const [offline, setOffline] = useState(false);
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return NetInfo.addEventListener((s) => {
      const isOffline = !s.isConnected || !s.isInternetReachable;
      setOffline(isOffline);
      Animated.timing(opacity, { toValue: isOffline ? 1 : 0, duration: 350, useNativeDriver: true }).start();
    });
  }, [opacity]);

  return (
    <Animated.View style={[styles.banner, { opacity }]} pointerEvents={offline ? 'auto' : 'none'}>
      <Text style={styles.icon}>📵</Text>
      <Text style={styles.text}>Offline mode — diagnoses save locally and sync when reconnected</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#B45309', paddingHorizontal: 16, paddingVertical: 9, gap: 10 },
  icon: { fontSize: 14 },
  text: { flex: 1, color: '#fff', fontSize: 12, fontWeight: '600', lineHeight: 17 },
});
