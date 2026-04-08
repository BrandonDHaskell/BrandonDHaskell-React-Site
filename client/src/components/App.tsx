import React, { Component } from "react";
import Profile from "./Profile";
import Projects from "./Projects";
import Contact from "./Contact";

interface AppProps {
    message: string
}

interface AppState {
    rendered: boolean
}

class App extends Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = {
            rendered: false
        }
    }

    render() {
        return (
            <div className="App">
                <Profile />
                <Projects />
                <Contact />
            </div>
        )
    }
}

export default App;