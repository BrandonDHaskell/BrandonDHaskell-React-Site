import React, { Component } from "react";

const Profile: React.FC = () => {
    return (
        <section id="profile" className="grid grid-cols-2 gap-4 content-center">
            <div className="grid justify-items-end content-center gap-4 px-6">
                <p className="pl-2">Hi, my name is</p>
                <h1 className="pl-2">BrandonDHaskell</h1>
                <p className="pl-2 text-right">A little bit about me</p>
            </div>
            <div>
                <img 
                    id="profile-pic"
                    src="images/Profile_Pic_2_small.jpg"
                    alt="Profile"
                    className="rounded-3xl"
                    style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
                />
            </div>
        </section>
    )
}

export default Profile;