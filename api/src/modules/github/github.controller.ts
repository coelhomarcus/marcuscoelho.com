import { Request, Response } from "express";
import {
  getCachedContributions,
  getCachedPullRequests,
  getCachedStats,
  refreshGitHubContributions,
  refreshGitHubPullRequests,
  refreshGitHubStats,
} from "./github.service";

export async function handleGetContributions(req: Request, res: Response) {
  const data =
    (await getCachedContributions()) ?? (await refreshGitHubContributions());

  res.json({
    totalContributions: data.totalContributions,
    weeks: data.weeks,
    cachedAt: data.cachedAt,
  });
}

export async function handleGetStats(req: Request, res: Response) {
  const data = (await getCachedStats()) ?? (await refreshGitHubStats());

  res.json({
    totalStars: data.totalStars,
    mergedPRs: data.mergedPRs,
    closedIssues: data.closedIssues,
    currentStreak: data.currentStreak,
    lastCommitDate: data.lastCommitDate,
    lastCommitRepo: data.lastCommitRepo,
    languages: data.languages,
    repositories: data.repositories,
    cachedAt: data.cachedAt,
  });
}

export async function handleGetPullRequests(req: Request, res: Response) {
  const data =
    (await getCachedPullRequests()) ?? (await refreshGitHubPullRequests());

  res.json({
    merged: data.merged,
    open: data.open,
    closed: data.closed,
    cachedAt: data.cachedAt,
  });
}
