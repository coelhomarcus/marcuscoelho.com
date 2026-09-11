import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import type { ProjectModalProps } from "@/types";
import {
  formatCompactNumber,
  formatLinkPreview,
  formatMonthYear,
  projectAsset,
} from "@/lib/utils";

import {
  RxCross1 as CloseIcon,
  RxChevronLeft as ChevronLeftIcon,
  RxChevronRight as ChevronRightIcon,
  RxArrowTopRight as ExternalLinkIcon,
  RxCalendar as CalendarIcon,
  RxGithubLogo as GithubIcon,
  RxGlobe as GlobeIcon,
  RxStar as StarIcon,
} from "react-icons/rx";

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const [index, setIndex] = useState(0);

  const images = project?.images ?? [];

  const hasMultiple = images.length > 1;

  const preview = project
    ? (project.linkPreview ??
      (project.link ? formatLinkPreview(project.link) : undefined))
    : undefined;
  const hasStars =
    typeof project?.repoStars === "number" && project.repoStars > 0;

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    setIndex(0);
  }, [project]);

  useEffect(() => {
    if (!project) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (hasMultiple && e.key === "ArrowLeft") prev();
      if (hasMultiple && e.key === "ArrowRight") next();
    };

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose, prev, next, hasMultiple]);

  return createPortal(
    <AnimatePresence>
      {project && (
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
              className="pointer-events-auto flex flex-col w-full max-w-3xl max-h-[92vh] overflow-hidden rounded-[8px] border border-zinc-800/80 bg-zinc-950 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label={project.name}
            >
              {images.length > 0 && (
                <div className="relative aspect-[8/5] shrink-0 bg-zinc-900 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={images[index]}
                      src={projectAsset(images[index])}
                      alt={project.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {hasMultiple && (
                    <>
                      <button
                        type="button"
                        onClick={prev}
                        aria-label="Imagem anterior"
                        className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-950/70 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/80 border border-zinc-800/80 transition-colors cursor-pointer"
                      >
                        <ChevronLeftIcon className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        aria-label="Próxima imagem"
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-zinc-950/70 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/80 border border-zinc-800/80 transition-colors cursor-pointer"
                      >
                        <ChevronRightIcon className="size-4" />
                      </button>

                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setIndex(i)}
                            aria-label={`Ir para imagem ${i + 1}`}
                            className={`size-1.5 rounded-full transition-colors cursor-pointer ${
                              i === index
                                ? "bg-zinc-100"
                                : "bg-zinc-100/30 hover:bg-zinc-100/60"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Fechar"
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-950/70 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-900/80 border border-zinc-800/80 transition-colors cursor-pointer"
                  >
                    <CloseIcon className="size-4" />
                  </button>
                </div>
              )}

              <div className="flex flex-col p-6 overflow-y-auto scrollbar">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    {project.favicon ? (
                      <img
                        className="size-6 rounded-sm"
                        src={projectAsset(project.favicon)}
                        alt=""
                      />
                    ) : (
                      <GlobeIcon className="size-5 text-zinc-500" />
                    )}
                    <h2 className="text-lg font-semibold text-zinc-100">
                      {project.name}
                    </h2>
                  </div>

                  {images.length === 0 && (
                    <button
                      type="button"
                      onClick={onClose}
                      aria-label="Fechar"
                      className="p-1.5 -m-1.5 rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800/80 transition-colors cursor-pointer shrink-0"
                    >
                      <CloseIcon className="size-4" />
                    </button>
                  )}
                </div>

                {preview && (
                  <p className="text-xs text-zinc-500/70 italic mb-2">
                    {preview}
                  </p>
                )}

                {(hasStars || project.repoCreatedAt) && (
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 text-xs text-zinc-500">
                    {hasStars && (
                      <span className="inline-flex items-center gap-1.5">
                        <StarIcon className="size-3.5 text-zinc-400" />
                        {formatCompactNumber(project.repoStars!)} stars
                      </span>
                    )}
                    {project.repoCreatedAt && (
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarIcon className="size-3.5 text-zinc-400" />
                        Criado em {formatMonthYear(project.repoCreatedAt)}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-sm text-zinc-400 leading-relaxed mb-5">
                  {project.desc}
                </p>

                {project.tech.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-6">
                    {project.tech.map((t, i) => (
                      <span
                        key={i}
                        className="text-xs px-2.5 py-1 text-zinc-500 bg-zinc-800/60 border border-zinc-700/50 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {(project.link || project.repo) && (
                  <div className="flex flex-wrap gap-2.5">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/60 text-zinc-200 px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                      >
                        Ver projeto
                        <ExternalLinkIcon className="size-3.5" />
                      </a>
                    )}
                    {project.repo && (
                      <a
                        href={project.repo}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-700/50 bg-zinc-800/30 hover:bg-zinc-800/60 text-zinc-200 px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
                      >
                        Repositório
                        <GithubIcon className="size-3.5" />
                      </a>
                    )}
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

export default ProjectModal;
