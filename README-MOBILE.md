# MundaWise Mobile App
## Complete Guide: Launch · Package · Train the AI Model

---

## QUICK START (5 minutes to first run)

```bash
cd mundawise-mobile
npm install
npx expo run:android   # connect Android phone via USB first
```

---

## PART 1 — LAUNCHING THE APP

### Prerequisites
| Tool | Install |
|------|---------|
| Node.js 18+ | https://nodejs.org |
| Android Studio | https://developer.android.com/studio |
| EAS CLI (for cloud builds) | `npm install -g eas-cli` |
| Expo CLI | `npm install -g @expo/cli` |

### Step 1 — Install dependencies
```bash
cd mundawise-mobile
npm install
```

### Step 2 — Configure backend URL
Open `src/api/client.ts` and update:
```typescript
export const BACKEND_URL = 'https://your-mundawise-backend.onrender.com';
const API_KEY = 'your_api_key_from_backend_env';
```

### Step 3 — Verify model file is present
```
assets/
  model.tflite    ← must exist (your trained model)
  labels.txt      ← must exist (one class per line)
```

### Step 4 — Build and run on Android device
```bash
# USB debugging must be ON on your Android phone
npx expo run:android
```
> ⚠️ Expo Go **cannot** run this app — TFLite requires a native build.
> `npx expo run:android` compiles the native bridge (~5 min first time).
> After that, Metro hot-reloads JS changes instantly.

### Step 5 — Run on emulator (if no physical device)
```bash
# Start Android emulator from Android Studio first
npx expo run:android
```

---

## PART 2 — BUILDING THE APK / AAB

### Option A — Build APK locally (faster, no account needed)
```bash
# Generate a debug APK for testing
cd android
./gradlew assembleDebug
# Output: android/app/build/outputs/apk/debug/app-debug.apk
```

### Option B — Build with EAS (recommended for production)

#### 2.1 — Set up EAS
```bash
npm install -g eas-cli
eas login                    # create free account at expo.dev
eas build:configure          # creates eas.json
```

#### 2.2 — Add build profiles to eas.json
```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" },
      "distribution": "internal"
    },
    "production": {
      "android": { "buildType": "app-bundle" },
      "distribution": "store"
    }
  }
}
```

#### 2.3 — Build APK for demo/hackathon
```bash
eas build --platform android --profile preview
# Takes ~10 min · Downloads a .apk you can share directly
```

#### 2.4 — Build AAB for Play Store
```bash
eas build --platform android --profile production
# Produces .aab for Google Play submission
```

#### 2.5 — Install on device
```bash
# After build completes, scan the QR code in the terminal
# OR
eas build:run --platform android
```

### Google Maps API Key (for dealer map screen)
1. Go to https://console.cloud.google.com
2. Enable **Maps SDK for Android**
3. Create an API Key
4. Add to `app.json`:
```json
"android": {
  "googleMapsApiKey": "AIzaSy..."
}
```

---

## PART 3 — TRAINING / RETRAINING THE AI MODEL

Your `model.tflite` and `labels.txt` are already ready for the hackathon.
This section explains how to retrain if you want better accuracy or new crops.

### Dataset: PlantVillage
- **38 disease classes** across 14 crop types
- **87,000+ images** total
- Download: https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset

### Model Architecture: MobileNetV2 (Transfer Learning)
MobileNetV2 is ideal for mobile because it's accurate AND fast on-device.

---

### Training in Google Colab (Free GPU)

Open a new Colab notebook at https://colab.research.google.com and run:

```python
# ── Cell 1: Install dependencies ──────────────────────────────────────────
!pip install tensorflow kaggle

# ── Cell 2: Download PlantVillage dataset ─────────────────────────────────
# Upload your kaggle.json from https://www.kaggle.com/account
from google.colab import files
files.upload()  # upload kaggle.json

!mkdir -p ~/.kaggle && cp kaggle.json ~/.kaggle/ && chmod 600 ~/.kaggle/kaggle.json
!kaggle datasets download -d abdallahalidev/plantvillage-dataset
!unzip -q plantvillage-dataset.zip -d plantvillage

# ── Cell 3: Prepare data ──────────────────────────────────────────────────
import tensorflow as tf
import os, pathlib

DATA_DIR = pathlib.Path('plantvillage/PlantVillage')
IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 15

train_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR, validation_split=0.2, subset='training',
    seed=42, image_size=IMG_SIZE, batch_size=BATCH_SIZE
)
val_ds = tf.keras.utils.image_dataset_from_directory(
    DATA_DIR, validation_split=0.2, subset='validation',
    seed=42, image_size=IMG_SIZE, batch_size=BATCH_SIZE
)

# Save class names → labels.txt
class_names = train_ds.class_names
with open('labels.txt', 'w') as f:
    f.write('\n'.join(class_names))
print(f"Classes: {len(class_names)}")

# Normalise pixel values
AUTOTUNE = tf.data.AUTOTUNE
def preprocess(img, label):
    return tf.cast(img, tf.float32) / 255.0, label

train_ds = train_ds.map(preprocess).cache().shuffle(1000).prefetch(AUTOTUNE)
val_ds   = val_ds.map(preprocess).cache().prefetch(AUTOTUNE)

# ── Cell 4: Build MobileNetV2 transfer learning model ─────────────────────
base = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3), include_top=False, weights='imagenet'
)
base.trainable = False  # Freeze base during initial training

model = tf.keras.Sequential([
    base,
    tf.keras.layers.GlobalAveragePooling2D(),
    tf.keras.layers.Dropout(0.3),
    tf.keras.layers.Dense(len(class_names), activation='softmax')
])

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-3),
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

model.summary()

# ── Cell 5: Train (Phase 1 — frozen base) ────────────────────────────────
history = model.fit(train_ds, epochs=10, validation_data=val_ds,
                    callbacks=[tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True)])

# ── Cell 6: Fine-tune (Phase 2 — unfreeze top layers) ────────────────────
base.trainable = True
# Unfreeze only the last 30 layers for fine-tuning
for layer in base.layers[:-30]:
    layer.trainable = False

model.compile(
    optimizer=tf.keras.optimizers.Adam(1e-5),  # Lower LR for fine-tuning
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

history_fine = model.fit(train_ds, epochs=EPOCHS, validation_data=val_ds,
                          callbacks=[tf.keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True)])

print(f"Final validation accuracy: {max(history_fine.history['val_accuracy']):.2%}")

# ── Cell 7: Export to TFLite ──────────────────────────────────────────────
converter = tf.lite.TFLiteConverter.from_keras_model(model)

# OPTIONAL: Apply dynamic-range quantization (reduces model size ~4x, minimal accuracy loss)
converter.optimizations = [tf.lite.Optimize.DEFAULT]

tflite_model = converter.convert()

with open('model.tflite', 'wb') as f:
    f.write(tflite_model)

print(f"model.tflite saved — {len(tflite_model)/1024/1024:.1f} MB")

# ── Cell 8: Verify the model ──────────────────────────────────────────────
import numpy as np

interpreter = tf.lite.Interpreter(model_content=tflite_model)
interpreter.allocate_tensors()

inp = interpreter.get_input_details()[0]
out = interpreter.get_output_details()[0]

print(f"Input:  shape={inp['shape']}, dtype={inp['dtype']}")
print(f"Output: shape={out['shape']}, dtype={out['dtype']}")

# Run a test inference with a random image
test_img = np.random.rand(1, 224, 224, 3).astype(np.float32)
interpreter.set_tensor(inp['index'], test_img)
interpreter.invoke()
probs = interpreter.get_tensor(out['index'])[0]
print(f"Top class: {class_names[np.argmax(probs)]} ({np.max(probs):.2%})")

# ── Cell 9: Download files ────────────────────────────────────────────────
from google.colab import files
files.download('model.tflite')
files.download('labels.txt')

print("✅ Download both files and place them in mundawise-mobile/assets/")
```

---

### After Training — Update Your App

1. Copy `model.tflite` → `assets/model.tflite` (replace existing)
2. Copy `labels.txt` → `assets/labels.txt` (replace existing)
3. Update `labels.ts` if any disease display names need updating
4. Rebuild the app: `npx expo run:android`

### Model Performance Tips

| Technique | Effect |
|-----------|--------|
| Dynamic quantization | 4× smaller, <1% accuracy loss |
| INT8 quantization | 4× smaller + faster, ~2% accuracy loss |
| Fine-tuning last 30 layers | +5–8% accuracy vs frozen base |
| Data augmentation | Prevents overfitting on small datasets |
| More epochs (up to 30) | Higher accuracy, watch for overfitting |

### Expected Accuracy
| Crop | Classes | Expected Accuracy |
|------|---------|-------------------|
| Maize | 4 | 92–96% |
| Tomato | 10 | 88–93% |
| Potato | 3 | 90–95% |
| All 38 | 38 | 88–92% |

---

## PROJECT STRUCTURE

```
mundawise-mobile/
├── app/
│   ├── _layout.tsx          ← Root navigation
│   ├── (tabs)/
│   │   ├── _layout.tsx      ← Bottom tab bar
│   │   ├── index.tsx        ← 📸 Camera / Diagnose
│   │   ├── history.tsx      ← 📋 Scan History
│   │   ├── alerts.tsx       ← ⚠️  Outbreak Alerts
│   │   └── settings.tsx     ← ⚙️  Settings
│   ├── results.tsx          ← Disease result card
│   ├── dealers.tsx          ← Dealer map screen
│   └── onboarding.tsx       ← First-launch flow
├── src/
│   ├── api/client.ts        ← Backend API calls
│   ├── components/
│   │   └── OfflineBanner.tsx
│   ├── theme.ts             ← Design tokens
│   └── utils/
│       ├── classifier.ts    ← TFLite inference
│       ├── imageProcessor.ts← Image → Float32Array
│       ├── labels.ts        ← Disease info + Shona text
│       └── cache.ts         ← Offline scan cache
├── assets/
│   ├── model.tflite         ← ← ← YOUR TRAINED MODEL
│   └── labels.txt           ← ← ← YOUR CLASS LABELS
├── app.json
├── metro.config.js
└── package.json
```

---

## TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Model failed to load" | Check `assets/model.tflite` exists and metro.config.js has `tflite` in assetExts |
| Camera shows black screen | Check permissions in `app.json` AND Android Settings → Apps → MundaWise |
| Build fails on TFLite | Confirm plugin in app.json, then `npx expo run:android --clear` |
| Labels mismatch | Make sure `labels.txt` matches your model's training class order exactly |
| Map shows no pins | Check Google Maps API Key in app.json + BACKEND_URL is deployed |
| Expo Go error | This app requires a dev build — use `npx expo run:android`, not Expo Go |
