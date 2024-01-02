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
        <div>
            Project list item.
        </div>
    )
}