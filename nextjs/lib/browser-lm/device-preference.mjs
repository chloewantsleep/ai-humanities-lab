export const DEVICE_KEY = "workshop-browser-device-v1";

export function readDevicePreference(fallback = "wasm", storage) {
  try {
    const value = (storage ?? globalThis.localStorage)?.getItem(DEVICE_KEY);
    return value === "wasm" || value === "webgpu" ? value : fallback;
  } catch { return fallback; }
}

export function saveDevicePreference(device, storage) {
  if (!["wasm", "webgpu"].includes(device)) return false;
  try {
    const target = storage ?? globalThis.localStorage;
    if (!target) return false;
    target.setItem(DEVICE_KEY, device);
    return true;
  } catch { return false; }
}
