import {
  ROLE_TAGS,
  ResumeData,
  RoleTag,
  Taggable,
} from '../types/resume';

export interface ValidationResult {
  /** Structural problems — CI fails on any of these. */
  errors: string[];
  /** Semantic smells — surfaced but non-fatal. */
  warnings: string[];
}

const isString = (v: unknown): v is string =>
  typeof v === 'string' && v.length > 0;

const isRoleTag = (v: unknown): v is RoleTag =>
  typeof v === 'string' && (ROLE_TAGS as readonly string[]).includes(v);

/**
 * Validates the master JSON at runtime.
 *
 * Why this exists when the data is typed: `masterData as ResumeData` is a
 * compile-time ASSERTION, not a check — tsc trusts it blindly. This
 * validator is what actually guards against a typo'd tag or a missing
 * field reaching production. It also enforces semantic rules types can't
 * express (e.g. "every offered role must surface at least one bullet").
 */
export const validateResumeData = (data: unknown): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (typeof data !== 'object' || data === null) {
    return { errors: ['Root is not an object.'], warnings };
  }

  const d = data as Partial<ResumeData>;

  // ---- roles -------------------------------------------------------------
  const offeredTags: RoleTag[] = [];
  if (!Array.isArray(d.roles) || d.roles.length === 0) {
    errors.push('`roles` must be a non-empty array.');
  } else {
    d.roles.forEach((role, i) => {
      if (!isRoleTag(role.tag)) {
        errors.push(
          `roles[${i}].tag "${String(role.tag)}" is not in ROLE_TAGS ` +
            `(${ROLE_TAGS.join(', ')}).`,
        );
      } else if (offeredTags.includes(role.tag)) {
        errors.push(`roles[${i}]: duplicate tag "${role.tag}".`);
      } else {
        offeredTags.push(role.tag);
      }
      if (!isString(role.label)) errors.push(`roles[${i}].label is missing.`);
      if (!isString(role.blurb)) errors.push(`roles[${i}].blurb is missing.`);
    });
    if (d.roles.length > 4) {
      warnings.push(
        `${d.roles.length} role variants offered — consider <=3 adjacent ` +
          'roles so the resume reads as one coherent story.',
      );
    }
  }

  // ---- profile -----------------------------------------------------------
  if (!d.profile) {
    errors.push('`profile` is missing.');
  } else {
    (['name', 'email', 'location', 'website', 'github', 'linkedin'] as const)
      .filter((key) => !isString(d.profile?.[key]))
      .forEach((key) => errors.push(`profile.${key} is missing or empty.`));

    if (!isString(d.profile.headline?.default)) {
      errors.push('profile.headline.default is required.');
    }
    if (!isString(d.profile.summary?.default)) {
      errors.push('profile.summary.default is required.');
    }
    offeredTags.forEach((tag) => {
      if (!isString(d.profile?.headline?.[tag])) {
        warnings.push(
          `profile.headline.${tag} missing — the default headline will be ` +
            'used for that variant.',
        );
      }
      if (!isString(d.profile?.summary?.[tag])) {
        warnings.push(`profile.summary.${tag} missing — default will be used.`);
      }
    });
  }

  // ---- shared Taggable checks ---------------------------------------------
  /** Tags content uses but no offered role can ever surface. */
  const orphanTags = new Set<string>();

  const checkTaggable = (item: Partial<Taggable>, path: string): void => {
    if (!Array.isArray(item.tags)) {
      errors.push(`${path}.tags must be an array (use [] for "all roles").`);
      return;
    }
    item.tags.forEach((tag) => {
      if (!isRoleTag(tag)) {
        errors.push(`${path}.tags contains unknown tag "${String(tag)}".`);
      } else if (!offeredTags.includes(tag)) {
        orphanTags.add(tag);
      }
    });
    if (item.weight !== undefined) {
      Object.keys(item.weight).forEach((key) => {
        if (!isRoleTag(key)) {
          errors.push(`${path}.weight has unknown role key "${key}".`);
        } else if (item.tags && item.tags.length > 0 && !item.tags.includes(key)) {
          warnings.push(
            `${path}.weight.${key} has no effect — "${key}" is not in tags.`,
          );
        }
      });
    }
  };

  // ---- experience ----------------------------------------------------------
  const bulletCountPerRole = new Map<RoleTag, number>(
    offeredTags.map((t) => [t, 0]),
  );

  if (!Array.isArray(d.experience) || d.experience.length === 0) {
    errors.push('`experience` must be a non-empty array.');
  } else {
    d.experience.forEach((entry, i) => {
      const path = `experience[${i}]`;
      if (!isString(entry.company)) errors.push(`${path}.company is missing.`);
      if (!isString(entry.title)) errors.push(`${path}.title is missing.`);
      if (!isString(entry.start) || !/^\d{4}-\d{2}$/.test(entry.start)) {
        errors.push(`${path}.start must be "YYYY-MM".`);
      }
      if (entry.end !== null && (!isString(entry.end) || !/^\d{4}-\d{2}$/.test(entry.end))) {
        errors.push(`${path}.end must be "YYYY-MM" or null (= present).`);
      }
      checkTaggable(entry, path);

      if (!Array.isArray(entry.bullets) || entry.bullets.length === 0) {
        errors.push(`${path}.bullets must be a non-empty array.`);
      } else {
        entry.bullets.forEach((b, j) => {
          const bPath = `${path}.bullets[${j}]`;
          if (!isString(b.text)) errors.push(`${bPath}.text is missing.`);
          checkTaggable(b, bPath);
          if (Array.isArray(b.tags)) {
            const visibleFor =
              b.tags.length === 0
                ? offeredTags
                : b.tags.filter((t): t is RoleTag => offeredTags.includes(t as RoleTag));
            visibleFor.forEach((t) =>
              bulletCountPerRole.set(t, (bulletCountPerRole.get(t) ?? 0) + 1),
            );
          }
        });
      }
    });
  }

  // Every offered role must produce a non-empty resume.
  bulletCountPerRole.forEach((count, tag) => {
    if (count === 0) {
      errors.push(
        `Role "${tag}" is offered to visitors but no experience bullet is ` +
          'visible for it — the variant would render an empty Experience section.',
      );
    } else if (count < 3) {
      warnings.push(
        `Role "${tag}" surfaces only ${count} experience bullet(s) — thin variant.`,
      );
    }
  });

  // ---- projects / skills / education ---------------------------------------
  (d.projects ?? []).forEach((p, i) => {
    const path = `projects[${i}]`;
    if (!isString(p.name)) errors.push(`${path}.name is missing.`);
    if (!isString(p.description)) errors.push(`${path}.description is missing.`);
    if (!Array.isArray(p.stack)) errors.push(`${path}.stack must be an array.`);
    checkTaggable(p, path);
    (p.highlights ?? []).forEach((h, j) =>
      checkTaggable(h, `${path}.highlights[${j}]`),
    );
  });

  if (!Array.isArray(d.skills) || d.skills.length === 0) {
    errors.push('`skills` must be a non-empty array.');
  } else {
    d.skills.forEach((s, i) => {
      const path = `skills[${i}]`;
      if (!isString(s.category)) errors.push(`${path}.category is missing.`);
      if (!Array.isArray(s.items) || s.items.length === 0) {
        errors.push(`${path}.items must be a non-empty array.`);
      }
      checkTaggable(s, path);
    });
  }

  (d.education ?? []).forEach((e, i) => {
    if (!isString(e.institution) || !isString(e.credential)) {
      errors.push(`education[${i}] needs institution and credential.`);
    }
  });

  orphanTags.forEach((tag) =>
    warnings.push(
      `Content is tagged "${tag}" but that role is not offered in \`roles\` — ` +
        'those items only appear under "Everything".',
    ),
  );

  return { errors, warnings };
};