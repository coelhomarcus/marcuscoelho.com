import { Gamepad2 } from "lucide-react";
import { motion } from "motion/react";
import { Dialog } from "radix-ui";
import { XIcon } from "@/components/icons/x";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { formatLinkPreview } from "@/lib/utils";

export type GameModalEntry = {
  name: string;
  coverUrl: string | null;
  platform: string;
  note: string | null;
  status: string;
  startedAt?: string | null;
  finishedAt?: string | null;
  link?: string | null;
  desire?: number;
};

function formatDate(value: string | null | undefined) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year) return value;
  if (!month) return String(year);

  const date = new Date(Date.UTC(year, month - 1, day || 1));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
    ...(day ? { day: "2-digit" } : {}),
    timeZone: "UTC",
  }).format(date);
}

export function GameModal({
  entry,
  onClose,
}: {
  entry: GameModalEntry | null;
  onClose: () => void;
}) {
  return (
    <Dialog.Root
      open={Boolean(entry)}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {entry && (
        <Dialog.Portal>
          <Dialog.Overlay asChild>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.18 }}
              data-slot="dialog-overlay"
              className="fixed inset-0 z-99 bg-black/65 backdrop-blur-sm"
            />
          </Dialog.Overlay>

          <Dialog.Content asChild aria-describedby={undefined}>
            <motion.div
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed top-1/2 left-1/2 z-100 flex w-[calc(100%-1.5rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl bg-card shadow-2xl ring-1 ring-foreground/10"
            >
              <div className="aspect-[264/352] w-24 shrink-0 bg-zinc-900 sm:w-28">
                {entry.coverUrl ? (
                  <img
                    src={entry.coverUrl}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-zinc-700">
                    <Gamepad2 size={22} />
                  </div>
                )}
              </div>

              <div className="relative min-w-0 flex-1 px-3.5 py-3 pr-11">
                <Dialog.Close asChild>
                  <IconButton
                    type="button"
                    variant="outline"
                    icon={XIcon}
                    aria-label="Fechar"
                    className="absolute top-2.5 right-2.5 bg-background/90 text-foreground backdrop-blur hover:bg-zinc-900 dark:bg-background/90"
                  />
                </Dialog.Close>

                <header>
                  <Dialog.Title asChild>
                    <h2 className="text-base leading-tight font-bold text-balance text-zinc-100">
                      {entry.name}
                    </h2>
                  </Dialog.Title>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <Badge>{entry.status}</Badge>
                    <span className="text-xs text-zinc-500">{entry.platform}</span>
                  </div>
                </header>

                <div className="mt-2 space-y-0.5 text-sm text-zinc-500">
                  {entry.startedAt && (
                    <p>
                      Comecei em{" "}
                      <span className="text-zinc-300">
                        {formatDate(entry.startedAt)}
                      </span>
                    </p>
                  )}
                  {entry.finishedAt && (
                    <p>
                      Terminei em{" "}
                      <span className="text-zinc-300">
                        {formatDate(entry.finishedAt)}
                      </span>
                    </p>
                  )}
                  {entry.desire != null && entry.desire > 0 && (
                    <p>
                      Vontade{" "}
                      <span className="text-zinc-300">{entry.desire}/5</span>
                    </p>
                  )}
                  {entry.link && (
                    <p>
                      <a
                        href={entry.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-300 underline-offset-2 hover:underline"
                      >
                        {formatLinkPreview(entry.link)}
                      </a>
                    </p>
                  )}
                  {entry.note && (
                    <p>
                      <span className="text-zinc-300">{entry.note}</span>
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>
      )}
    </Dialog.Root>
  );
}
