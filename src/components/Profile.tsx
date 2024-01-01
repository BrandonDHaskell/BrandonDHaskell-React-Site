import React, { Component } from "react";

interface ProfileProps {
    imageSrc: string,
    blurb: string
}

const Profile: React.FC<ProfileProps> = ({ imageSrc, blurb }) => {
    return (
        <div>
            <img src={imageSrc} alt="Profile" />
            <p>{blurb}</p>
        </div>
    )
}

export default Profile;