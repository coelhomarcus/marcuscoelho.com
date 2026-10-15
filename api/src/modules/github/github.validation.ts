import { z } from "zod";

const contributionDaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  contributionCount: z.number().int().nonnegative(),
  contributionLevel: z.enum([
    "NONE",
    "FIRST_QUARTILE",
    "SECOND_QUARTILE",
    "THIRD_QUARTILE",
    "FOURTH_QUARTILE",
  ]),
});

const contributionCalendarSchema = z.object({
  totalContributions: z.number().int().nonnegative(),
  weeks: z.array(
    z.object({ contributionDays: z.array(contributionDaySchema) }),
  ),
});

export const contributionsDataSchema = z.object({
  user: z.object({
    contributionsCollection: z.object({
      contributionCalendar: contributionCalendarSchema,
    }),
  }),
});

const repositorySchema = z.object({
  name: z.string(),
  nameWithOwner: z.string(),
  url: z.string().url(),
  isPrivate: z.boolean(),
  stargazerCount: z.number().int().nonnegative(),
  createdAt: z.string().datetime({ offset: true }),
  pushedAt: z.string().datetime({ offset: true }).nullable(),
  languages: z.object({
    edges: z.array(
      z.object({
        size: z.number().int().nonnegative(),
        node: z.object({
          name: z.string(),
          color: z.string().nullable(),
        }),
      }),
    ),
  }),
});

export const statsDataSchema = z.object({
  user: z.object({
    pullRequests: z.object({ totalCount: z.number().int().nonnegative() }),
    issues: z.object({ totalCount: z.number().int().nonnegative() }),
    repositories: z.object({ nodes: z.array(repositorySchema) }),
    contributionsCollection: z.object({
      contributionCalendar: z.object({
        weeks: z.array(
          z.object({
            contributionDays: z.array(
              z.object({
                date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
                contributionCount: z.number().int().nonnegative(),
              }),
            ),
          }),
        ),
      }),
    }),
  }),
});

const pullRequestSearchSchema = z.object({
  issueCount: z.number().int().nonnegative(),
  nodes: z.array(
    z.object({
      title: z.string(),
      url: z.string().url(),
      createdAt: z.string().datetime({ offset: true }),
      repository: z.object({ nameWithOwner: z.string() }),
    }),
  ),
});

export const pullRequestsDataSchema = z.object({
  merged: pullRequestSearchSchema,
  open: pullRequestSearchSchema,
  closed: pullRequestSearchSchema,
});

const graphqlEnvelopeSchema = z.object({
  data: z.unknown().optional(),
  errors: z
    .array(z.object({ message: z.string() }))
    .optional(),
});

export type ContributionsData = z.infer<typeof contributionsDataSchema>;
export type StatsData = z.infer<typeof statsDataSchema>;
export type PullRequestsData = z.infer<typeof pullRequestsDataSchema>;

export function parseGitHubResponse<T>(
  payload: unknown,
  dataSchema: z.ZodType<T>,
  operation: string,
): T {
  const envelope = graphqlEnvelopeSchema.safeParse(payload);

  if (!envelope.success) {
    throw new Error(`[GitHub] Invalid GraphQL envelope for ${operation}`);
  }

  if (envelope.data.errors?.length) {
    const messages = envelope.data.errors.map((error) => error.message);
    throw new Error(`[GitHub] GraphQL rejected ${operation}: ${messages.join("; ")}`);
  }

  const data = dataSchema.safeParse(envelope.data.data);
  if (!data.success) {
    throw new Error(`[GitHub] Invalid data for ${operation}`);
  }

  return data.data;
}
