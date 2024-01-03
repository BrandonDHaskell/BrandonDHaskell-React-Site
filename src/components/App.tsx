import React, { Component } from "react";
import Profile from "./Profile";
import Projects from "./Projects";

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
            </div>
        )
    }
}

export default App;