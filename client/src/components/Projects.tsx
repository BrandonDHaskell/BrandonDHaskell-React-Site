import React from "react";
import ProjectList from "./ProjectList";

const Projects: React.FC = () => {
    return (
        <section id="projects" className="bg-gray-50 dark:bg-gray-800 transition-colors">
            <h1
                className="title-font text-4xl font-bold text-center my-8 text-gray-900 dark:text-gray-100"
            >
                PROJECTS
            </h1>
            <ProjectList />
        </section>
    );
};

export default Projects;