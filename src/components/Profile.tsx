import React, { Component } from "react";

interface ProfileProps {
    imageSrc: string,
    blurb: string
}

const Profile: React.FC<ProfileProps> = ({ imageSrc, blurb }) => {
    return (
        <section id="profile" className="grid grid-cols-2 gap-4 content-center">
            <div className="grid justify-items-end content-center gap-4 px-6">
                <p className="pl-2">Hi, my name is</p>
                <h1 className="pl-2">BrandonDHaskell</h1>
                <p className="pl-2 text-right">{blurb}</p>
            </div>
            <div>
                <img 
                    id="profile-pic"
                    src={imageSrc}
                    alt="Profile"
                    className="px-6"
                    style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
                />
            </div>
        </section>
    )
}

export default Profile;