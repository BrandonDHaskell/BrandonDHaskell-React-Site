import { useCallback, useEffect, useState } from 'react';
import { ROLE_TAGS, RoleSelection } from '../types/resume';

const PARAM_KEY = 'role';
const STORAGE_KEY = 'resume.role';

const isRoleSelection = (value: string | null): value is RoleSelection =>
  value !== null &&
  (value === 'all' || (ROLE_TAGS as readonly string[]).includes(value));

/** URL param wins over storage so deep links always behave predictably. */
export const resolveInitialSelection = (): RoleSelection | null => {
  const fromUrl = new URLSearchParams(window.location.search).get(PARAM_KEY);
  if (isRoleSelection(fromUrl)) return fromUrl;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isRoleSelection(stored)) return stored;
  } catch {
    // Storage unavailable (private mode / blocked) — fall through to gate.
  }

  return null; // null = no selection yet -> show the RoleGate
};

/** Returns true if a valid role exists in the URL param or localStorage. */
export const hasRole = (): boolean => resolveInitialSelection() !== null;

const persist = (selection: RoleSelection): void => {
  try {
    window.localStorage.setItem(STORAGE_KEY, selection);
  } catch {
    // Non-fatal: the session still works, it just won't be remembered.
  }
};

const writeUrl = (selection: RoleSelection, replace: boolean): void => {
  const url = new URL(window.location.href);
  url.searchParams.set(PARAM_KEY, selection);
  if (replace) {
    window.history.replaceState({}, '', url);
  } else {
    window.history.pushState({}, '', url);
  }
};

export interface RoleSelectionState {
  /** null = nothing chosen yet; the gate should render. */
  selection: RoleSelection | null;
  /** True when the user arrived via a ?role= deep link (gate skipped). */
  arrivedViaDeepLink: boolean;
  /** Choose a role: updates state, URL, and localStorage. */
  select: (next: RoleSelection) => void;
  /** Forget the remembered role and return to the gate. */
  reset: () => void;
}

/**
 * Resolution order: URL param > localStorage > null (show gate).
 *
 * - Selecting at the gate or in the page persists to localStorage and
 *   pushes ?role= so the current URL is always a shareable deep link.
 * - A stored selection is mirrored into the URL on load (replaceState,
 *   no history entry) for the same reason.
 * - Deep-link arrivals are persisted too: "remember my choice" includes
 *   choices made by following a targeted link.
 */
export const useRoleSelection = (): RoleSelectionState => {
  const [selection, setSelection] = useState<RoleSelection | null>(
    resolveInitialSelection,
  );
  const [arrivedViaDeepLink] = useState<boolean>(() =>
    isRoleSelection(new URLSearchParams(window.location.search).get(PARAM_KEY)),
  );

  // On load, sync URL and storage with whatever selection we resolved.
  useEffect(() => {
    if (selection === null) return;
    persist(selection);
    const inUrl = new URLSearchParams(window.location.search).get(PARAM_KEY);
    if (inUrl !== selection) writeUrl(selection, true);
    // Intentionally run only once on mount for the initial resolution.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const select = useCallback((next: RoleSelection) => {
    persist(next);
    writeUrl(next, false);
    setSelection(next);
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* non-fatal */
    }
    const url = new URL(window.location.href);
    url.searchParams.delete(PARAM_KEY);
    window.history.pushState({}, '', url);
    setSelection(null);
  }, []);

  // Honor browser back/forward across gate <-> resume states.
  useEffect(() => {
    const onPopState = (): void => {
      const fromUrl = new URLSearchParams(window.location.search).get(PARAM_KEY);
      setSelection(isRoleSelection(fromUrl) ? fromUrl : null);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return { selection, arrivedViaDeepLink, select, reset };
};