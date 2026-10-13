import { useMemo } from "react";
import { projects } from "@/data/projects";
import { normalizeGitHubRepoUrl } from "@/lib/utils";
import { useGitHubStats } from "@/hooks/use-github-stats";
import type { Project } from "@/types";

export function useProjects(): Project[] {
  const { data: githubStats } = useGitHubStats();

  return useMemo(() => {
    const repos = new Map(
      (githubStats?.repositories ?? []).map((repo) => [
        normalizeGitHubRepoUrl(repo.url),
        repo,
      ]),
    );

    return projects.map((project) => {
      if (!project.repo) return project;

      const repo = repos.get(normalizeGitHubRepoUrl(project.repo));
      if (!repo) return project;

      return {
        ...project,
        repoStars: repo.stargazerCount,
        repoCreatedAt: repo.createdAt,
      };
    });
  }, [githubStats?.repositories]);
}
