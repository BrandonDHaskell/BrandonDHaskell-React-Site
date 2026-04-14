import { useEffect, useRef, RefObject } from "react";

const FOCUSABLE_SELECTORS = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "textarea:not([disabled])",
    "select:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

/**
 * Traps keyboard focus within the referenced container element.
 * On mount, moves focus into the container. On Tab/Shift+Tab at the
 * boundaries, wraps focus to the opposite end. Restores focus to the
 * previously active element on unmount.
 */
const useFocusTrap = <T extends HTMLElement>(): RefObject<T> => {
    // null! tells TS the ref is non-nullable once attached to a DOM node,
    // which satisfies React 18's LegacyRef<T> prop constraint.
    const containerRef = useRef<T>(null!);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // Remember what was focused before the trap opened
        previousFocusRef.current = document.activeElement as HTMLElement;

        // Move focus into the container
        const focusableElements = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== "Tab") return;

            const focusable = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            // Restore focus when trap is removed
            previousFocusRef.current?.focus();
        };
    }, []);

    return containerRef;
};

export default useFocusTrap;