import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Profile, RoleDefinition, RoleSelection } from '../../types/resume';

interface RoleGateProps {
  profile: Profile;
  roles: RoleDefinition[];
  onSelect: (selection: RoleSelection) => void;
}

/**
 * Soft gate shown to organic visitors (no ?role= param, nothing remembered).
 *
 * Design intent:
 * - Identity is visible immediately — the gate is never a blank wall.
 *   Name + default headline render before any choice is made, so link
 *   previews and 5-second skims still work in the candidate's favor.
 * - Copy frames role selection as a service ("what are you hiring for?"),
 *   not as the candidate keeping multiple stories.
 * - "Show me everything" is always available: one click of transparency
 *   proof that variants differ only in emphasis, never in facts.
 */
export const RoleGate: React.FC<RoleGateProps> = ({
  profile,
  roles,
  onSelect,
}) => (
  <main className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center px-4 py-16 sm:px-6">
    {/* Identity — visible before any interaction */}
    <header>
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
        {profile.name}
      </h1>
      <p className="mt-2 text-lg text-zinc-600">{profile.headline.default}</p>
    </header>

    {/* The question */}
    <div className="mt-12">
      <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-zinc-500">
        What are you hiring for?
      </h2>
      <p className="mt-2 text-sm text-zinc-600">
        Pick a focus and I&rsquo;ll bring the most relevant work forward.
        Same record underneath — only the emphasis changes.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {roles.map((role) => (
          <button
            key={role.tag}
            type="button"
            onClick={() => onSelect(role.tag)}
            className="group rounded-xl border border-zinc-200 bg-white p-4 text-left
              transition-colors hover:border-zinc-900
              focus-visible:outline focus-visible:outline-2
              focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            <span className="flex items-center justify-between font-medium text-zinc-900">
              {role.label}
              <ArrowRight
                className="h-4 w-4 text-zinc-300 transition-transform
                  group-hover:translate-x-0.5 group-hover:text-zinc-900
                  motion-reduce:transition-none"
                aria-hidden="true"
              />
            </span>
            <span className="mt-1 block text-xs text-zinc-500">
              {role.blurb}
            </span>
          </button>
        ))}
      </div>

      {/* Transparency escape hatch */}
      <button
        type="button"
        onClick={() => onSelect('all')}
        className="mt-6 text-sm text-zinc-500 underline decoration-zinc-300
          underline-offset-4 transition-colors hover:text-zinc-900
          focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
      >
        Not sure yet — show me everything
      </button>
    </div>
  </main>
);