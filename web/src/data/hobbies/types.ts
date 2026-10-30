export interface Game {
  name: string;
  coverUrl: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  platform: string;
  note: string | null;
}

export interface WishlistGame {
  name: string;
  coverUrl: string | null;
  desire: number;
  platform: string;
  link: string | null;
  note: string | null;
}

export type CyberpunkMediaKind =
  | "game"
  | "dlc"
  | "comic"
  | "anime"
  | "book"
  | "manga";

export interface CyberpunkMedia {
  name: string;
  kind: CyberpunkMediaKind;
  completed: boolean;
}
