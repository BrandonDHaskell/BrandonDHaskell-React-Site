import React, { Component } from "react";
import ProjectList from "./ProjectList";

interface ProjectProps {

}

const Projects: React.FC<ProjectProps> = () => {
    return (
        <section id="projects">
            <h1 
            className="text-4xl font-bold text-center my-8" 
            style={{ fontFamily: 'JetBrains Mono, sans-serif' }}
            >PROJECTS</h1>
            {/* <h2 className="mb-8 mt-8 text-4xl font-bold md:txt-5xl lg:text-6xl text-sky-500">Projects</h2>*/}
            <ProjectList />
        </section>
    )
}

export default Projects;