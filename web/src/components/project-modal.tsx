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
  RxDownload as DownloadIcon,
  RxStar as StarIcon,
} from "react-icons/rx";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { ChevronLeftIcon } from "@/components/icons/chevron-left";
import { ChevronRightIcon } from "@/components/icons/chevron-right";
import { GithubIcon } from "@/components/icons/github";
import { XIcon } from "@/components/icons/x";
import {
  useAnimatedIcon,
  type AnimatedIcon,
} from "@/components/icons/use-animated-icon";
import { techIcons } from "@/data/tech-icons";
import { Badge } from "@/components/ui/badge";
import { IconButton } from "@/components/ui/icon-button";
import { LinkButton } from "@/components/ui/link-button";

function ActionLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: AnimatedIcon;
  children: React.ReactNode;
}) {
  const { ref, hoverProps } = useAnimatedIcon();

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-300 transition-colors hover:text-zinc-50"
      {...hoverProps}
    >
      {children}
      <Icon ref={ref} size={14} />
    </a>
  );
}

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
  const hasDownloads =
    typeof project?.repoDownloads === "number" && project.repoDownloads > 0;

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
              className="pointer-events-auto scrollbar w-full max-w-2xl max-h-[92vh] rounded-xl bg-[#09090b] p-3 text-popover-foreground shadow-2xl ring-1 ring-foreground/10"
              role="dialog"
              aria-modal="true"
              aria-label={project.name}
            >
              {images.length > 0 && (
                <div className="relative isolate aspect-[8/5] overflow-hidden rounded-lg bg-zinc-900">
                  <AnimatePresence initial={false}>
                    <motion.img
                      key={images[index]}
                      src={projectAsset(images[index])}
                      alt={project.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="absolute inset-0 size-full object-cover"
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
                        className="absolute top-1/2 left-2 -translate-y-1/2 bg-background/70 backdrop-blur-sm"
                      />
                      <IconButton
                        type="button"
                        variant="outline"
                        icon={ChevronRightIcon}
                        onClick={next}
                        aria-label="Próxima imagem"
                        className="absolute top-1/2 right-2 -translate-y-1/2 bg-background/70 backdrop-blur-sm"
                      />

                      <div className="absolute bottom-2.5 left-1/2 flex -translate-x-1/2 gap-1.5">
                        {images.map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setIndex(i)}
                            aria-label={`Ir para imagem ${i + 1}`}
                            className={cn(
                              "size-1.5 cursor-pointer rounded-full transition-colors",
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

              <div className="flex flex-col px-1 pt-4 pb-1">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg leading-tight font-bold text-zinc-100">
                    {project.name}
                  </h2>
                  {images.length === 0 && (
                    <IconButton
                      type="button"
                      variant="ghost"
                      icon={XIcon}
                      onClick={onClose}
                      aria-label="Fechar"
                      className="-mt-1 -mr-1 shrink-0 text-zinc-500 hover:text-zinc-100"
                    />
                  )}
                </div>

                {(preview || hasStars || hasDownloads || project.repoCreatedAt) && (
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-zinc-500">
                    {[
                      preview && <span key="preview">{preview}</span>,
                      hasStars && (
                        <span
                          key="stars"
                          className="inline-flex items-center gap-1 tabular-nums"
                        >
                          <StarIcon className="size-3.5" />
                          {formatCompactNumber(project.repoStars!)}
                        </span>
                      ),
                      hasDownloads && (
                        <span
                          key="downloads"
                          title={`${project.repoDownloads!.toLocaleString("pt-BR")} downloads`}
                          className="inline-flex items-center gap-1 tabular-nums"
                        >
                          <DownloadIcon className="size-3.5" />
                          {formatCompactNumber(project.repoDownloads!)}
                        </span>
                      ),
                      project.repoCreatedAt && (
                        <span
                          key="created"
                          className="inline-flex items-center gap-1"
                        >
                          <CalendarIcon className="size-3.5" />
                          {formatMonthYear(project.repoCreatedAt)}
                        </span>
                      ),
                    ]
                      .filter(Boolean)
                      .flatMap((item, i) =>
                        i === 0
                          ? [item]
                          : [
                              <span key={`dot-${i}`} aria-hidden>
                                ·
                              </span>,
                              item,
                            ],
                      )}
                  </div>
                )}

                <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                  {project.desc}
                </p>

                {project.tech.length > 0 && (
                  <div className="mt-5">
                    <p className="mb-2 text-xs font-medium text-zinc-500">
                      Tecnologias
                    </p>
                    <ul className="flex flex-wrap gap-1.5">
                      {project.tech.map((t) => {
                        const Icon = techIcons[t];
                        return (
                          <li key={t}>
                            <Badge>
                              {Icon && <Icon />}
                              {t}
                            </Badge>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {(project.link || project.repo) && (
                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
                    {project.link && (
                      <ActionLink href={project.link} icon={ArrowUpRightIcon}>
                        Ver projeto
                      </ActionLink>
                    )}
                    {project.repo && (
                      <LinkButton
                        href={githubRepoUrl(project.repo)}
                        icon={GithubIcon}
                        variant="default"
                        size="sm"
                        className="ml-auto"
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
