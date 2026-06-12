import React from "react";
import HeroActions from "./HeroActions";
import HeroChips from "./HeroChips";

interface HeroCopyProps {
    /** Which stagger elements are visible (drives the entrance animation) */
    visible: boolean[];
}

/** Shared transition + transform class based on visibility state */
const reveal = (isVisible: boolean): string =>
    isVisible
        ? "translate-y-0 opacity-100"
        : "translate-y-4 opacity-0";

const HeroCopy: React.FC<HeroCopyProps> = ({ visible }) => (
    <div className="flex flex-col justify-center">
        {/* Eyebrow */}
        <p
            className={`uppercase tracking-[0.2em] text-xs title-font
                        text-sky-500 dark:text-sky-400
                        transition-all duration-500 ease-out ${reveal(visible[0])}`}
        >
            Technical Operations · System Analysis · Automation · Internal Tools
        </p>

        {/* Headline */}
        <h1
            className={`title-font text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight pt-3
                        text-gray-900 dark:text-gray-100
                        transition-all duration-600 ease-out ${reveal(visible[1])}`}
        >
            I keep complex operations reliable, and I build the tools that make them run.
        </h1>

        {/* Supporting paragraph */}
        <p
            className={`pt-4 text-base leading-relaxed max-w-xl
                        text-gray-600 dark:text-gray-400
                        transition-all duration-700 ease-out ${reveal(visible[2])}`}
        >
            I'm Brandon Haskell, a technical operations and systems professional with 10+ years at Amazon. I configured the support systems behind global marketplace launches, and I build internal tools in SQL, Python, and Go that make operations more reliable.
        </p>

        {/* Role-focus line */}
        <p
            className={`pt-3 text-sm italic
                        text-gray-500 dark:text-gray-500
                        transition-all duration-700 ease-out ${reveal(visible[3])}`}
        >
            Targeting technical operations, systems analyst, business systems analyst, implementation, and technical program roles.
        </p>

        {/* CTAs */}
        <div className={`transition-all duration-700 ease-out ${reveal(visible[4])}`}>
            <HeroActions />
        </div>

        {/* Credibility chips */}
        <div className={`transition-all duration-700 ease-out ${reveal(visible[5])}`}>
            <HeroChips />
        </div>
    </div>
);

export default HeroCopy;