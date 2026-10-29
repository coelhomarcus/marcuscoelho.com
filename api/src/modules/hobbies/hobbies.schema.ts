import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const sharedColumns = {
  malId: integer("mal_id").primaryKey(),
  title: text("title").notNull(),
  englishTitle: text("english_title"),
  imageUrl: text("image_url"),
  synopsis: text("synopsis"),
  listStatus: text("list_status").notNull(),
  score: integer("score").notNull().default(0),
  mediaType: text("media_type"),
  releaseStatus: text("release_status"),
  meanScore: doublePrecision("mean_score"),
  rank: integer("rank"),
  popularity: integer("popularity"),
  startDate: text("start_date"),
  endDate: text("end_date"),
  personalStartDate: text("personal_start_date"),
  personalFinishDate: text("personal_finish_date"),
  genres: jsonb("genres").$type<string[]>().notNull().default([]),
  malUpdatedAt: text("mal_updated_at").notNull(),
  syncedAt: timestamp("synced_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
};

export const anime = pgTable(
  "anime",
  {
    ...sharedColumns,
    episodesWatched: integer("episodes_watched").notNull().default(0),
    totalEpisodes: integer("total_episodes").notNull().default(0),
    isRewatching: boolean("is_rewatching").notNull().default(false),
    source: text("source"),
    season: text("season"),
    seasonYear: integer("season_year"),
    rating: text("rating"),
    averageEpisodeDuration: integer("average_episode_duration"),
    studios: jsonb("studios").$type<string[]>().notNull().default([]),
  },
  (table) => [
    index("anime_list_status_idx").on(table.listStatus),
    index("anime_mal_updated_at_idx").on(table.malUpdatedAt),
  ],
);

export const manga = pgTable(
  "manga",
  {
    ...sharedColumns,
    chaptersRead: integer("chapters_read").notNull().default(0),
    totalChapters: integer("total_chapters").notNull().default(0),
    volumesRead: integer("volumes_read").notNull().default(0),
    totalVolumes: integer("total_volumes").notNull().default(0),
    isRereading: boolean("is_rereading").notNull().default(false),
    authors: jsonb("authors").$type<string[]>().notNull().default([]),
  },
  (table) => [
    index("manga_list_status_idx").on(table.listStatus),
    index("manga_mal_updated_at_idx").on(table.malUpdatedAt),
  ],
);
