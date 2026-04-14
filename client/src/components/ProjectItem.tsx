import React from "react";

interface ProjectItemProps {
    name: string;
    summary: string;
    imgSrc?: string;
    liveSiteLink?: string;
    sourceCodeLink: string;
    techList: string[];
    onClick: () => void;
}

const ProjectItem: React.FC<ProjectItemProps> = React.memo(({
    name,
    summary,
    imgSrc,
    liveSiteLink,
    sourceCodeLink,
    techList,
    onClick
}) => {
    return (
        <div
            className="project-card rounded-xl p-6 max-w-xs flex flex-col bg-white dark:bg-gray-900 ring-1 ring-gray-200 dark:ring-gray-700 shadow-md hover:shadow-sky-500/20 hover:ring-sky-500 hover:scale-105 transform transition-all duration-300 cursor-pointer"
            onClick={onClick}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${name}`}
        >
            <h3 className="title-font text-lg font-bold text-center text-gray-900 dark:text-gray-100">
                {name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic pb-3 pt-1">
                {summary}
            </p>
            {imgSrc && (
                <img
                    className="rounded border border-gray-200 dark:border-gray-700 mb-3"
                    src={imgSrc}
                    alt={`${name} screenshot`}
                    loading="lazy"
                />
            )}
            <div className="flex flex-wrap justify-center gap-1.5 py-2">
                {techList.map((tech) => (
                    <span
                        key={tech}
                        className="text-white bg-sky-700 dark:bg-sky-800 px-2 py-0.5 rounded-md text-xs title-font"
                    >
                        {tech}
                    </span>
                ))}
            </div>
            <div className="flex justify-center gap-4 pt-3 mt-auto title-font text-sm">
                {liveSiteLink && (
                    <a
                        href={liveSiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 dark:text-sky-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Live ↗
                    </a>
                )}
                <a
                    href={sourceCodeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-600 dark:text-sky-400 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                >
                    Source ↗
                </a>
            </div>
        </div>
    );
});

export default ProjectItem;