import { Bullet, ResumeView, RoleTag } from '../../types/resume';

// LETTER page (792pt), 48pt margins, 9.5pt body at 1.25 line-height ≈ 12pt/line.
// 2 pages × (792 - 96)pt / 12pt ≈ 116 total lines; fixed sections (entry
// headers, section titles, descriptions, skills, education) consume ~55.
// Tune LINES_BUDGET until PDF output consistently fills 2 pages.
const CHARS_PER_LINE = 90;
const LINES_BUDGET = 60;

const estLines = (text: string): number => Math.ceil(text.length / CHARS_PER_LINE);

function bulletWeight(bullet: Bullet, role: RoleTag): number {
  return bullet.weight?.[role] ?? (bullet.tags.length === 0 ? 5 : 2);
}

/**
 * Trims bullets in a ResumeView to fit a 2-page PDF budget.
 *
 * Bullets are ranked globally by per-role weight, then selected greedily until
 * the estimated line count is exhausted. The surviving set is restored to its
 * original source order within each entry. Entries with no surviving bullets
 * are dropped (matching the invariant already enforced by useResumeView).
 *
 * The 'all' role is returned unchanged — it is the unfiltered transparency
 * view and trimming it would be misleading.
 */
export function applyPdfBudget(view: ResumeView): ResumeView {
  if (view.role === 'all') return view;

  const role = view.role;

  // Build a flat list of all bullets with a stable string key and computed weight.
  type Candidate = { key: string; bullet: Bullet; weight: number };
  const candidates: Candidate[] = [];

  view.experience.forEach((entry, ei) => {
    entry.bullets.forEach((bullet, bi) => {
      candidates.push({ key: `exp-${ei}-${bi}`, bullet, weight: bulletWeight(bullet, role) });
    });
  });

  view.projects.forEach((project, pi) => {
    project.highlights.forEach((bullet, bi) => {
      candidates.push({ key: `proj-${pi}-${bi}`, bullet, weight: bulletWeight(bullet, role) });
    });
  });

  // Greedy selection: highest-weight bullets first, respect line budget.
  const kept = new Set<string>();
  let used = 0;

  [...candidates]
    .sort((a, z) => z.weight - a.weight)
    .forEach(({ key, bullet }) => {
      const lines = estLines(bullet.text);
      if (used + lines <= LINES_BUDGET) {
        kept.add(key);
        used += lines;
      }
    });

  // Reconstruct in original source order; drop entries with no kept bullets.
  const experience = view.experience
    .map((entry, ei) => ({
      ...entry,
      bullets: entry.bullets.filter((_, bi) => kept.has(`exp-${ei}-${bi}`)),
    }))
    .filter((entry) => entry.bullets.length > 0);

  // Projects keep their description regardless; only highlights are budgeted.
  const projects = view.projects.map((project, pi) => ({
    ...project,
    highlights: project.highlights.filter((_, bi) => kept.has(`proj-${pi}-${bi}`)),
  }));

  return { ...view, experience, projects };
}
