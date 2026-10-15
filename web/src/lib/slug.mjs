// Plain .mjs so the app (posts and headings) and scripts/generate-posts.mjs share it.
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}
