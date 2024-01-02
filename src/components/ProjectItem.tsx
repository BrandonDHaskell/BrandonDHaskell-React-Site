import React from "react";

interface ProjectItemProps {
    name: string,
    summary: string,
    imgSrc: string,
    liveSiteLink: string,
    sourceCodeLink: string,
    techList: string[]
}

const ProjectItem: React.FC<ProjectItemProps> = ({
    name,
    summary,
    imgSrc,
    liveSiteLink,
    sourceCodeLink,
    techList
}) => {
    return (
        <div className="project-card rounded p-8 m-6 max-w-xs rign-2 ring-offset-2 ring-stone-900 shadow-2xl shadow-gray-400/75 hover:shadow-sky-500">
            <a href={liveSiteLink}>
                <div className="project-info rounded">
                    <h3 className="project-title">{name}</h3>
                    <p className="project-desc text-sm italic  pb-5">{summary}</p>
                    <img className="rounded boarder-2 border-stone-900" src={imgSrc} alt={name} />
                    <div className="flex flex-wrap justify-center py-1">
                        {techList.map((tech, index) => (
                            <div><span className="box-decoration-clone bg-gradient-to-r from-yellow-600 to-sky-700 px-2 mx-2 rounded-lg">{tech}</span></div>
                        ))}
                    </div>
                </div>
            </a>
            <div className="flex justify-center text-skyl-400 py-3">
                <a href={sourceCodeLink}>Source code</a>
            </div>
        </div>
    )
}