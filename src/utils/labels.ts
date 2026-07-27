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

  // ── APPLE ────────────────────────────────────────────────────────────────

  'Apple___Apple_scab': {
    name: 'Apple Scab', nameShona: 'Chirwere cheScab — Apuro', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Myclobutanil or Captan at label rate. Remove fallen leaves. Prune for airflow. Begin sprays at bud break.',
    treatmentShona: 'Shandisa Myclobutanil kana Captan. Bvisa mashizha akawira pasi. Pura miti kuti mhepo ipinde.',
    chemical: 'Myclobutanil 40% WP', dosage: '0.5 g/L water', preventionTip: 'Plant scab-resistant apple varieties.',
  },
  'Apple___Black_rot': {
    name: 'Apple Black Rot', nameShona: 'Chirwere cheHuori Hwema — Apuro', severity: 'High', color: '#DC2626',
    treatment: 'Remove mummified fruit and dead wood. Apply Captan 50% WP at 2.5 kg/ha. Repeat every 10–14 days.',
    treatmentShona: 'Bvisa zvibereko zvakaomeswa uye mapanda akafa. Shandisa Captan 50% WP pa 2.5 kg/ha.',
    chemical: 'Captan 50% WP', dosage: '2.5 kg/ha', preventionTip: 'Prune infected limbs 15 cm below visible canker.',
  },
  'Apple___Cedar_apple_rust': {
    name: 'Cedar Apple Rust', nameShona: 'Chirwere cheRusiti — Apuro', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Myclobutanil or Propiconazole at pink bud stage. Remove nearby juniper/cedar trees if possible.',
    treatmentShona: 'Shandisa Myclobutanil kana Propiconazole panguva yebud. Bvisa miti yeJuniper iri pedyo.',
    chemical: 'Propiconazole 25% EC', dosage: '0.5 L/ha', preventionTip: 'Avoid planting apple near cedar/juniper.',
  },
  'Apple___healthy': {
    name: 'Healthy Apple', nameShona: 'Apuro Rine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Apple crop is healthy. Maintain regular scouting and balanced fertilisation.',
    treatmentShona: 'Apuro rine utano. Ramba uchitarisisa uye uchipa mbofu yakakwana.',
  },

  // ── BLUEBERRY ────────────────────────────────────────────────────────────

  'Blueberry___healthy': {
    name: 'Healthy Blueberry', nameShona: 'Blueberry Ine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Blueberry crop is healthy. Maintain acidic soil pH (4.5–5.5) and scout regularly.',
    treatmentShona: 'Blueberry ine utano. Chengetedza pH yeivhu (4.5–5.5).',
  },

  // ── CHERRY ───────────────────────────────────────────────────────────────

  'Cherry_(including_sour)___Powdery_mildew': {
    name: 'Powdery Mildew (Cherry)', nameShona: 'Chirwere chePowdery Mildew — Cheri', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Sulphur 80% WP at 2.0–3.0 kg/ha or Potassium bicarbonate. Improve canopy airflow by pruning.',
    treatmentShona: 'Shandisa Sulphur 80% WP pa 2.0–3.0 kg/ha. Pura miti kuti mhepo ipinde mukati.',
    chemical: 'Sulphur 80% WP', dosage: '2.0–3.0 kg/ha', preventionTip: 'Avoid overhead irrigation — water at the base.',
  },
  'Cherry_(including_sour)___healthy': {
    name: 'Healthy Cherry', nameShona: 'Cheri Rine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Cherry crop is healthy. Scout every 7 days during humid weather.',
    treatmentShona: 'Cheri rine utano. Tarisisa minda mazuva 7 panguva yemvura.',
  },

  // ── MAIZE / CORN ─────────────────────────────────────────────────────────

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
    name: 'Healthy Maize', nameShona: 'Zvirimwa Zvine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'No disease detected. Continue scouting every 7–10 days and maintain balanced fertilisation.',
    treatmentShona: 'Chirwere hachiwanike. Ramba uchitarisisa minda mazuva 7–10.',
  },

  // ── GRAPE ────────────────────────────────────────────────────────────────

  'Grape___Black_rot': {
    name: 'Grape Black Rot', nameShona: 'Chirwere cheHuori Hwema — Muzambiringa', severity: 'High', color: '#DC2626',
    treatment: 'Apply Myclobutanil or Mancozeb from bud break. Remove mummified berries. Ensure good canopy airflow.',
    treatmentShona: 'Shandisa Myclobutanil kana Mancozeb kubva pakutanga kwemwaka. Bvisa zvibereko zvakaomeswa.',
    chemical: 'Myclobutanil 40% WP', dosage: '0.4 g/L water', preventionTip: 'Remove all mummified fruit before dormancy ends.',
  },
  'Grape___Esca_(Black_Measles)': {
    name: 'Esca (Black Measles)', nameShona: 'Chirwere cheEsca — Muzambiringa', severity: 'High', color: '#DC2626',
    treatment: 'No chemical cure. Remove and destroy infected vines. Protect pruning wounds with wound sealant. Avoid stress.',
    treatmentShona: 'Hapana mushonga. Bvisa uye tsemura miti ine chirwere. Dzivisa kushungurudzika kwemiti.',
    preventionTip: 'Make clean pruning cuts and apply wound protectant immediately.',
  },
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    name: 'Leaf Blight / Isariopsis Leaf Spot', nameShona: 'Chirwere cheMashizha — Muzambiringa', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Mancozeb 80% WP at 2.0 kg/ha. Improve row spacing for airflow. Remove infected leaves.',
    treatmentShona: 'Shandisa Mancozeb 80% WP pa 2.0 kg/ha. Wedzera nzvimbo pakati pemitsara kuti mhepo ipinde.',
    chemical: 'Mancozeb 80% WP', dosage: '2.0 kg/ha',
  },
  'Grape___healthy': {
    name: 'Healthy Grape', nameShona: 'Muzambiringa une Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Grape vine is healthy. Scout weekly and maintain trellising for good airflow.',
    treatmentShona: 'Muzambiringa une utano. Tarisisa vhiki rega rega.',
  },

  // ── ORANGE ───────────────────────────────────────────────────────────────

  'Orange___Haunglongbing_(Citrus_greening)': {
    name: 'Citrus Greening (HLB)', nameShona: 'Chirwere cheGreening — Orenji', severity: 'High', color: '#DC2626',
    treatment: 'No cure exists. Remove and destroy infected trees immediately to prevent spread. Control Asian citrus psyllid vector with Imidacloprid.',
    treatmentShona: 'Hapana mushonga. Bvisa uye tsemura miti ine chirwere pakarepo kuzvivandudza. Uraya nhungurwa neImidacloprid.',
    chemical: 'Imidacloprid 200 SL', dosage: '0.3 mL/L water', preventionTip: 'Plant certified HLB-free nursery stock only.',
  },

  // ── PEACH ────────────────────────────────────────────────────────────────

  'Peach___Bacterial_spot': {
    name: 'Bacterial Spot (Peach)', nameShona: 'Chirwere cheBacterial — Pichi', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Copper Hydroxide 77% WP at 2.5 kg/ha preventively. Avoid overhead irrigation. Use resistant varieties.',
    treatmentShona: 'Shandisa Copper Hydroxide 77% WP pa 2.5 kg/ha. Dzivisa kunyeveresa kwemvura pamusoro pemiti.',
    chemical: 'Copper Hydroxide 77% WP', dosage: '2.5 kg/ha', preventionTip: 'Plant in well-drained sites — avoid frost pockets.',
  },
  'Peach___healthy': {
    name: 'Healthy Peach', nameShona: 'Pichi Rine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Peach tree is healthy. Scout regularly and apply dormant copper spray before bud break.',
    treatmentShona: 'Pichi rine utano. Tarisisa nguva dzose uye shandisa copper panguva yehutare.',
  },

  // ── PEPPER ───────────────────────────────────────────────────────────────

  'Pepper,_bell___Bacterial_spot': {
    name: 'Bacterial Spot (Pepper)', nameShona: 'Chirwere cheBacterial — Pepere', severity: 'High', color: '#DC2626',
    treatment: 'Apply Copper Hydroxide 77% WP at 2.5 kg/ha every 7–10 days. Use drip irrigation. Destroy infected plant debris.',
    treatmentShona: 'Shandisa Copper Hydroxide 77% WP pa 2.5 kg/ha mazuva 7–10. Tsemura zvidodzo zvine chirwere.',
    chemical: 'Copper Hydroxide 77% WP', dosage: '2.5 kg/ha', preventionTip: 'Use certified disease-free transplants.',
  },
  'Pepper,_bell___healthy': {
    name: 'Healthy Bell Pepper', nameShona: 'Pepere Rine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Bell pepper is healthy. Maintain consistent moisture and scout weekly.',
    treatmentShona: 'Pepere rine utano. Chengetedza mvura yakaenzana uye tarisisa vhiki rega rega.',
  },

  // ── POTATO ───────────────────────────────────────────────────────────────

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

  // ── RASPBERRY ────────────────────────────────────────────────────────────

  'Raspberry___healthy': {
    name: 'Healthy Raspberry', nameShona: 'Raspberry Ine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Raspberry canes are healthy. Prune old canes after harvest and maintain good spacing.',
    treatmentShona: 'Raspberry ine utano. Pura mapanda akura mushure mekukohwa.',
  },

  // ── SOYBEAN ──────────────────────────────────────────────────────────────

  'Soybean___healthy': {
    name: 'Healthy Soybean', nameShona: 'Soybean Ine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Soybean crop is healthy. Scout for aphids and pod borers from flowering stage.',
    treatmentShona: 'Soybean ine utano. Tarisisa nhungurwa kubva panguva yekuomba.',
    preventionTip: 'Inoculate seed with Bradyrhizobium to fix nitrogen naturally.',
  },

  // ── SQUASH ───────────────────────────────────────────────────────────────

  'Squash___Powdery_mildew': {
    name: 'Powdery Mildew (Squash)', nameShona: 'Chirwere chePowdery Mildew — Squash', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Sulphur 80% WP at 2.0 kg/ha or potassium bicarbonate spray. Remove heavily infected leaves.',
    treatmentShona: 'Shandisa Sulphur 80% WP pa 2.0 kg/ha. Bvisa mashizha ane chirwere zvakanyanya.',
    chemical: 'Sulphur 80% WP', dosage: '2.0 kg/ha', preventionTip: 'Ensure wide plant spacing for airflow.',
  },

  // ── STRAWBERRY ───────────────────────────────────────────────────────────

  'Strawberry___Leaf_scorch': {
    name: 'Leaf Scorch (Strawberry)', nameShona: 'Chirwere cheMashizha Kupisa — Sitrobheri', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Myclobutanil or Captan at label rate. Remove infected leaves. Renovate planting after harvest.',
    treatmentShona: 'Shandisa Myclobutanil kana Captan. Bvisa mashizha ane chirwere. Gadziridza munda mushure mekukohwa.',
    chemical: 'Captan 50% WP', dosage: '2.0 kg/ha', preventionTip: 'Avoid overhead irrigation to reduce leaf wetness.',
  },
  'Strawberry___healthy': {
    name: 'Healthy Strawberry', nameShona: 'Sitrobheri Ine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Strawberry plants are healthy. Keep beds weed-free and scout for spider mites.',
    treatmentShona: 'Sitrobheri ine utano. Chengetedza munda usina makwenzi uye tarisisa nhungurwa.',
  },

  // ── TOMATO ───────────────────────────────────────────────────────────────

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
  'Tomato___Leaf_Mold': {
    name: 'Leaf Mold (Tomato)', nameShona: 'Chirwere cheMold — Tomato', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Chlorothalonil 75% WP at 2.0 kg/ha. Increase greenhouse ventilation. Reduce humidity below 85%.',
    treatmentShona: 'Shandisa Chlorothalonil 75% WP pa 2.0 kg/ha. Wedzera mhepo muimba yeminda. Deredza humidity.',
    chemical: 'Chlorothalonil 75% WP', dosage: '2.0 kg/ha', preventionTip: 'Use resistant varieties in high-humidity areas.',
  },
  'Tomato___Septoria_leaf_spot': {
    name: 'Septoria Leaf Spot (Tomato)', nameShona: 'Chirwere cheSeptoria — Tomato', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Mancozeb 80% WP at 2.0 kg/ha every 10 days. Remove lower infected leaves. Avoid wetting foliage.',
    treatmentShona: 'Shandisa Mancozeb 80% WP pa 2.0 kg/ha mazuva 10. Bvisa mashizha ane chirwere ari pasi.',
    chemical: 'Mancozeb 80% WP', dosage: '2.0 kg/ha', preventionTip: 'Stake plants to keep foliage off the ground.',
  },
  'Tomato___Spider_mites_Two-spotted_spider_mite': {
    name: 'Spider Mites (Tomato)', nameShona: 'Nyengetere — Tomato', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Abamectin 1.8% EC at 0.5 L/ha or Sulphur 80% WP. Target undersides of leaves. Repeat every 7 days.',
    treatmentShona: 'Shandisa Abamectin 1.8% EC pa 0.5 L/ha kana Sulphur 80% WP. Tarisira pasi pemashizha.',
    chemical: 'Abamectin 1.8% EC', dosage: '0.5 L/ha', preventionTip: 'Avoid over-applying nitrogen — lush growth attracts mites.',
  },
  'Tomato___Target_Spot': {
    name: 'Target Spot (Tomato)', nameShona: 'Chirwere cheTarget Spot — Tomato', severity: 'Medium', color: '#D97706',
    treatment: 'Apply Azoxystrobin 23% SC at 0.8 L/ha at first sign of symptoms. Improve canopy airflow.',
    treatmentShona: 'Shandisa Azoxystrobin 23% SC pa 0.8 L/ha paunowe zviratidzo zvekutanga. Wedzera mhepo.',
    chemical: 'Azoxystrobin 23% SC', dosage: '0.8 L/ha',
  },
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    name: 'Yellow Leaf Curl Virus (Tomato)', nameShona: 'Chirwere cheVhairasi — Tomato', severity: 'High', color: '#DC2626',
    treatment: 'No cure. Remove and destroy infected plants. Control whitefly vector with Imidacloprid 200 SL. Use UV-reflective mulch.',
    treatmentShona: 'Hapana mushonga. Bvisa uye tsemura zvirimwa zvine chirwere. Uraya nhungurwa dzewhitefly neImidacloprid.',
    chemical: 'Imidacloprid 200 SL', dosage: '0.3 mL/L water', preventionTip: 'Use virus-resistant tomato varieties and insect-proof nets.',
  },
  'Tomato___Tomato_mosaic_virus': {
    name: 'Tomato Mosaic Virus', nameShona: 'Chirwere cheVhairasi yeMosaic — Tomato', severity: 'High', color: '#DC2626',
    treatment: 'No cure. Remove infected plants immediately. Disinfect tools with 10% bleach. Control aphid vectors.',
    treatmentShona: 'Hapana mushonga. Bvisa zvirimwa zvine chirwere pakarepo. Suka zvishandiso nesolution yechlorine.',
    chemical: 'Imidacloprid 200 SL', dosage: '0.3 mL/L water', preventionTip: 'Wash hands before handling plants. Use certified seed.',
  },
  'Tomato___healthy': {
    name: 'Healthy Tomato', nameShona: 'Tomato Rine Utano', severity: 'Healthy', color: '#16A34A',
    treatment: 'Your tomato crop is healthy. Continue regular scouting every 7 days.',
    treatmentShona: 'Tomato yako ine utano. Ramba uchitarisisa minda mazuva 7.',
  },
};

export function getLabelInfo(label: string): DiseaseInfo {
  if (DISEASE_INFO[label]) return DISEASE_INFO[label];

  // Normalise and try a second lookup (handles minor whitespace/case differences)
  const normalised = label.trim();
  if (DISEASE_INFO[normalised]) return DISEASE_INFO[normalised];

  // Generic fallback
  const clean = label.replace(/[_()]/g, ' ').replace(/\s+/g, ' ').trim();
  const isHealthy = label.toLowerCase().includes('healthy');
  return {
    name: clean.split('___').map((s: string) => s.trim()).join(' — '),
    nameShona: clean,
    severity: isHealthy ? 'Healthy' : 'Medium',
    color: isHealthy ? '#16A34A' : '#6B7280',
    treatment: isHealthy
      ? 'Crop appears healthy. Continue regular monitoring every 7–10 days.'
      : 'Consult a local agronomist for specific treatment advice for this condition.',
    treatmentShona: isHealthy
      ? 'Zvirimwa zvine utano. Ramba uchitarisisa minda mazuva 7–10.'
      : 'Tsvaga murimi wenyanzvi kukubatsira nezve chirwere ichi.',
  };
}

export function extractCropName(label: string): string {
  const l = label.toLowerCase();
  if (l.includes('corn') || l.includes('maize')) return 'maize';
  if (l.includes('tomato')) return 'tomato';
  if (l.includes('potato')) return 'potato';
  if (l.includes('soybean')) return 'soybean';
  if (l.includes('apple')) return 'apple';
  if (l.includes('grape')) return 'grape';
  if (l.includes('pepper')) return 'pepper';
  if (l.includes('peach')) return 'peach';
  if (l.includes('cherry')) return 'cherry';
  if (l.includes('orange')) return 'orange';
  if (l.includes('strawberry')) return 'strawberry';
  if (l.includes('blueberry')) return 'blueberry';
  if (l.includes('raspberry')) return 'raspberry';
  if (l.includes('squash')) return 'squash';
  return 'unknown';
}
