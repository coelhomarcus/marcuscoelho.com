export function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatLinkPreview(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export const IMG_PREFIX = "./assets/projects/";

export function projectAsset(path: string) {
  return /^https?:\/\//.test(path) ? path : `${IMG_PREFIX}${path}`;
}
