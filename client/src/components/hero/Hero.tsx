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
            Systems · Backend · Embedded · Internal Tools
        </p>

        {/* Headline */}
        <h1
            className={`title-font text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight pt-3
                        text-gray-900 dark:text-gray-100
                        transition-all duration-600 ease-out ${reveal(visible[1])}`}
        >
            I build practical software systems for operations, backend services, and connected devices.
        </h1>

        {/* Supporting paragraph */}
        <p
            className={`pt-4 text-base leading-relaxed max-w-xl
                        text-gray-600 dark:text-gray-400
                        transition-all duration-700 ease-out ${reveal(visible[2])}`}
        >
            I'm Brandon Haskell — 10+ years of systems and operations work at Amazon,
            now building software across React, TypeScript, Go, C++, and embedded systems.
        </p>

        {/* Role-focus line */}
        <p
            className={`pt-3 text-sm italic
                        text-gray-500 dark:text-gray-500
                        transition-all duration-700 ease-out ${reveal(visible[3])}`}
        >
            Targeting Automation Engineer, Internal Tools Developer, Junior Backend Engineer, and Technical Solutions Engineer roles.
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