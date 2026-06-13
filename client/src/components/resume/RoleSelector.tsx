import React from 'react';
import { Check } from 'lucide-react';
import { RoleDefinition, RoleSelection } from '../../types/resume';

interface RoleSelectorProps {
  roles: RoleDefinition[];
  selected: RoleSelection;
  onSelect: (selection: RoleSelection) => void;
}

interface PillProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
  blurb?: string;
}

const Pill: React.FC<PillProps> = ({ isActive, onClick, label, blurb }) => (
  <button
    type="button"
    role="radio"
    aria-checked={isActive}
    onClick={onClick}
    className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm
      transition-colors focus-visible:outline focus-visible:outline-2
      focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100
      ${
        isActive
          ? 'border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900'
          : 'border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500 dark:hover:border-zinc-400'
      }`}
  >
    {isActive && <Check className="h-4 w-4" aria-hidden="true" />}
    <span className="font-medium">{label}</span>
    {blurb && (
      <span
        className={`hidden text-xs md:inline ${
          isActive ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-400 dark:text-zinc-500'
        }`}
      >
        {blurb}
      </span>
    )}
  </button>
);

/**
 * In-page role switcher (post-gate). Includes the 'all' pseudo-role so
 * the unfiltered view is always one click away.
 */
export const RoleSelector: React.FC<RoleSelectorProps> = React.memo(
  ({ roles, selected, onSelect }) => (
    <div
      role="radiogroup"
      aria-label="Resume focus"
      className="flex flex-col gap-2 sm:flex-row sm:flex-wrap"
    >
      {roles.map((role) => (
        <Pill
          key={role.tag}
          isActive={role.tag === selected}
          onClick={() => onSelect(role.tag)}
          label={role.label}
          blurb={role.blurb}
        />
      ))}
      <Pill
        isActive={selected === 'all'}
        onClick={() => onSelect('all')}
        label="Everything"
        blurb="the unfiltered record"
      />
    </div>
  ),
);

RoleSelector.displayName = 'RoleSelector';