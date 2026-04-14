import React, { useState } from "react";
import { useTheme } from "./ThemeContext";
import { GitHubIcon, LinkedInIcon } from "./Icons";

const Navbar: React.FC = () => {
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
                    <span className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" aria-hidden="true" />
                    <a
                        href="https://github.com/BrandonDHaskell"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub profile"
                        className="px-2 py-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <GitHubIcon size={18} />
                    </a>
                    <a
                        href="https://linkedin.com/in/BrandonDHaskell"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="LinkedIn profile"
                        className="px-2 py-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <LinkedInIcon size={18} />
                    </a>
                    <button
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                        className="ml-2 px-2 py-1.5 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-lg"
                    >
                        {dark ? "☀️" : "🌙"}
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
                    <div className="flex items-center gap-4 pt-3 mt-2 border-t border-gray-200 dark:border-gray-700">
                        <a
                            href="https://github.com/BrandonDHaskell"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub profile"
                            className="text-gray-600 dark:text-gray-300 hover:text-sky-500 transition-colors"
                        >
                            <GitHubIcon size={20} />
                        </a>
                        <a
                            href="https://linkedin.com/in/BrandonDHaskell"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn profile"
                            className="text-gray-600 dark:text-gray-300 hover:text-sky-500 transition-colors"
                        >
                            <LinkedInIcon size={20} />
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;