import { useCachedRequest } from "@/hooks/use-cached-request";
import { apiPath } from "@/lib/api";
import { createRequestCache } from "@/lib/request-cache";
import type {
  AnimeItem,
  CatalogKind,
  CatalogResponse,
  MangaItem,
} from "./types";

const animeCache = createRequestCache<CatalogResponse<AnimeItem>>();
const mangaCache = createRequestCache<CatalogResponse<MangaItem>>();

function loadCatalog<T>(kind: CatalogKind, cache: ReturnType<typeof createRequestCache<T>>) {
  return cache.load(async () => {
    const response = await fetch(apiPath(`/hobbies/${kind}`));
    if (!response.ok) throw new Error("Não foi possível carregar o catálogo.");
    return (await response.json()) as T;
  });
}

const loadAnime = () => loadCatalog("anime", animeCache);
const loadManga = () => loadCatalog("manga", mangaCache);

export const useAnimeCatalog = () => useCachedRequest(loadAnime, animeCache.get);
export const useMangaCatalog = () => useCachedRequest(loadManga, mangaCache.get);
