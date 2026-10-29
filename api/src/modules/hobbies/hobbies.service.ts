import { asc, desc, sql } from "drizzle-orm";
import type { ZodType } from "zod";
import { env } from "../../config/env";
import { db } from "../../config/database";
import { AppError } from "../../shared/errors";
import { anime, manga } from "./hobbies.schema";
import {
  animeListResponseSchema,
  mangaListResponseSchema,
  type AnimeListResponse,
  type MangaListResponse,
} from "./hobbies.validation";

const MAL_API_URL = "https://api.myanimelist.net/v2";
const MAL_REQUEST_TIMEOUT_MS = 15_000;
const LIST_FIELDS = [
  "main_picture",
  "alternative_titles",
  "synopsis",
  "start_date",
  "end_date",
  "mean",
  "rank",
  "popularity",
  "media_type",
  "status",
  "genres",
].join(",");

const ANIME_LIST_STATUS_FIELDS = [
  "status",
  "score",
  "num_episodes_watched",
  "is_rewatching",
  "start_date",
  "finish_date",
  "updated_at",
].join(",");

const MANGA_LIST_STATUS_FIELDS = [
  "status",
  "score",
  "num_chapters_read",
  "num_volumes_read",
  "is_rereading",
  "start_date",
  "finish_date",
  "updated_at",
].join(",");

function requestHeaders() {
  return {
    Accept: "application/json",
    "X-MAL-CLIENT-ID": env.MAL_CLIENT_ID,
  };
}

function assertMalUrl(value: string) {
  const url = new URL(value);
  if (
    url.origin !== "https://api.myanimelist.net" ||
    !url.pathname.startsWith("/v2/")
  ) {
    throw new AppError(
      502,
      "MAL_INVALID_RESPONSE",
      "MyAnimeList returned an invalid pagination URL",
    );
  }
  return url.toString();
}

async function fetchPage<T>(url: string, schema: ZodType<T>): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MAL_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(assertMalUrl(url), {
      headers: requestHeaders(),
      signal: controller.signal,
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      console.error("[MyAnimeList] Request failed", {
        status: response.status,
        responseBody: body.slice(0, 300),
      });
      throw new AppError(502, "MAL_UNAVAILABLE", "Could not reach MyAnimeList");
    }

    const parsed = schema.safeParse(await response.json());
    if (!parsed.success) {
      console.error("[MyAnimeList] Invalid response", {
        issues: parsed.error.issues.slice(0, 8),
      });
      throw new AppError(
        502,
        "MAL_INVALID_RESPONSE",
        "MyAnimeList returned an invalid response",
      );
    }

    return parsed.data;
  } catch (error) {
    if (error instanceof AppError) throw error;
    if (controller.signal.aborted) {
      throw new AppError(
        504,
        "MAL_TIMEOUT",
        "MyAnimeList took too long to respond",
      );
    }
    throw new AppError(502, "MAL_UNAVAILABLE", "Could not reach MyAnimeList");
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchAllPages<
  T extends { data: unknown[]; paging?: { next?: string } },
>(firstUrl: string, schema: ZodType<T>) {
  const items: T["data"] = [];
  let next: string | undefined = firstUrl;
  let pageCount = 0;

  while (next) {
    if (++pageCount > 100) {
      throw new AppError(
        502,
        "MAL_INVALID_RESPONSE",
        "MyAnimeList returned too many pages",
      );
    }
    const page: T = await fetchPage(next, schema);
    items.push(...page.data);
    next = page.paging?.next;
  }

  return items;
}

function listUrl(
  kind: "anime" | "manga",
  extraFields: string[],
  listStatusFields: string,
) {
  const username = encodeURIComponent(env.MAL_USERNAME);
  const params = new URLSearchParams({
    fields: [
      LIST_FIELDS,
      ...extraFields,
      `list_status{${listStatusFields}}`,
    ].join(","),
    limit: "1000",
    sort: "list_updated_at",
    nsfw: "1",
  });
  return `${MAL_API_URL}/users/${username}/${kind}list?${params}`;
}

let animeRefresh: Promise<(typeof anime.$inferSelect)[]> | null = null;
let mangaRefresh: Promise<(typeof manga.$inferSelect)[]> | null = null;

async function syncAnime() {
  const items = await fetchAllPages<AnimeListResponse>(
    listUrl(
      "anime",
      [
        "num_episodes",
        "source",
        "start_season",
        "rating",
        "average_episode_duration",
        "studios",
      ],
      ANIME_LIST_STATUS_FIELDS,
    ),
    animeListResponseSchema,
  );
  const syncedAt = new Date();
  const rows: (typeof anime.$inferInsert)[] = items.map(
    ({ node, list_status }) => ({
      malId: node.id,
      title: node.title,
      englishTitle: node.alternative_titles?.en || null,
      imageUrl: node.main_picture?.large ?? node.main_picture?.medium ?? null,
      synopsis: node.synopsis ?? null,
      listStatus: list_status.status,
      score: list_status.score,
      episodesWatched: list_status.num_episodes_watched,
      totalEpisodes: node.num_episodes ?? 0,
      isRewatching: list_status.is_rewatching,
      personalStartDate: list_status.start_date ?? null,
      personalFinishDate: list_status.finish_date ?? null,
      mediaType: node.media_type ?? null,
      releaseStatus: node.status ?? null,
      meanScore: node.mean ?? null,
      rank: node.rank ?? null,
      popularity: node.popularity ?? null,
      startDate: node.start_date ?? null,
      endDate: node.end_date ?? null,
      genres: node.genres?.map((genre) => genre.name) ?? [],
      source: node.source ?? null,
      season: node.start_season?.season ?? null,
      seasonYear: node.start_season?.year ?? null,
      rating: node.rating ?? null,
      averageEpisodeDuration: node.average_episode_duration ?? null,
      studios: node.studios?.map((studio) => studio.name) ?? [],
      malUpdatedAt: list_status.updated_at,
      syncedAt,
    }),
  );

  await db.transaction(async (tx) => {
    await tx.delete(anime);
    if (rows.length > 0) await tx.insert(anime).values(rows);
  });
  console.log(`[MyAnimeList] Anime cache updated: ${rows.length} titles`);
  return getCachedAnime();
}

async function syncManga() {
  const items = await fetchAllPages<MangaListResponse>(
    listUrl(
      "manga",
      ["num_chapters", "num_volumes", "authors{first_name,last_name}"],
      MANGA_LIST_STATUS_FIELDS,
    ),
    mangaListResponseSchema,
  );
  const syncedAt = new Date();
  const rows: (typeof manga.$inferInsert)[] = items.map(
    ({ node, list_status }) => ({
      malId: node.id,
      title: node.title,
      englishTitle: node.alternative_titles?.en || null,
      imageUrl: node.main_picture?.large ?? node.main_picture?.medium ?? null,
      synopsis: node.synopsis ?? null,
      listStatus: list_status.status,
      score: list_status.score,
      chaptersRead: list_status.num_chapters_read,
      totalChapters: node.num_chapters ?? 0,
      volumesRead: list_status.num_volumes_read,
      totalVolumes: node.num_volumes ?? 0,
      isRereading: list_status.is_rereading,
      personalStartDate: list_status.start_date ?? null,
      personalFinishDate: list_status.finish_date ?? null,
      mediaType: node.media_type ?? null,
      releaseStatus: node.status ?? null,
      meanScore: node.mean ?? null,
      rank: node.rank ?? null,
      popularity: node.popularity ?? null,
      startDate: node.start_date ?? null,
      endDate: node.end_date ?? null,
      genres: node.genres?.map((genre) => genre.name) ?? [],
      authors:
        node.authors?.map(({ node: author }) =>
          [author.first_name, author.last_name].filter(Boolean).join(" "),
        ) ?? [],
      malUpdatedAt: list_status.updated_at,
      syncedAt,
    }),
  );

  await db.transaction(async (tx) => {
    await tx.delete(manga);
    if (rows.length > 0) await tx.insert(manga).values(rows);
  });
  console.log(`[MyAnimeList] Manga cache updated: ${rows.length} titles`);
  return getCachedManga();
}

export function refreshAnime() {
  if (animeRefresh) return animeRefresh;
  animeRefresh = syncAnime().finally(() => {
    animeRefresh = null;
  });
  return animeRefresh;
}

export function refreshManga() {
  if (mangaRefresh) return mangaRefresh;
  mangaRefresh = syncManga().finally(() => {
    mangaRefresh = null;
  });
  return mangaRefresh;
}

export function getCachedAnime() {
  return db
    .select()
    .from(anime)
    .orderBy(
      sql`${anime.personalFinishDate} desc nulls last`,
      desc(anime.malUpdatedAt),
      asc(anime.title),
    );
}

export function getCachedManga() {
  return db
    .select()
    .from(manga)
    .orderBy(
      sql`${manga.personalFinishDate} desc nulls last`,
      desc(manga.malUpdatedAt),
      asc(manga.title),
    );
}
