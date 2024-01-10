import React, { useState, useEffect } from "react";
import ProjectItem from "./ProjectItem";
import pswdGeneratorImg from "../images/pswd-generator.webp";
import knowYourGovtImg from "../images/know-your-government.webp";
import dailySchedulerImg from "../images/day-scheduler.webp";
import quizTimeImg from "../images/quiz-time.webp";
import weatherPlanner from "../images/weather-planner.webp";

// Interface for card data object
interface Project {
    name: string,
    summary: string,
    imgSrc: string,
    liveSiteLink: string,
    sourceCodeLink: string,
    techList: string[]
}

// Preload single image
const preLoadImage = (src: string) => {
    return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image at ${src}"));
    });
}

// Preload images to fix browser NS_BINDING_ABORTED error
const preLoadAssets = async () => {
    const imageSources = [
        pswdGeneratorImg,
        knowYourGovtImg,
        dailySchedulerImg,
        quizTimeImg,
        weatherPlanner
    ];

    try {
        await Promise.all(imageSources.map(src => preLoadImage(src)));
    } catch (error) {
        console.error(error);
    }
};

const projects: Project[] = [
    {
        name: "Password Generator",
        summary: "Generate a random password with to meet your criteria",
        imgSrc: pswdGeneratorImg,
        liveSiteLink: "https://BrandonDHaskell.github.io/pswd-generator/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/pswd-generator/",
        techList: ["HTML5", "JavaScript", "CSS"]
    },
    {
        name: "Know Your Government",
        summary: "Get to know your government representation based on your location",
        imgSrc: knowYourGovtImg,
        liveSiteLink: "https://BrandonDHaskell.github.io/know-your-government/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/know-your-government/",
        techList: ["HTML5", "JavaScript", "CSS", "D3.js", "Bulma", "Axios"]
    },
    {
        name: "Daily Scheduler",
        summary: "Enter in your daily schedule for the current day and track your progress",
        imgSrc: dailySchedulerImg,
        liveSiteLink: "https://BrandonDHaskell.github.io/day-scheduler/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/day-scheduler/",
        techList: ["HTML5", "JavaScript", "CSS", "JQuery", "DayJS"]
    },
    {
        name: "Quiz Time",
        summary: "Select a category, take your quiz, and track your scores",
        imgSrc: quizTimeImg,
        liveSiteLink: "https://BrandonDHaskell.github.io/quiz-time/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/quiz-time/",
        techList: ["HTML5", "JavaScript", "CSS", "JQuery"]
    },
    {
        name: "Weather Planner",
        summary: " Enter in a city name and select the country then click search. See the weather all around the world if you want to!",
        imgSrc: weatherPlanner,
        liveSiteLink: "https://BrandonDHaskell.github.io/weather-planner/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/weather-planner/",
        techList: ["HTML5", "JavaScript", "CSS", "JQuery", "DayJS", "APIs"]
    }
]

const ProjectList: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        preLoadAssets().then(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }
    return (
        <div className="project-list flex flex-wrap justify-center m-9">
            {projects.map((project, index) => (
                <ProjectItem key={index} {...project} />
            ))}
        </div>
    );
}

export default ProjectList;