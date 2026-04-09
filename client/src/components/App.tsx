import React, { useState } from "react";
import { ThemeProvider } from "./ThemeContext";
import Navbar from "./Navbar";
import AuthModal from "./AuthModal";
import Profile from "./Profile";
import Projects from "./Projects";
import Contact from "./Contact";

const App: React.FC = () => {
    const [showAuth, setShowAuth] = useState(false);

    return (
        <ThemeProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
                <Navbar onLoginClick={() => setShowAuth(true)} />
                {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
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