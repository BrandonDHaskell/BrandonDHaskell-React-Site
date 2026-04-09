import React, { useState, useEffect } from "react";
import ProjectItem from "./ProjectItem";
import pswdGeneratorImg from "../images/pswd-generator.webp";
import knowYourGovtImg from "../images/know-your-government.webp";
import dailySchedulerImg from "../images/day-scheduler.webp";
import quizTimeImg from "../images/quiz-time.webp";
import weatherPlanner from "../images/weather-planner.webp";

interface Project {
    name: string;
    summary: string;
    imgSrc?: string;
    liveSiteLink?: string;
    sourceCodeLink: string;
    techList: string[];
}

const preLoadImage = (src: string) => {
    return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
    });
};

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
        name: "Portunus",
        summary: "Secure authentication and access management solution.",
        sourceCodeLink: "https://github.com/BrandonDHaskell/Portunus",
        techList: ["ESP-IDF", "Go", "SQLite", "gRPC"]
    },
    {
        name: "BrandonDHaskell-React-Site",
        summary: "Personal portfolio built with React and TypeScript.",
        sourceCodeLink: "https://github.com/BrandonDHaskell/BrandonDHaskell-React-Site",
        techList: ["React", "TypeScript", "Tailwind", "Webpack"]
    },
    {
        name: "Know Your Government",
        summary: "Explore government representation by location.",
        imgSrc: knowYourGovtImg,
        liveSiteLink: "https://BrandonDHaskell.github.io/know-your-government/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/know-your-government/",
        techList: ["HTML5", "JavaScript", "D3.js", "Bulma"]
    },
    {
        name: "Password Generator",
        summary: "Generate a random password to meet your criteria.",
        imgSrc: pswdGeneratorImg,
        liveSiteLink: "https://BrandonDHaskell.github.io/pswd-generator/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/pswd-generator/",
        techList: ["HTML5", "JavaScript", "CSS"]
    },
    {
        name: "Daily Scheduler",
        summary: "Track your daily schedule and progress.",
        imgSrc: dailySchedulerImg,
        liveSiteLink: "https://BrandonDHaskell.github.io/day-scheduler/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/day-scheduler/",
        techList: ["HTML5", "JavaScript", "JQuery", "DayJS"]
    },
    {
        name: "Quiz Time",
        summary: "Category-based quizzes with score tracking.",
        imgSrc: quizTimeImg,
        liveSiteLink: "https://BrandonDHaskell.github.io/quiz-time/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/quiz-time/",
        techList: ["HTML5", "JavaScript", "JQuery"]
    },
    {
        name: "Weather Planner",
        summary: "Search weather forecasts for cities worldwide.",
        imgSrc: weatherPlanner,
        liveSiteLink: "https://BrandonDHaskell.github.io/weather-planner/",
        sourceCodeLink: "https://github.com/BrandonDHaskell/weather-planner/",
        techList: ["HTML5", "JavaScript", "DayJS", "APIs"]
    }
];

const ProjectList: React.FC = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        preLoadAssets().then(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>;
    }

    return (
        <div className="project-list flex flex-wrap justify-center m-9 gap-6">
            {projects.map((project, index) => (
                <ProjectItem key={index} {...project} />
            ))}
        </div>
    );
};

export default ProjectList;