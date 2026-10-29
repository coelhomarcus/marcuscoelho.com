export interface CatalogBaseItem {
  malId: number;
  title: string;
  englishTitle: string | null;
  imageUrl: string | null;
  synopsis: string | null;
  listStatus: string;
  score: number;
  mediaType: string | null;
  releaseStatus: string | null;
  meanScore: number | null;
  rank: number | null;
  popularity: number | null;
  startDate: string | null;
  endDate: string | null;
  personalStartDate: string | null;
  personalFinishDate: string | null;
  genres: string[];
  malUpdatedAt: string;
  syncedAt: string;
}

export interface AnimeItem extends CatalogBaseItem {
  episodesWatched: number;
  totalEpisodes: number;
  isRewatching: boolean;
  source: string | null;
  season: string | null;
  seasonYear: number | null;
  rating: string | null;
  averageEpisodeDuration: number | null;
  studios: string[];
}

export interface MangaItem extends CatalogBaseItem {
  chaptersRead: number;
  totalChapters: number;
  volumesRead: number;
  totalVolumes: number;
  isRereading: boolean;
  authors: string[];
}

export interface CatalogResponse<T> {
  items: T[];
  syncedAt: string | null;
}

export type CatalogKind = "anime" | "manga";
