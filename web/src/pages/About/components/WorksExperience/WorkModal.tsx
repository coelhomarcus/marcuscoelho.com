import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { ChevronLeftIcon } from "@/components/icons/chevron-left";
import { ChevronRightIcon } from "@/components/icons/chevron-right";
import { XIcon } from "@/components/icons/x";
import type { Work } from "@/types";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { LinkButton } from "@/components/ui/link-button";
import { Period } from "./Period";
import { formatDuration, getWorkRange } from "./format";

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
  const isOpen = work !== null;

  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>();

  // Animate the body height when switching experiences instead of jumping
  useEffect(() => {
    const el = contentRef.current;
    if (!isOpen || !el) return;

    const observer = new ResizeObserver(() =>
      setContentHeight(el.offsetHeight),
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isOpen]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [work]);

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

  const maxBodyHeight = window.innerHeight * 0.85 - 60;
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
                ref={bodyRef}
                initial={false}
                animate={{ height: contentHeight ?? "auto" }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{
                  overflowY:
                    contentHeight !== undefined && contentHeight > maxBodyHeight
                      ? "auto"
                      : "hidden",
                }}
                className="max-h-[calc(85vh-3.75rem)] scrollbar"
              >
                <div ref={contentRef} className="flex flex-col gap-5 p-4">
                  <div className="flex items-start gap-3">
                    <img
                      src={work.logo}
                      alt=""
                      className="size-12 shrink-0 rounded-sm object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <h2 className="text-base font-medium leading-snug text-zinc-100 text-balance">
                        {work.company}
                      </h2>
                      <p className="text-sm text-zinc-300">
                        {positions[0].title}
                        {positions[0].employmentType && (
                          <span className="text-zinc-500">
                            {` · ${positions[0].employmentType}`}
                          </span>
                        )}
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
                        <Badge
                          variant="outline"
                          className="tabular-nums text-zinc-300"
                        >
                          <Period start={range.start} end={range.end} />
                        </Badge>
                        <Badge variant="muted">
                          {formatDuration(range.start, range.end)}
                        </Badge>
                      </div>
                    </div>

                    <IconButton
                      type="button"
                      variant="ghost"
                      icon={XIcon}
                      onClick={onClose}
                      aria-label="Fechar"
                      className="shrink-0 text-muted-foreground"
                    />
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
                            <Period
                              start={position.period.start}
                              end={position.period.end}
                            />
                          </span>
                        </h3>
                      )}

                      <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                        Destaques
                      </p>
                      <ul className="divide-y divide-border/50">
                        {position.about.map((line) => (
                          <li
                            key={line}
                            className="flex gap-2.5 py-2 text-sm leading-relaxed text-zinc-300 first:pt-0 last:pb-0"
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
                      <p className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                        Tecnologias
                        <span className="text-zinc-600 tabular-nums">
                          {skillCount}
                        </span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {positions
                          .flatMap((position) => position.skills ?? [])
                          .map((skill) => (
                            <Badge
                              key={skill}
                              variant="muted"
                              className="text-zinc-300"
                            >
                              {skill}
                            </Badge>
                          ))}
                      </div>
                    </section>
                  )}
                </div>
              </motion.div>

              <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-border/60 bg-muted/50 p-3">
                {hasMultiple ? (
                  <div className="flex items-center gap-1">
                    <IconButton
                      type="button"
                      variant="outline"
                      icon={ChevronLeftIcon}
                      onClick={onPrev}
                      aria-label="Experiência anterior"
                    />
                    <span className="min-w-12 text-center text-xs text-zinc-400 tabular-nums">
                      {index + 1} de {total}
                    </span>
                    <IconButton
                      type="button"
                      variant="outline"
                      icon={ChevronRightIcon}
                      onClick={onNext}
                      aria-label="Próxima experiência"
                    />
                  </div>
                ) : (
                  <span />
                )}

                {work.website && (
                  <LinkButton href={work.website} icon={ArrowUpRightIcon}>
                    Visitar site
                  </LinkButton>
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
