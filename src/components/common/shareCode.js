// src/components/common/shareCode.js
import images from "./images";

// --- URL-safe Base64 変換ユーティリティ ---
const toBase64Url = (b64) =>
  b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
const fromBase64Url = (b64url) => {
  let s = b64url.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return s;
};

// --- ビンゴ状態をエンコード ---
export function encodeState(selectedImages) {
  const indices = selectedImages
    .map((img) => images.indexOf(img))
    .filter((i) => Number.isInteger(i) && i >= 0 && i < images.length);

  if (images.length <= 0xffff) {
    const u16 = new Uint16Array(indices);
    const bytes = new Uint8Array(u16.buffer);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return toBase64Url(btoa(bin));
  } else {
    const u32 = new Uint32Array(indices);
    const bytes = new Uint8Array(u32.buffer);
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return "u32." + toBase64Url(btoa(bin));
  }
}

// --- ビンゴ状態をデコード ---
export function decodeState(encodedState) {
  try {
    const tryJson = () => {
      const s = atob(fromBase64Url(encodedState));
      if (s && s[0] === "[") {
        const indices = JSON.parse(s);
        if (!Array.isArray(indices)) return null;
        return indices
          .filter((i) => Number.isInteger(i) && i >= 0 && i < images.length)
          .map((i) => images[i]);
      }
      return null;
    };

    const jsonResult = tryJson();
    if (jsonResult) return jsonResult;

    let payload = encodedState;
    let mode = "u16";
    if (encodedState.startsWith("u32.")) {
      mode = "u32";
      payload = encodedState.slice(4);
    }

    const bin = atob(fromBase64Url(payload));
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);

    let indices;
    if (mode === "u32") {
      if (bytes.length % 4 !== 0) return [];
      const u32 = new Uint32Array(bytes.buffer);
      indices = Array.from(u32);
    } else {
      if (bytes.length % 2 !== 0) return [];
      const u16 = new Uint16Array(bytes.buffer);
      indices = Array.from(u16);
    }

    return indices
      .filter((i) => Number.isInteger(i) && i >= 0 && i < images.length)
      .map((i) => images[i]);
  } catch {
    return [];
  }
}

// --- シャッフル関数 ---
export function fyShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
