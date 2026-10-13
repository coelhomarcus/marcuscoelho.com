import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import type { Project } from "@/types";
import {
  cn,
  formatCompactNumber,
  formatLinkPreview,
  formatMonthYear,
  githubRepoUrl,
  projectAsset,
} from "@/lib/utils";

import {
  RxCalendar as CalendarIcon,
  RxGlobe as GlobeIcon,
  RxStar as StarIcon,
} from "react-icons/rx";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { ChevronLeftIcon } from "@/components/icons/chevron-left";
import { ChevronRightIcon } from "@/components/icons/chevron-right";
import { GithubIcon } from "@/components/icons/github";
import { XIcon } from "@/components/icons/x";
import { techIcons } from "@/data/techIcons";
import { IconButton } from "@/components/ui/icon-button";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

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
              className="pointer-events-auto flex flex-col w-full max-w-2xl max-h-[92vh] overflow-hidden rounded-xl bg-popover text-popover-foreground ring-1 ring-foreground/10 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-label={project.name}
            >
              {images.length > 0 && (
                <div className="relative aspect-[8/5] shrink-0 bg-muted overflow-hidden">
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
                      <IconButton
                        type="button"
                        variant="outline"
                        icon={ChevronLeftIcon}
                        onClick={prev}
                        aria-label="Imagem anterior"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm"
                      />
                      <IconButton
                        type="button"
                        variant="outline"
                        icon={ChevronRightIcon}
                        onClick={next}
                        aria-label="Próxima imagem"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/70 backdrop-blur-sm"
                      />

                      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setIndex(i)}
                            aria-label={`Ir para imagem ${i + 1}`}
                            className={cn(
                              "size-1.5 rounded-full transition-colors cursor-pointer",
                              i === index
                                ? "bg-zinc-100"
                                : "bg-zinc-100/30 hover:bg-zinc-100/60",
                            )}
                          />
                        ))}
                      </div>
                    </>
                  )}

                  <IconButton
                    type="button"
                    variant="outline"
                    icon={XIcon}
                    onClick={onClose}
                    aria-label="Fechar"
                    className="absolute top-2 right-2 bg-background/70 backdrop-blur-sm"
                  />
                </div>
              )}

              <div className="flex flex-col p-4 overflow-y-auto scrollbar">
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
                    <h2 className="text-base font-medium text-zinc-100">
                      {project.name}
                    </h2>
                  </div>

                  {images.length === 0 && (
                    <IconButton
                      type="button"
                      variant="ghost"
                      icon={XIcon}
                      onClick={onClose}
                      aria-label="Fechar"
                      className="shrink-0 text-muted-foreground"
                    />
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
                  <div className="flex gap-1.5 flex-wrap mb-6">
                    {project.tech.map((t, i) => {
                      const Icon = techIcons[t];
                      return (
                        <Badge key={i} variant="muted">
                          {Icon && <Icon />}
                          {t}
                        </Badge>
                      );
                    })}
                  </div>
                )}

                {(project.link || project.repo) && (
                  <div className="flex flex-wrap gap-2">
                    {project.link && (
                      <LinkButton href={project.link} icon={ArrowUpRightIcon}>
                        Ver projeto
                      </LinkButton>
                    )}
                    {project.repo && (
                      <LinkButton
                        href={githubRepoUrl(project.repo)}
                        icon={GithubIcon}
                      >
                        Repositório
                      </LinkButton>
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
