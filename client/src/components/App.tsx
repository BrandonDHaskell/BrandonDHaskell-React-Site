import React from "react";
import { ThemeProvider } from "./ThemeContext";
import Navbar from "./Navbar";
import Profile from "./Profile";
import Projects from "./Projects";
import Contact from "./Contact";

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                {/* Skip navigation link for keyboard/screen-reader users */}
                <a
                    href="#profile"
                    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sky-500 focus:text-white focus:rounded-md focus:text-sm title-font"
                >
                    Skip to content
                </a>
                <Navbar />
                <Profile />
                <Projects />
                <Contact />
                <footer className="text-center py-5 text-xs text-gray-400 dark:text-gray-600 title-font">
                    © {new Date().getFullYear()} Brandon Haskell
                </footer>
            </div>
        </ThemeProvider>
    );
};

export default App;