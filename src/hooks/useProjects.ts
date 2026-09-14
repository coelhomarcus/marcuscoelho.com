import { useMemo } from "react";
import { arrProjects } from "@/data/projects";
import { normalizeGitHubRepoUrl } from "@/lib/utils";
import { useGitHubStats } from "@/hooks/useGitHubStats";
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

    return arrProjects.map((project) => {
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
