import { z } from "zod";

const pictureSchema = z
  .object({
    medium: z.string().url().optional(),
    large: z.string().url().optional(),
  })
  .optional();

const alternativeTitlesSchema = z
  .object({
    en: z.string().optional(),
  })
  .optional();

const genreSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

const studioSchema = z.object({
  id: z.number().int(),
  name: z.string(),
});

const sharedNodeSchema = z.object({
  id: z.number().int(),
  title: z.string(),
  main_picture: pictureSchema,
  alternative_titles: alternativeTitlesSchema,
  synopsis: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  mean: z.number().nullable().optional(),
  rank: z.number().int().nullable().optional(),
  popularity: z.number().int().nullable().optional(),
  media_type: z.string().optional(),
  status: z.string().optional(),
  genres: z.array(genreSchema).optional(),
});

export const animeListResponseSchema = z.object({
  data: z.array(
    z.object({
      node: sharedNodeSchema.extend({
        num_episodes: z.number().int().nonnegative().optional(),
        source: z.string().optional(),
        start_season: z
          .object({
            year: z.number().int(),
            season: z.string(),
          })
          .optional(),
        rating: z.string().optional(),
        average_episode_duration: z.number().int().nonnegative().optional(),
        studios: z.array(studioSchema).optional(),
      }),
      list_status: z.object({
        status: z.string(),
        score: z.number().int().min(0).max(10).default(0),
        num_episodes_watched: z.number().int().nonnegative().default(0),
        is_rewatching: z.boolean().default(false),
        start_date: z.string().optional(),
        finish_date: z.string().optional(),
        updated_at: z.string(),
      }),
    }),
  ),
  paging: z.object({ next: z.string().url().optional() }).optional(),
});

const authorSchema = z.object({
  node: z.object({
    id: z.number().int(),
    first_name: z.string(),
    last_name: z.string(),
  }),
  role: z.string(),
});

export const mangaListResponseSchema = z.object({
  data: z.array(
    z.object({
      node: sharedNodeSchema.extend({
        num_chapters: z.number().int().nonnegative().optional(),
        num_volumes: z.number().int().nonnegative().optional(),
        authors: z.array(authorSchema).optional(),
      }),
      list_status: z.object({
        status: z.string(),
        score: z.number().int().min(0).max(10).default(0),
        num_chapters_read: z.number().int().nonnegative().default(0),
        num_volumes_read: z.number().int().nonnegative().default(0),
        is_rereading: z.boolean().default(false),
        start_date: z.string().optional(),
        finish_date: z.string().optional(),
        updated_at: z.string(),
      }),
    }),
  ),
  paging: z.object({ next: z.string().url().optional() }).optional(),
});

export type AnimeListResponse = z.infer<typeof animeListResponseSchema>;
export type MangaListResponse = z.infer<typeof mangaListResponseSchema>;
