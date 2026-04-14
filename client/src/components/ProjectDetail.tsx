import React, { useCallback } from "react";
import useEscapeKey from "../hooks/useEscapeKey";
import useFocusTrap from "../hooks/useFocusTrap";
import useScrollLock from "../hooks/useScrollLock";

export interface ProjectDetailData {
    name: string;
    summary: string;
    description: string;
    imgSrc?: string;
    liveSiteLink?: string;
    sourceCodeLink: string;
    techList: string[];
}

interface ProjectDetailProps {
    project: ProjectDetailData;
    onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
    // Keyboard dismiss via Escape
    const stableOnClose = useCallback(() => onClose(), [onClose]);
    useEscapeKey(stableOnClose);

    // Trap focus inside the dialog while open
    const dialogRef = useFocusTrap<HTMLDivElement>();

    // Prevent background page from scrolling while modal is open
    useScrollLock();

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-detail-title"
        >
            <div
                ref={dialogRef}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with close button */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                    <h2
                        id="project-detail-title"
                        className="title-font text-2xl font-bold text-gray-900 dark:text-gray-100"
                    >
                        {project.name}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close detail view"
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl leading-none transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-6 space-y-6">
                    {/* Screenshot */}
                    {project.imgSrc && (
                        <img
                            src={project.imgSrc}
                            alt={`${project.name} screenshot`}
                            className="w-full rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                    )}

                    {/* Summary */}
                    <p className="text-sm italic text-gray-500 dark:text-gray-400">
                        {project.summary}
                    </p>

                    {/* Description — the detail content */}
                    <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed space-y-3">
                        {project.description.split("\n").map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>

                    {/* Tech stack */}
                    <div>
                        <h3 className="title-font text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            Tech Stack
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {project.techList.map((tech) => (
                                <span
                                    key={tech}
                                    className="text-white bg-sky-700 dark:bg-sky-800 px-3 py-1 rounded-md text-xs title-font"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex gap-4 pt-2 title-font text-sm">
                        {project.liveSiteLink && (
                            <a
                                href={project.liveSiteLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 rounded-lg bg-sky-500 text-white hover:bg-sky-600 transition-colors"
                            >
                                View Live Site ↗
                            </a>
                        )}
                        <a
                            href={project.sourceCodeLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-lg border-2 border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white transition-colors"
                        >
                            View Source ↗
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;