import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  RxArrowTopRight as ExternalLinkIcon,
  RxChevronLeft as ChevronLeftIcon,
  RxChevronRight as ChevronRightIcon,
  RxCross1 as CloseIcon,
} from "react-icons/rx";
import type { Work } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDuration, formatPeriod, getWorkRange } from "./format";

interface WorkModalProps {
  work: Work | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const WorkModal = ({
  work,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: WorkModalProps) => {
  const hasMultiple = total > 1;

  useEffect(() => {
    if (!work) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (hasMultiple && e.key === "ArrowLeft") onPrev();
      if (hasMultiple && e.key === "ArrowRight") onNext();
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [work, hasMultiple, onClose, onPrev, onNext]);

  const range = work ? getWorkRange(work) : null;
  const positions = work ? work.positions.slice().reverse() : [];
  const skillCount = positions.reduce(
    (sum, position) => sum + (position.skills?.length ?? 0),
    0,
  );

  return createPortal(
    <AnimatePresence>
      {work && range && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-99"
            onClick={onClose}
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="pointer-events-auto flex w-full max-w-lg max-h-[85vh] flex-col overflow-hidden rounded-xl bg-popover text-popover-foreground ring-1 ring-foreground/10 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label={work.company}
            >
              <motion.div
                key={work.company}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-5 overflow-y-auto p-4 scrollbar"
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
                    <img
                      src={work.logo}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-medium leading-snug text-zinc-100 text-balance">
                      {work.company}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {positions[0].title}
                      {positions[0].employmentType &&
                        ` · ${positions[0].employmentType}`}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {range.isCurrent && (
                        <Badge variant="success">
                          <span
                            className="size-1.5 rounded-full bg-green-400"
                            aria-hidden
                          />
                          Atual
                        </Badge>
                      )}
                      <Badge variant="outline" className="tabular-nums">
                        {formatPeriod(range.start, range.end)}
                      </Badge>
                      <Badge variant="outline">
                        {formatDuration(range.start, range.end)}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={onClose}
                    aria-label="Fechar"
                    className="shrink-0 text-muted-foreground"
                  >
                    <CloseIcon />
                  </Button>
                </div>

                {positions.map((position) => (
                  <section
                    key={`${position.title}-${position.period.start}`}
                    className="flex flex-col gap-2"
                  >
                    {positions.length > 1 && (
                      <h3 className="text-sm font-medium text-zinc-100">
                        {position.title}
                        <span className="font-normal text-muted-foreground tabular-nums">
                          {" · "}
                          {formatPeriod(
                            position.period.start,
                            position.period.end,
                          )}
                        </span>
                      </h3>
                    )}

                    <p className="text-xs font-medium text-muted-foreground">
                      Destaques
                    </p>
                    <ul className="divide-y divide-border/50">
                      {position.about.map((line) => (
                        <li
                          key={line}
                          className="flex gap-2.5 py-2 text-sm leading-relaxed text-muted-foreground first:pt-0 last:pb-0"
                        >
                          <span
                            className="mt-2 size-1 shrink-0 rounded-full bg-zinc-600"
                            aria-hidden
                          />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}

                {skillCount > 0 && (
                  <section className="flex flex-col gap-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Tecnologias{" "}
                      <span className="text-zinc-600 tabular-nums">
                        {skillCount}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {positions
                        .flatMap((position) => position.skills ?? [])
                        .map((skill) => (
                          <Badge key={skill} variant="muted">
                            {skill}
                          </Badge>
                        ))}
                    </div>
                  </section>
                )}
              </motion.div>

              <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border/60 bg-muted/50 p-3">
                {hasMultiple ? (
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={onPrev}
                      aria-label="Experiência anterior"
                    >
                      <ChevronLeftIcon />
                    </Button>
                    <span className="min-w-14 text-center text-xs text-muted-foreground tabular-nums">
                      {index + 1} de {total}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      onClick={onNext}
                      aria-label="Próxima experiência"
                    >
                      <ChevronRightIcon />
                    </Button>
                  </div>
                ) : (
                  <span />
                )}

                {work.website && (
                  <Button asChild variant="outline">
                    <a
                      href={work.website}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      Visitar site
                      <ExternalLinkIcon className="size-3.5" />
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default WorkModal;
