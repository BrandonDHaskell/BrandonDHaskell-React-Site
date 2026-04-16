import React from "react";

const HeroActions: React.FC = () => (
    <div className="flex flex-wrap gap-3 pt-6">
        <a
            href="#projects"
            className="inline-flex items-center px-5 py-2.5 text-sm title-font font-bold
                       rounded-lg bg-sky-500 text-white
                       hover:bg-sky-600 active:bg-sky-700
                       shadow-md shadow-sky-500/20
                       transition-colors"
        >
            View Projects
        </a>
        <a
            href="#contact"
            className="inline-flex items-center px-5 py-2.5 text-sm title-font font-bold
                       rounded-lg border-2 border-sky-500 text-sky-500
                       hover:bg-sky-500 hover:text-white
                       dark:text-sky-400 dark:border-sky-400
                       dark:hover:bg-sky-400 dark:hover:text-gray-900
                       transition-colors"
        >
            Contact Me
        </a>
    </div>
);

export default HeroActions;