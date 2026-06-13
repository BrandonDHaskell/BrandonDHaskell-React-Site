import { useMemo } from 'react';
import {
  Bullet,
  ResumeData,
  ResumeView,
  RoleSelection,
  RoleTag,
  Taggable,
} from '../types/resume';

/** Empty tags = universal; otherwise must include the active role. */
const matchesRole = (item: Taggable, role: RoleTag): boolean =>
  item.tags.length === 0 || item.tags.includes(role);

/** Sort by per-role weight (desc), stable for untagged/unweighted items. */
const byWeight =
  (role: RoleTag) =>
  (a: Taggable, b: Taggable): number =>
    (b.weight?.[role] ?? 0) - (a.weight?.[role] ?? 0);

const filterBullets = (bullets: Bullet[], role: RoleTag): Bullet[] =>
  bullets.filter((b) => matchesRole(b, role)).sort(byWeight(role));

/**
 * Derives a render-ready ResumeView from the master dataset.
 *
 * 'all' returns the complete, unfiltered record in source order — the
 * transparency view proving every variant draws from the same data.
 * Pure, memoized derivation shared by the web renderer and the PDF builder.
 */
export const useResumeView = (
  data: ResumeData,
  selection: RoleSelection,
): ResumeView =>
  useMemo(() => {
    if (selection === 'all') {
      return {
        role: 'all',
        roleLabel: 'Complete Resume',
        headline: data.profile.headline.default,
        summary: data.profile.summary.default,
        profile: data.profile,
        experience: data.experience,
        projects: data.projects,
        skills: data.skills,
        education: data.education,
      };
    }

    const role: RoleTag = selection;
    const roleDef = data.roles.find((r) => r.tag === role);

    const experience = data.experience
      .filter((entry) => matchesRole(entry, role))
      .map((entry) => ({
        ...entry,
        bullets: filterBullets(entry.bullets, role),
      }))
      // Drop roles where nothing survived filtering.
      .filter((entry) => entry.bullets.length > 0);

    const projects = data.projects
      .filter((p) => matchesRole(p, role))
      .sort(byWeight(role))
      .map((p) => ({ ...p, highlights: filterBullets(p.highlights, role) }));

    const skills = data.skills.filter((s) => matchesRole(s, role));

    return {
      role,
      roleLabel: roleDef?.label ?? role,
      headline: data.profile.headline[role] ?? data.profile.headline.default,
      summary: data.profile.summary[role] ?? data.profile.summary.default,
      profile: data.profile,
      experience,
      projects,
      skills,
      education: data.education,
    };
  }, [data, selection]);