import React from "react";

const CHIPS = [
    "10+ years technical operations",
    "Amazon systems background",
    "Go • React • TypeScript • C++",
    "San Francisco Bay Area",
] as const;

const HeroChips: React.FC = () => (
    <div className="flex flex-wrap gap-2 pt-4" role="list" aria-label="Credentials">
        {CHIPS.map((label) => (
            <span
                key={label}
                role="listitem"
                className="inline-block px-3 py-1 text-xs title-font rounded-full
                           bg-gray-100 dark:bg-gray-800
                           text-gray-600 dark:text-gray-400
                           ring-1 ring-gray-200 dark:ring-gray-700"
            >
                {label}
            </span>
        ))}
    </div>
);

export default HeroChips;