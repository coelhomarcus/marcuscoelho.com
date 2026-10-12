const mdxModules = import.meta.glob("./*.mdx");

export function loadPost(slug: string) {
  const key = Object.keys(mdxModules).find((k) => k.endsWith(`/${slug}.mdx`));
  if (!key) return null;
  return mdxModules[key];
}
