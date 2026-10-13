import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  RxArrowTopRight as ExternalLinkIcon,
  RxCross1 as CloseIcon,
} from "react-icons/rx";
import type { Work } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDuration, formatMonth, getWorkRange } from "./format";

interface WorkModalProps {
  work: Work | null;
  onClose: () => void;
}

const WorkModal = ({ work, onClose }: WorkModalProps) => {
  useEffect(() => {
    if (!work) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [work, onClose]);

  const range = work ? getWorkRange(work) : null;

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
              className="pointer-events-auto flex flex-col w-full max-w-lg max-h-[85vh] overflow-hidden rounded-xl bg-popover text-popover-foreground ring-1 ring-foreground/10 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label={work.company}
            >
              <div className="flex flex-col gap-4 p-4 overflow-y-auto scrollbar">
                <div className="flex items-start gap-3">
                  <img
                    src={work.logo}
                    alt=""
                    className="size-8 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-medium text-zinc-100 text-balance">
                      {work.company}
                    </h2>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {formatMonth(range.start)} —{" "}
                      {range.isCurrent ? "Atual" : formatMonth(range.end!)}
                      {" · "}
                      {formatDuration(range.start, range.end)}
                    </p>
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

                {work.positions
                  .slice()
                  .reverse()
                  .map((position) => (
                    <section
                      key={`${position.title}-${position.period.start}`}
                      className="flex flex-col gap-2"
                    >
                      <div>
                        <h3 className="text-sm font-medium text-zinc-100">
                          {position.title}
                          {position.employmentType && (
                            <span className="font-normal text-muted-foreground">
                              {" "}
                              · {position.employmentType}
                            </span>
                          )}
                        </h3>
                        {work.positions.length > 1 && (
                          <p className="text-xs text-muted-foreground tabular-nums">
                            {formatMonth(position.period.start)} —{" "}
                            {position.period.end
                              ? formatMonth(position.period.end)
                              : "Atual"}
                          </p>
                        )}
                      </div>

                      <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground marker:text-zinc-600">
                        {position.about.map((line) => (
                          <li key={line}>{line}</li>
                        ))}
                      </ul>

                      {position.skills && position.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {position.skills.map((skill) => (
                            <Badge key={skill} variant="muted">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </section>
                  ))}

                {work.website && (
                  <div>
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
                  </div>
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
