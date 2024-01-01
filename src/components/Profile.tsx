import React, { Component } from "react";

interface ProfileProps {
    imageSrc: string,
    blurb: string
}

const Profile: React.FC<ProfileProps> = ({ imageSrc, blurb }) => {
    return (
        <div>
            <img 
                id="profile-pic"
                src={imageSrc}
                alt="Profile"
                className="px-6"
                style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
            />
            <p>{blurb}</p>
        </div>
    )
}

export default Profile;