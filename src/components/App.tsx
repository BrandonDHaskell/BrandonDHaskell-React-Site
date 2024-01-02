import React, { Component } from "react";
import Profile from "./Profile";
import profilePic from "../images/Profile_Pic_2_small.jpg";
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
                <Profile
                    imageSrc={profilePic}
                    blurb="A little bit about me!"
                />
                <Projects />
            </div>
        )
    }
}

export default App;