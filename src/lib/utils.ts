export function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatLinkPreview(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatMonthYear(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function normalizeGitHubRepoUrl(url: string) {
  return url
    .replace(/^https?:\/\/(www\.)?github\.com\//, "")
    .replace(/\.git$/, "")
    .replace(/\/$/, "")
    .toLowerCase();
}

export const IMG_PREFIX = "/assets/projects/";

export function projectAsset(path: string) {
  return /^https?:\/\//.test(path) ? path : `${IMG_PREFIX}${path}`;
}
