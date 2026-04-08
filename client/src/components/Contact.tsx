import React from "react";

const Contact: React.FC = () => {
    return (
        <section id="contact" className="column justify-center">
            <h1
                className="text-4xl font-bold text-center py-8"
                style={{ fontFamily: 'JetBrains Mono, sans-serif' }}
            >CONNECT</h1>
            <p className="pt-2 pb-8 px-6 max-w-[800px] mx-auto">
                I'm always open to sharing insights, collaborating, and exploring
                the vast potential of technology. Feel free to reach out through
                any of the platforms below.
            </p>
            <div className="flex flex-col items-center space-y-4 pb-12">
                <a
                    href="https://linkedin.com/in/BrandonDHaskell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-800 title-font text-lg"
                >
                    LinkedIn — in/BrandonDHaskell
                </a>
                <a
                    href="https://github.com/BrandonDHaskell"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 hover:text-sky-800 title-font text-lg"
                >
                    GitHub — BrandonDHaskell
                </a>
                <a
                    href="mailto:brandon@brandondhaskell.com"
                    className="text-sky-600 hover:text-sky-800 title-font text-lg"
                >
                    Email — brandon@brandondhaskell.com
                </a>
            </div>
        </section>
    );
};

export default Contact;