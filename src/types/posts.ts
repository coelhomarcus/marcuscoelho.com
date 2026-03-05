export interface BlogFrontmatter {
  slug: string;
  title: string;
  date: string;
  desc: string;
  tags?: string[];
}

export interface DiaryFrontmatter {
  slug: string;
  date: string;
  preview?: string;
  dayWas: string;
  background?: string;
}
