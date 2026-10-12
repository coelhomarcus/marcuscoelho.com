import { arrWorks } from "@/data/works";
import {
  WorkExperience,
  type ExperienceItemType,
} from "@/components/work-experience";

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** "YYYY-MM" or "YYYY" -> "MM.YYYY" or "YYYY", the format work-experience expects */
function toMonthYear(isoDate: string): string {
  const [year, month] = isoDate.split("-");
  return month ? `${month}.${year}` : year;
}

const experiences: ExperienceItemType[] = arrWorks.map(
  (work, companyIndex) => {
    const companyId = slugify(work.company);

    return {
      id: companyId,
      companyName: work.company,
      companyLogo: work.logo,
      companyWebsite: work.website,
      isCurrentEmployer: work.positions.some(
        (position) => !position.period.end
      ),
      positions: work.positions.map((position, positionIndex) => ({
        id: `${companyId}-${positionIndex}`,
        title: position.title,
        employmentPeriod: {
          start: toMonthYear(position.period.start),
          end: position.period.end
            ? toMonthYear(position.period.end)
            : undefined,
        },
        employmentType: position.employmentType,
        description: position.about.map((line) => `- ${line}`).join("\n"),
        skills: position.skills,
        isExpanded: companyIndex === 0 && positionIndex === 0,
      })),
    };
  }
);

function WorksExperience() {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-zinc-300">Experiência</h2>
      <WorkExperience className="px-0" experiences={experiences} />
    </div>
  );
}

export default WorksExperience;
