import { ProjectDetailData } from "../components/ProjectDetail";

const projects: ProjectDetailData[] = [
    {
        name: "Portunus",
        summary: "A LAN-first door access system.",
        description:
            "Portunus is a local-network door access system designed for shared spaces such as maker spaces, workshops, and small facilities. It combines ESP32-based access modules, a Go server, and SQLite-backed device and access management to evaluate credentials, control physical entry points, and report device health.\nThe project highlights my work in embedded systems, backend services, API design, secure device-to-server communication, and modular software architecture.",
        sourceCodeLink: "https://github.com/BrandonDHaskell/Portunus",
        techList: ["ESP-IDF", "C++", "CMake", "gRPC", "Go", "SQLite"],
    },
    {
        name: "BrandonDHaskell-React-Site",
        summary: "A personal website built to present projects and professional background.",
        description:
            "BrandonDHaskell-React-Site is my personal website and portfolio application, built to present my technical background, software projects, and ongoing growth as a developer.\nThe site uses a React frontend with a structured component-based design and serves as a central place to share my work, experience, and project documentation. It reflects my approach to software development, application structure, deployment planning, and professional technical communication.",
        sourceCodeLink: "https://github.com/BrandonDHaskell/BrandonDHaskell-React-Site",
        techList: ["React", "TypeScript", "CSS", "Node.js", "Nginx", "Docker"],
    },
];

export default projects;