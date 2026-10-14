import { useId, useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { experience } from "@/data/experience";
import type { Work } from "@/types";
import { cn } from "@/lib/utils";
import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right";
import { useAnimatedIcon } from "@/components/icons/use-animated-icon";
import { SectionHeading } from "@/components/section-heading";
import { Period } from "./period";
import { formatDuration, getWorkRange } from "./format";

const EASE = "ease-[cubic-bezier(0.33,1,0.68,1)]";

function WebsiteLink({ href }: { href: string }) {
  const { ref, hoverProps } = useAnimatedIcon();

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-zinc-300 transition-colors hover:text-zinc-50"
      {...hoverProps}
    >
      Visitar site
      <ArrowUpRightIcon ref={ref} size={13} />
    </a>
  );
}

function WorkItem({ work }: { work: Work }) {
  const [open, setOpen] = useState(false);
  const contentId = useId();
  const { start, end } = getWorkRange(work);
  const positions = work.positions.slice().reverse();
  const latest = positions[0];

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={contentId}
        className="flex w-full cursor-pointer flex-col items-start gap-2.5 py-4 text-left"
      >
        <div className="flex min-w-0 items-start gap-4">
          <img
            src={work.logo}
            alt=""
            className="size-10 shrink-0 rounded-sm object-cover"
          />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[15px] leading-tight font-bold text-balance text-zinc-100 sm:text-[17px]">
              {work.company}
            </span>
            <span className="text-sm text-zinc-400 sm:text-[15px]">
              {latest.title}
              {latest.employmentType && `, ${latest.employmentType}`}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-0.5 pl-14">
          <span className="relative flex items-center text-[13px] font-medium text-zinc-100 tabular-nums sm:text-sm">
            <Period start={start} end={end} />
            <ChevronDownIcon
              aria-hidden
              className={cn(
                "absolute -right-5 size-3.5 text-zinc-500 transition-transform duration-300",
                open && "rotate-180",
              )}
            />
          </span>
          <span className="text-[13px] text-zinc-500 sm:text-sm">
            {formatDuration(start, end)}
          </span>
        </div>
      </button>

      {/* Animating grid rows from 0fr to 1fr opens the panel to its natural height */}
      <div
        id={contentId}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-500",
          EASE,
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div
            className={cn(
              "pb-5 pl-14 text-[13px] text-zinc-400 transition-[opacity,translate] duration-500",
              EASE,
              open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
            )}
          >
            {positions.map((position) => (
              <div
                key={`${position.title}-${position.period.start}`}
                className="mb-5 last:mb-0"
              >
                {positions.length > 1 && (
                  <p className="mb-2 text-sm font-medium text-zinc-200">
                    {position.title}
                    <span className="font-normal text-zinc-500">
                      {" · "}
                      <Period
                        start={position.period.start}
                        end={position.period.end}
                      />
                    </span>
                  </p>
                )}

                <ul className="space-y-2 leading-relaxed">
                  {position.about.map((line) => (
                    <li key={line} className="flex items-start gap-2">
                      <span
                        aria-hidden
                        className="mt-2 size-1 shrink-0 rounded-full bg-zinc-600"
                      />
                      {line}
                    </li>
                  ))}
                </ul>

                {position.skills && position.skills.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {position.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-[4px] border border-zinc-800/50 bg-[#111111] px-2 py-0.5 text-[11px] font-medium text-zinc-400"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {work.website && <WebsiteLink href={work.website} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkExperience() {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading title="Experiência" />
      <div>
        {experience.map((work) => (
          <WorkItem key={work.company} work={work} />
        ))}
      </div>
    </section>
  );
}

export default WorkExperience;
