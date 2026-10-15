const mdxModules = import.meta.glob("@posts/*.mdx");

export function loadPost(file: string) {
  const key = Object.keys(mdxModules).find((k) => k.endsWith(`/${file}.mdx`));
  if (!key) return null;
  return mdxModules[key];
}
