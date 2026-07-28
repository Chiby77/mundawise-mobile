/**
 * MundaWise — TFLite Classifier (Updated for your trained model)
 *
 * Reads labels from assets/labels.txt automatically — no manual label syncing needed.
 * Model file: assets/model.tflite (your trained PlantVillage model).
 */

import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { getLabelInfo, DiseaseInfo } from './labels';
import { imageUriToFloat32 } from './imageProcessor';

// ── Types ──────────────────────────────────────────────────────────────────

export interface ClassificationResult {
  label: string;
  confidence: number;
  info: DiseaseInfo;
  topResults: Array<{ label: string; confidence: number }>;
  timestamp: number;
  inferenceMs: number;
}

// ── Singletons ─────────────────────────────────────────────────────────────

let model: TensorflowModel | null = null;
let labels: string[] = [];
let loadPromise: Promise<void> | null = null;

// ── Label loader ───────────────────────────────────────────────────────────

/**
 * Load class labels from assets/labels.txt.
 * Each line = one class name, in the same order as the model output.
 */
async function loadLabels(): Promise<string[]> {
  if (labels.length > 0) return labels;

  try {
    const [asset] = await Asset.loadAsync(require('../../assets/models/labels.txt'));
    const content = await FileSystem.readAsStringAsync(asset.localUri!);
    labels = content
      .trim()
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);
    console.log(`[Classifier] Loaded ${labels.length} labels from labels.txt`);
  } catch (e) {
    // Fallback to hardcoded PlantVillage 38-class order if labels.txt fails
    console.warn('[Classifier] Could not read labels.txt, using fallback labels:', e);
    labels = FALLBACK_LABELS;
  }

  return labels;
}

// ── Model loader ───────────────────────────────────────────────────────────

export async function loadModel(): Promise<void> {
  if (model) return;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      console.log('[Classifier] Loading model and labels...');
      const t = Date.now();

      // Load both in parallel
      await Promise.all([
        (async () => {
          model = await loadTensorflowModel(
            require('../../assets/models/model.tflite') // YOUR trained model
          );
        })(),
        loadLabels(),
      ]);

      console.log(`[Classifier] Ready in ${Date.now() - t}ms — ${labels.length} classes`);
    } catch (err) {
      loadPromise = null;
      throw new Error(
        `[Classifier] Failed to load model: ${(err as Error).message}\n` +
        'Ensure model.tflite exists in assets/ and metro.config.js includes tflite in assetExts.'
      );
    }
  })();

  return loadPromise;
}

export function isModelReady(): boolean {
  return model !== null && labels.length > 0;
}

// ── Inference ──────────────────────────────────────────────────────────────

export async function classifyImage(imageUri: string): Promise<ClassificationResult> {
  if (!model || labels.length === 0) await loadModel();
  if (!model) throw new Error('[Classifier] Model unavailable');

  const t0 = Date.now();
  const inputTensor = await imageUriToFloat32(imageUri);
  const t1 = Date.now();

  const outputs = model.runSync([inputTensor]);
  const probabilities = outputs[0] as Float32Array;
  const inferenceMs = Date.now() - t1;

  console.log(`[Classifier] Preprocess: ${t1 - t0}ms | Inference: ${inferenceMs}ms`);

  const ranked = Array.from(probabilities)
    .map((prob, idx) => ({
      label: labels[idx] ?? `Class_${idx}`,
      confidence: prob,
    }))
    .sort((a, b) => b.confidence - a.confidence);

  const top = ranked[0];

  return {
    label: top.label,
    confidence: top.confidence,
    info: getLabelInfo(top.label),
    topResults: ranked.slice(0, 3),
    timestamp: Date.now(),
    inferenceMs,
  };
}

// ── Fallback labels (PlantVillage 38-class standard order) ─────────────────

const FALLBACK_LABELS = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Blueberry___healthy',
  'Cherry_(including_sour)___Powdery_mildew',
  'Cherry_(including_sour)___healthy',
  'Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot',
  'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight',
  'Corn_(maize)___healthy',
  'Grape___Black_rot',
  'Grape___Esca_(Black_Measles)',
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
  'Grape___healthy',
  'Orange___Haunglongbing_(Citrus_greening)',
  'Peach___Bacterial_spot',
  'Peach___healthy',
  'Pepper,_bell___Bacterial_spot',
  'Pepper,_bell___healthy',
  'Potato___Early_blight',
  'Potato___Late_blight',
  'Potato___healthy',
  'Raspberry___healthy',
  'Soybean___healthy',
  'Squash___Powdery_mildew',
  'Strawberry___Leaf_scorch',
  'Strawberry___healthy',
  'Tomato___Bacterial_spot',
  'Tomato___Early_blight',
  'Tomato___Late_blight',
  'Tomato___Leaf_Mold',
  'Tomato___Septoria_leaf_spot',
  'Tomato___Spider_mites_Two-spotted_spider_mite',
  'Tomato___Target_Spot',
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'Tomato___Tomato_mosaic_virus',
  'Tomato___healthy',
];
