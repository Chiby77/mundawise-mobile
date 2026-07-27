import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClassificationResult } from './classifier';
import { extractCropName } from './labels';

const SCANS_KEY = '@mundawise:scans';
const QUEUE_KEY = '@mundawise:sync_queue';
const MAX = 100;

export interface CachedScan {
  id: string;
  imageUri: string;
  result: ClassificationResult;
  farmerPhone?: string;
  region?: string;
  synced: boolean;
  createdAt: number;
}

export async function saveScan(imageUri: string, result: ClassificationResult, meta?: { farmerPhone?: string; region?: string }): Promise<CachedScan> {
  const scan: CachedScan = { id: `scan_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, imageUri, result, ...meta, synced: false, createdAt: Date.now() };
  const existing = await getScans();
  await AsyncStorage.setItem(SCANS_KEY, JSON.stringify([scan, ...existing].slice(0, MAX)));
  await enqueue(scan.id);
  return scan;
}

export async function getScans(): Promise<CachedScan[]> {
  try { const r = await AsyncStorage.getItem(SCANS_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}

async function enqueue(id: string): Promise<void> {
  const q = await getQueue();
  if (!q.includes(id)) await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify([...q, id]));
}

async function getQueue(): Promise<string[]> {
  try { const r = await AsyncStorage.getItem(QUEUE_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}

export async function syncPendingScans(backendUrl: string): Promise<{ synced: number; failed: number }> {
  const queue = await getQueue();
  if (!queue.length) return { synced: 0, failed: 0 };
  const all = await getScans();
  const pending = all.filter(s => queue.includes(s.id) && !s.synced);
  let synced = 0, failed = 0;
  for (const scan of pending) {
    try {
      const res = await fetch(`${backendUrl}/api/scans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop: extractCropName(scan.result.label), disease_detected: scan.result.label, confidence: scan.result.confidence, region: scan.region ?? null, phone_number: scan.farmerPhone ?? null, scanned_at: new Date(scan.createdAt).toISOString() }),
      });
      if (res.ok) { await markSynced(scan.id); synced++; } else failed++;
    } catch { failed++; }
  }
  return { synced, failed };
}

async function markSynced(id: string): Promise<void> {
  const scans = await getScans();
  await AsyncStorage.setItem(SCANS_KEY, JSON.stringify(scans.map(s => s.id === id ? { ...s, synced: true } : s)));
  const q = await getQueue();
  await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(q.filter(i => i !== id)));
}

export async function clearAllScans(): Promise<void> {
  await AsyncStorage.multiRemove([SCANS_KEY, QUEUE_KEY]);
}
