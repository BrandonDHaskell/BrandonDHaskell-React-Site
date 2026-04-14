import { useEffect } from "react";

/**
 * Locks page scroll while the consuming component is mounted.
 * Preserves any existing inline overflow style and restores it on unmount,
 * so nested modals or third-party libraries that also touch overflow
 * won't interfere.
 */
const useScrollLock = (): void => {
    useEffect(() => {
        const original = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = original;
        };
    }, []);
};

export default useScrollLock;