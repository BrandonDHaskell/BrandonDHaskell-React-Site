import React, { Component } from "react";
import Profile from "./Profile";
import profilePic from "../images/Profile_Pic_2_small.jpg";

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
                <h1>{this.props.message}</h1>
                <Profile
                    imageSrc={profilePic}
                    blurb="A little bit about me!"
                />
            </div>
        )
    }
}

export default App;