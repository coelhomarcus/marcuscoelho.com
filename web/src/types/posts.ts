export interface BlogFrontmatter {
  /** Name of the .mdx file in posts/, without extension. Generated. */
  file: string;
  title: string;
  date: string;
  tag: string;
  banner?: string;
}

