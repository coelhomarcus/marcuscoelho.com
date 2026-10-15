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
  let data = await getCachedContributions();

  if (!data) {
    data = await refreshGitHubContributions().then((calendar) => ({
      id: 0,
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
      cachedAt: new Date(),
    }));
  }

  res.json({
    totalContributions: data.totalContributions,
    weeks: data.weeks,
    cachedAt: data.cachedAt,
  });
}

export async function handleGetStats(req: Request, res: Response) {
  let data = await getCachedStats();

  if (!data) {
    const stats = await refreshGitHubStats();
    data = {
      id: 0,
      ...stats,
      cachedAt: new Date(),
    };
  }

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
  let data = await getCachedPullRequests();

  if (!data) {
    const pullRequests = await refreshGitHubPullRequests();
    data = {
      id: 0,
      ...pullRequests,
      cachedAt: new Date(),
    };
  }

  res.json({
    merged: data.merged,
    open: data.open,
    closed: data.closed,
    cachedAt: data.cachedAt,
  });
}
