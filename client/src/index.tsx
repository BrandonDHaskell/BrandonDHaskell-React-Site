import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("No root element found!");

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App 
            message=""
        />
    </React.StrictMode>
);