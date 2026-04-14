import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProjectItem from "./ProjectItem";
import ProjectDetail, { ProjectDetailData } from "./ProjectDetail";
import projects from "../data/projects";
import { preLoadImages } from "../utils/imagePreload";

const ProjectList: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<ProjectDetailData | null>(null);

    // Only preload images that are actually used by active projects
    const imageSources = useMemo(
        () => projects.map((p) => p.imgSrc).filter((src): src is string => Boolean(src)),
        []
    );

    useEffect(() => {
        if (imageSources.length === 0) {
            setLoading(false);
            return;
        }
        preLoadImages(imageSources).then(() => setLoading(false));
    }, [imageSources]);

    const handleSelectProject = useCallback((project: ProjectDetailData) => {
        setSelectedProject(project);
    }, []);

    const handleCloseDetail = useCallback(() => {
        setSelectedProject(null);
    }, []);

    if (loading) {
        return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>;
    }

    return (
        <>
            <div className="project-list flex flex-wrap justify-center m-9 gap-6">
                {projects.map((project) => (
                    <ProjectItem
                        key={project.name}
                        project={project}
                        onClick={() => handleSelectProject(project)}
                    />
                ))}
            </div>
            {selectedProject && (
                <ProjectDetail
                    project={selectedProject}
                    onClose={handleCloseDetail}
                />
            )}
        </>
    );
};

export default ProjectList;