import { useEffect } from "react";

/**
 * Calls the provided handler when the Escape key is pressed.
 * Useful for closing modals, drawers, and overlays via keyboard.
 */
const useEscapeKey = (handler: () => void): void => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handler();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [handler]);
};

export default useEscapeKey;