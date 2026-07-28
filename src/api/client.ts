/**
 * MundaWise — API Client
 * Typed fetch wrapper. Update BACKEND_URL after deploying to Render/Railway.
 */

export const BACKEND_URL = 'https://mundawise-backend-production.up.railway.app';
const API_KEY = '5b3074c8088329c3aee2fa7d677c6e311940a16cf7f25dc44bd7ab067a0c6160';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
      ...options?.headers,
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
  return json;
}

// ── Dealers ────────────────────────────────────────────────────────────────

export interface Dealer {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  region: string | null;
  latitude: number;
  longitude: number;
  distance_km: number;
  is_sponsored: boolean;
  stock: { chemical: string; in_stock: boolean; price_usd?: number; pack_size?: string } | null;
}

export async function fetchNearestDealers(
  lat: number,
  lng: number,
  chemical: string,
  limit = 3
): Promise<Dealer[]> {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng), chemical, limit: String(limit) });
  const res = await apiFetch<{ data: { dealers: Dealer[] } }>(`/api/dealers/nearest?${params}`);
  return res.data.dealers;
}

export async function logLeadEvent(
  dealerId: string,
  action: 'call' | 'directions',
  chemical?: string
): Promise<void> {
  await apiFetch('/api/dealers/lead', {
    method: 'POST',
    body: JSON.stringify({ dealer_id: dealerId, action, chemical }),
  });
}

// ── Scans ──────────────────────────────────────────────────────────────────

export interface ScanPayload {
  crop: string;
  disease_detected: string;
  confidence: number;
  region?: string;
  phone_number?: string;
  scanned_at: string;
}

export async function postScan(payload: ScanPayload): Promise<{ id: string }> {
  const res = await apiFetch<{ data: { id: string } }>('/api/scans', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export async function fetchScanSummary(): Promise<{
  totals: { scans: number; disease_detections: number; active_regions: number };
  top_diseases: { disease_detected: string; count: string }[];
}> {
  const res = await apiFetch<{ data: { totals: any; top_diseases: any[] } }>('/api/scans/summary');
  return res.data;
}

// ── Farmers ────────────────────────────────────────────────────────────────

export async function registerFarmer(
  phone_number: string,
  language_pref: 'en' | 'sn' | 'nd' = 'en',
  region?: string
): Promise<void> {
  await apiFetch('/api/farmers', {
    method: 'POST',
    body: JSON.stringify({ phone_number, language_pref, region }),
  });
}
