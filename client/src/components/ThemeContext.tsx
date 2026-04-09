import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeContextType {
    dark: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    dark: false,
    toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem("theme");
        return saved === "dark";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (dark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", dark ? "dark" : "light");
    }, [dark]);

    const toggleTheme = () => setDark((prev) => !prev);

    return (
        <ThemeContext.Provider value={{ dark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;