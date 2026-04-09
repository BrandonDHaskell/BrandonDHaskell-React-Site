import React from "react";

const Contact: React.FC = () => {
    return (
        <section id="contact" className="bg-white dark:bg-gray-900 transition-colors">
            <h1
                className="text-4xl font-bold text-center py-8 text-gray-900 dark:text-gray-100"
                style={{ fontFamily: 'JetBrains Mono, sans-serif' }}
            >
                CONNECT
            </h1>
            <p className="pt-2 pb-8 px-6 max-w-[800px] mx-auto text-gray-700 dark:text-gray-300">
                I'm always open to sharing insights, collaborating, and exploring
                the vast potential of technology. Feel free to reach out through
                any of the platforms below.
            </p>
            <div className="flex flex-col items-center space-y-4 pb-12">
                <a
                    href="https://linkedin.com/in/BrandonDHaskell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 title-font text-lg"
                >
                    LinkedIn — in/BrandonDHaskell
                </a>
                <a
                    href="https://github.com/BrandonDHaskell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-800 dark:hover:text-sky-300 title-font text-lg"
                >
                    GitHub — BrandonDHaskell
                </a>
            </div>
        </section>
    );
};

export default Contact;