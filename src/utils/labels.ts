export interface DiseaseInfo {
  name: string;
  nameShona: string;
  nameNdebele?: string;
  severity: 'Healthy' | 'Low' | 'Medium' | 'High';
  color: string;
  treatment: string;
  treatmentShona: string;
  chemical?: string;
  dosage?: string;
  preventionTip?: string;
}

const DISEASE_INFO: Record<string, DiseaseInfo> = {
  'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot': {
    name: 'Gray Leaf Spot', nameShona: 'Chirwere cheMashizha — Nhema', severity: 'High', color: '#DC2626',
    treatment: 'Apply Mancozeb 80% WP at 2.0–2.5 kg/ha. Remove infected lower leaves. Improve field drainage. Re-apply after 14 days.',
    treatmentShona: 'Shandisa Mancozeb 80% WP pa 2.0–2.5 kg/ha. Bvisa mashizha ane chirwere. Dzokera mushonga mushure memazuva 14.',
    chemical: 'Mancozeb 80% WP', dosage: '2.0–2.5 kg/ha', preventionTip: 'Use certified disease-resistant seed. Rotate with legumes.',
  },
  'Corn_(maize)___Common_rust_': {
    name: 'Common Rust', nameShona: 'Chirwere cheRusiti', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Propiconazole 25% EC at 0.5 L/ha. Scout from early tasseling. Switch to rust-tolerant hybrid next season.',
    treatmentShona: 'Shandisa Propiconazole 25% EC pa 0.5 L/ha. Tarisisa minda panguva yekura kwezvirimwa.',
    chemical: 'Propiconazole 25% EC', dosage: '0.5 L/ha', preventionTip: 'Plant early to avoid peak rust weather.',
  },
  'Corn_(maize)___Northern_Leaf_Blight': {
    name: 'Northern Leaf Blight', nameShona: 'Chirwere cheMashizha — Kuputika', severity: 'High', color: '#DC2626',
    treatment: 'Apply Azoxystrobin 23% SC at 0.8–1.0 L/ha at first signs. Rotate with soybean or groundnut next season.',
    treatmentShona: 'Shandisa Azoxystrobin 23% SC pa 0.8–1.0 L/ha paunowe zviratidzo zvekutanga.',
    chemical: 'Azoxystrobin 23% SC', dosage: '0.8–1.0 L/ha', preventionTip: 'Maintain balanced N-P-K fertilisation.',
  },
  'Corn_(maize)___healthy': {
    name: 'Healthy Crop', nameShona: 'Zvirimwa Zvine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'No disease detected. Continue scouting every 7–10 days and maintain balanced fertilisation.',
    treatmentShona: 'Chirwere hachiwanike. Ramba uchitarisisa minda mazuva 7–10.',
  },
  'Tomato___Bacterial_spot': {
    name: 'Bacterial Spot (Tomato)', nameShona: 'Chirwere cheBacterial — Tomato', severity: 'High', color: '#DC2626',
    treatment: 'Apply Copper Hydroxide 77% WP at 2.5 kg/ha. Remove infected plants immediately. Use drip irrigation.',
    treatmentShona: 'Shandisa Copper Hydroxide 77% WP pa 2.5 kg/ha. Bvisa zvirimwa zvine chirwere pakarepo.',
    chemical: 'Copper Hydroxide 77% WP', dosage: '2.5 kg/ha',
  },
  'Tomato___Early_blight': {
    name: 'Early Blight (Tomato)', nameShona: 'Chirwere cheKutanga — Tomato', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Chlorothalonil 75% WP at 1.5–2.0 kg/ha. Remove infected lower leaves. Mulch soil.',
    treatmentShona: 'Shandisa Chlorothalonil 75% WP pa 1.5–2.0 kg/ha. Bvisa mashizha ane chirwere ari pasi.',
    chemical: 'Chlorothalonil 75% WP', dosage: '1.5–2.0 kg/ha',
  },
  'Tomato___Late_blight': {
    name: 'Late Blight (Tomato)', nameShona: 'Chirwere cheMagumo — Tomato', severity: 'High', color: '#DC2626',
    treatment: 'Apply Metalaxyl-M + Mancozeb at 2.5 kg/ha IMMEDIATELY — spreads rapidly. Destroy infected plants.',
    treatmentShona: 'Shandisa Metalaxyl-M + Mancozeb pa 2.5 kg/ha PAKAREPO — chirwere ichi chinopararira nekukurumidza.',
    chemical: 'Metalaxyl-M + Mancozeb', dosage: '2.5 kg/ha',
  },
  'Tomato___healthy': {
    name: 'Healthy Tomato', nameShona: 'Tomato Rine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Your tomato crop is healthy. Continue regular scouting every 7 days.',
    treatmentShona: 'Tomato yako ine utano. Ramba uchitarisisa minda mazuva 7.',
  },
  'Potato___Early_blight': {
    name: 'Early Blight (Potato)', nameShona: 'Chirwere cheKutanga — Mbatata', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Mancozeb 80% WP at 2.0 kg/ha every 10–14 days. Ensure adequate plant nutrition.',
    treatmentShona: 'Shandisa Mancozeb 80% WP pa 2.0 kg/ha mazuva 10–14.',
    chemical: 'Mancozeb 80% WP', dosage: '2.0 kg/ha',
  },
  'Potato___Late_blight': {
    name: 'Late Blight (Potato)', nameShona: 'Chirwere cheMagumo — Mbatata', severity: 'High', color: '#DC2626',
    treatment: 'Apply Cymoxanil + Mancozeb at 2.5 kg/ha immediately. Hill up soil to protect tubers.',
    treatmentShona: 'Shandisa Cymoxanil + Mancozeb pa 2.5 kg/ha pakarepo. Wedzera ivhu kudzikidza dzezvirimwa.',
    chemical: 'Cymoxanil + Mancozeb', dosage: '2.5 kg/ha',
  },
  'Potato___healthy': {
    name: 'Healthy Potato', nameShona: 'Mbatata Ine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Potato crop is healthy. Scout regularly and maintain soil moisture.',
    treatmentShona: 'Mbatata ine utano. Ramba uchitarisisa uye unenge mvura yakakwana.',
  },
};

export function getLabelInfo(label: string): DiseaseInfo {
  if (DISEASE_INFO[label]) return DISEASE_INFO[label];
  const clean = label.replace(/[_()]/g, ' ').replace(/\s+/g, ' ').trim();
  const isHealthy = label.toLowerCase().includes('healthy');
  return {
    name: clean.split('___').map((s: string) => s.trim()).join(' — '),
    nameShona: clean,
    severity: isHealthy ? 'Healthy' : 'Medium',
    color: isHealthy ? '#16A34A' : '#6B7280',
    treatment: isHealthy ? 'Crop appears healthy. Continue regular monitoring.' : 'Consult a local agronomist for specific treatment advice.',
    treatmentShona: isHealthy ? 'Zvirimwa zvine utano. Ramba uchitarisisa minda.' : 'Tsvaga murimi wenyanzvi kukubatsira.',
  };
}

export function extractCropName(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('corn') || l.includes('maize')) return 'maize';
  if (l.includes('tomato')) return 'tomato';
  if (l.includes('potato')) return 'potato';
  if (l.includes('soybean')) return 'soybean';
  return 'unknown';
}
