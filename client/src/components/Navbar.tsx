import React, { useState } from "react";
import { useTheme } from "./ThemeContext";

interface NavbarProps {
    onLoginClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick }) => {
    const { dark, toggleTheme } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = [
        { label: "Profile", href: "#profile" },
        { label: "Projects", href: "#projects" },
        { label: "Connect", href: "#contact" },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 flex items-center justify-between h-14">
                {/* Logo */}
                <a
                    href="#profile"
                    className="title-font font-extrabold text-lg text-sky-500"
                >
                    BDH
                </a>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-2">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="title-font text-sm px-3 py-1.5 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="ml-2 px-2 py-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
                    >
                        {dark ? "☀️" : "🌙"}
                    </button>
                    <button
                        onClick={onLoginClick}
                        className="ml-2 title-font text-sm font-bold px-4 py-1.5 rounded-md border-2 border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition-colors"
                    >
                        Log In
                    </button>
                </div>

                {/* Mobile controls */}
                <div className="flex md:hidden items-center gap-2">
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="px-2 py-1.5 text-lg"
                    >
                        {dark ? "☀️" : "🌙"}
                    </button>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        className="px-2 py-1.5 text-2xl text-gray-700 dark:text-gray-300"
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {menuOpen && (
                <div className="md:hidden px-4 pb-4 border-t border-gray-200 dark:border-gray-700">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="block py-2 title-font text-sm text-gray-700 dark:text-gray-300"
                        >
                            {link.label}
                        </a>
                    ))}
                    <button
                        onClick={() => { onLoginClick(); setMenuOpen(false); }}
                        className="mt-2 title-font text-sm font-bold px-4 py-1.5 rounded-md border-2 border-sky-500 text-sky-500"
                    >
                        Log In
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;