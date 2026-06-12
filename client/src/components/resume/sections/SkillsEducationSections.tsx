import React from 'react';
import { EducationEntry, SkillGroup } from '../../../types/resume';
import { SectionTitle } from './SectionTitle';

interface SkillsSectionProps {
  groups: SkillGroup[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = React.memo(
  ({ groups }) => (
    <section aria-labelledby="skills-heading">
      <SectionTitle id="skills-heading">Skills</SectionTitle>
      <dl className="space-y-2 text-sm">
        {groups.map((group) => (
          <div key={group.category} className="flex flex-col sm:flex-row sm:gap-3">
            <dt className="w-32 shrink-0 font-medium text-zinc-900 dark:text-zinc-100">
              {group.category}
            </dt>
            <dd className="text-zinc-700 dark:text-zinc-300">{group.items.join(', ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  ),
);

SkillsSection.displayName = 'SkillsSection';

interface EducationSectionProps {
  entries: EducationEntry[];
}

export const EducationSection: React.FC<EducationSectionProps> = React.memo(
  ({ entries }) => (
    <section aria-labelledby="education-heading">
      <SectionTitle id="education-heading">Education</SectionTitle>
      <ul className="space-y-2 text-sm">
        {entries.map((e) => (
          <li
            key={`${e.institution}-${e.credential}`}
            className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between"
          >
            <span className="text-zinc-900 dark:text-zinc-100">
              {e.credential}
              <span className="text-zinc-500 dark:text-zinc-400"> · {e.institution}</span>
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">{e.year}</span>
          </li>
        ))}
      </ul>
    </section>
  ),
);

EducationSection.displayName = 'EducationSection';