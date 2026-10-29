import type { Request, Response } from "express";
import {
  getCachedAnime,
  getCachedManga,
  refreshAnime,
  refreshManga,
} from "./hobbies.service";

export async function handleGetAnime(_req: Request, res: Response) {
  let items = await getCachedAnime();
  if (items.length === 0) items = await refreshAnime();
  res.json({ items, syncedAt: items[0]?.syncedAt ?? null });
}

export async function handleGetManga(_req: Request, res: Response) {
  let items = await getCachedManga();
  if (items.length === 0) items = await refreshManga();
  res.json({ items, syncedAt: items[0]?.syncedAt ?? null });
}
