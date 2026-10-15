import type {
  GitHubPullRequestsData,
  PullRequest,
} from "./use-github-pull-requests";

const MERGED: [string, string][] = [
  ["coelhomarcus/linkord", "feat(chat): store link previews with the message so cards never jump"],
  ["coelhomarcus/linkord", "fix(chat): stop the timeline jumping away and back while a conversation loads"],
  ["coelhomarcus/linkord", "fix(web): settle flaky timeline tests and move panel resets out of effects"],
  ["coelhomarcus/linkord", "feat(web): animate icons across every control with lucide-animated"],
  ["coelhomarcus/marcuscoelho.com", "feat(web): stitched layout with a thinner content column"],
  ["coelhomarcus/marcuscoelho.com", "feat(web): experience as an inline accordion"],
  ["coelhomarcus/dbunny", "fix(editor): keep the cursor in place after formatting a query"],
  ["coelhomarcus/dbunny", "feat(connections): test a connection before saving it"],
];

const CLOSED: [string, string][] = [
  ["coelhomarcus/linkord", "Fix call mic preference, uploads, and video filter"],
];

function toPullRequests(entries: [string, string][]): PullRequest[] {
  return entries.map(([repository, title], i) => ({
    title,
    repository,
    url: `https://github.com/${repository}/pull/${100 - i}`,
    createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
  }));
}

// Fake pull requests for the DEV environment (with an empty tab on purpose)
export function getMockGitHubPullRequests(): GitHubPullRequestsData {
  return {
    merged: { totalCount: 78, items: toPullRequests(MERGED) },
    open: { totalCount: 0, items: [] },
    closed: { totalCount: 1, items: toPullRequests(CLOSED) },
    cachedAt: new Date().toISOString(),
  };
}
