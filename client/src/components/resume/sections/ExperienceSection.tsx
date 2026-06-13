import React from 'react';
import { ExperienceEntry } from '../../../types/resume';
import { SectionTitle } from './SectionTitle';

interface ExperienceSectionProps {
  entries: ExperienceEntry[];
}

/** "2023-01" -> "Jan 2023"; null -> "Present" */
const fmtDate = (iso: string | null): string => {
  if (iso === null) return 'Present';
  const [year, month] = iso.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const ExperienceSection: React.FC<ExperienceSectionProps> = React.memo(
  ({ entries }) => (
    <section aria-labelledby="experience-heading">
      <SectionTitle id="experience-heading">Experience</SectionTitle>

      <div className="space-y-8">
        {entries.map((entry) => (
          <article key={`${entry.company}-${entry.start}`}>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                {entry.title}
                <span className="text-zinc-500 dark:text-zinc-400"> · {entry.company}</span>
              </h3>
              <p className="text-sm tabular-nums text-zinc-500 dark:text-zinc-400">
                {fmtDate(entry.start)} – {fmtDate(entry.end)}
              </p>
            </div>

            <ul className="mt-2 space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
              {entry.bullets.map((bullet) => (
                <li key={bullet.text} className="flex gap-2">
                  <span aria-hidden="true" className="select-none text-zinc-300 dark:text-zinc-600">
                    —
                  </span>
                  {bullet.text}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  ),
);

ExperienceSection.displayName = 'ExperienceSection';