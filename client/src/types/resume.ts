/**
 * Core resume data model.
 * One master dataset, filtered per-role at render time.
 */

/** The role variants a visitor can choose. Add/remove as needed. */
export const ROLE_TAGS = [
  'frontend',
  'backend',
  'fullstack',
  'devops',
  'cloud',
] as const;

export type RoleTag = (typeof ROLE_TAGS)[number];

/**
 * What a visitor can actually select: a real role, or 'all' — the
 * unfiltered master view. 'all' is a pseudo-role: it never appears in
 * content `tags`, only as a selection. It exists as transparency proof
 * that every variant draws from the same underlying record.
 */
export type RoleSelection = RoleTag | 'all';

export const ALL_ROLES: RoleSelection = 'all';

/** Human-readable labels + ordering metadata for the selector UI. */
export interface RoleDefinition {
  tag: RoleTag;
  label: string; // e.g. "Backend Engineer"
  blurb: string; // one-liner shown in the selector
}

/** Anything that can be filtered by role carries tags + optional weight. */
export interface Taggable {
  /** Roles this item is relevant to. Empty array = show for ALL roles. */
  tags: RoleTag[];
  /**
   * Optional per-role emphasis (higher = surfaces earlier).
   * Falls back to source order when absent.
   */
  weight?: Partial<Record<RoleTag, number>>;
}

export interface Profile {
  name: string;
  /** Role-specific headline, keyed by tag, with a default fallback. */
  headline: Record<RoleTag, string> & { default: string };
  email: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  /** Role-specific summary paragraph. */
  summary: Partial<Record<RoleTag, string>> & { default: string };
}

export interface Bullet extends Taggable {
  text: string;
}

export interface ExperienceEntry extends Taggable {
  company: string;
  title: string;
  location: string;
  start: string; // ISO-ish "2022-03" — formatted at render time
  end: string | null; // null = present
  bullets: Bullet[];
}

export interface Project extends Taggable {
  name: string;
  url?: string;
  description: string;
  highlights: Bullet[];
  stack: string[];
}

export interface SkillGroup extends Taggable {
  category: string; // e.g. "Languages", "Cloud & Infra"
  items: string[];
}

export interface EducationEntry {
  institution: string;
  credential: string;
  year: string;
}

/** The master document — the ONLY file you edit when life happens. */
export interface ResumeData {
  roles: RoleDefinition[];
  profile: Profile;
  experience: ExperienceEntry[];
  projects: Project[];
  skills: SkillGroup[];
  education: EducationEntry[];
}

/** A role-filtered, render-ready view derived from ResumeData. */
export interface ResumeView {
  role: RoleSelection;
  roleLabel: string;
  headline: string;
  summary: string;
  profile: Profile;
  experience: ExperienceEntry[]; // bullets pre-filtered & sorted
  projects: Project[];
  skills: SkillGroup[];
  education: EducationEntry[];
}