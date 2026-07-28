import * as ImageManipulator from 'expo-image-manipulator';
import * as jpeg from 'jpeg-js';

const MODEL_SIZE = 224;
const PIXEL_COUNT = MODEL_SIZE * MODEL_SIZE;

export async function imageUriToFloat32(imageUri: string): Promise<Float32Array> {
  const manipResult = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: MODEL_SIZE, height: MODEL_SIZE } }],
    { compress: 0.95, format: ImageManipulator.SaveFormat.JPEG, base64: true }
  );

  if (!manipResult.base64) throw new Error('Image manipulator returned no base64 data.');

  const binaryStr = atob(manipResult.base64);
  const jpegBytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) jpegBytes[i] = binaryStr.charCodeAt(i);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { data: rgba } = jpeg.decode(jpegBytes, { useTArray: true });

  if (rgba.length !== PIXEL_COUNT * 4) throw new Error(`Unexpected pixel buffer: expected ${PIXEL_COUNT * 4}, got ${rgba.length}`);

  const float32 = new Float32Array(PIXEL_COUNT * 3);
  for (let i = 0; i < PIXEL_COUNT; i++) {
    float32[i * 3]     = rgba[i * 4]     / 255.0;
    float32[i * 3 + 1] = rgba[i * 4 + 1] / 255.0;
    float32[i * 3 + 2] = rgba[i * 4 + 2] / 255.0;
  }
  return float32;
}

export async function resizeForPreview(uri: string, width = 600): Promise<string> {
  const r = await ImageManipulator.manipulateAsync(uri, [{ resize: { width } }], { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG });
  return r.uri;
}
