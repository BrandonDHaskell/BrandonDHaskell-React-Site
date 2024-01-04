import React from "react";
import ProjectItem from "./ProjectItem";

interface Project {
    name: string,
    summary: string,
    imgSrc: string,
    liveSiteLink: string,
    sourceCodeLink: string,
    techList: string[]
}

const projects: Project[] = [
    {
        name: "Password Generator",
        summary: "Generate a random password with to meet your criteria",
        imgSrc: "images/pswd-generator.png",
        liveSiteLink: "https://BrandonDHaskell.github.io/pswd-generator/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/pswd-generator/",
        techList: ["HTML5", "JavaScript", "CSS"]
    },
    {
        name: "Know Your Government",
        summary: "Get to know your government representation based on your location",
        imgSrc: "images/know-your-government.png",
        liveSiteLink: "https://BrandonDHaskell.github.io/know-your-government/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/know-your-government/",
        techList: ["HTML5", "JavaScript", "CSS", "D3.js", "Bulma", "Axios"]
    },
    {
        name: "Daily Scheduler",
        summary: "Enter in your daily schedule for the current day and track your progress",
        imgSrc: "images/day-scheduler.png",
        liveSiteLink: "https://BrandonDHaskell.github.io/day-scheduler/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/day-scheduler/",
        techList: ["HTML5", "JavaScript", "CSS", "JQuery", "DayJS"]
    },
    {
        name: "Quiz Time",
        summary: "Select a category, take your quiz, and track your scores",
        imgSrc: "images/quiz-time.png",
        liveSiteLink: "https://BrandonDHaskell.github.io/quiz-time/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/quiz-time/",
        techList: ["HTML5", "JavaScript", "CSS", "JQuery"]
    },
    {
        name: "Weather Planner",
        summary: " Enter in a city name and select the country then click search. See the weather all around the world if you want to!",
        imgSrc: "images/weather-planner.png",
        liveSiteLink: "https://BrandonDHaskell.github.io/weather-planner/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/weather-planner/",
        techList: ["HTML5", "JavaScript", "CSS", "JQuery", "DayJS", "APIs"]
    }
]

const ProjectList: React.FC = () => {
    return (
        <div className="project-list flex flex-wrap justify-center m-9">
            {projects.map((project, index) => (
                <ProjectItem key={index} {...project} />
            ))}
        </div>
    );
}

export default ProjectList;