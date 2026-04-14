import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

interface ThemeContextType {
    dark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    dark: false,
    toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

/**
 * Resolves the initial theme preference:
 *   1. Explicit user choice persisted in localStorage
 *   2. OS-level preference via prefers-color-scheme
 *   3. Light mode as the final fallback
 *
 * The blocking <script> in index.html applies the "dark" class to <html>
 * before React hydrates, so the initial render already matches — no flash.
 */
const getInitialTheme = (): boolean => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dark, setDark] = useState(getInitialTheme);

    // Keep the <html> class and localStorage in sync whenever the state changes
    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", dark);
        localStorage.setItem("theme", dark ? "dark" : "light");
    }, [dark]);

    const toggleTheme = useCallback(() => setDark((prev) => !prev), []);

    return (
        <ThemeContext.Provider value={{ dark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;