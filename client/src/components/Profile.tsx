import React, { useEffect, useRef, useState } from "react";
import profileImg from "../images/Profile_Pic_2_small.webp";

const preLoadImage = (src: string) => {
    return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to load image at ${src}`));
    });
};

const Profile: React.FC = () => {
    const paragraphsRef = useRef<HTMLParagraphElement[]>([]);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        preLoadImage(profileImg)
            .then(() => {
                setImageLoaded(true);
                paragraphsRef.current.forEach((p, index) => {
                    setTimeout(() => {
                        p?.classList.add("slide-in");
                    }, 250 * index);
                });
            })
            .catch(error => console.error(error));
    }, []);

    return (
        <section id="profile" className="bg-white dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-4">
                <h1
                    className="text-4xl font-bold text-center py-8 text-gray-900 dark:text-gray-100"
                    style={{ fontFamily: 'JetBrains Mono, sans-serif' }}
                >
                    Brandon Haskell
                </h1>
                <div className="md:grid md:grid-cols-2 gap-1">
                    <div className="p-6 flex-shrink-0">
                        <img
                            id="profile-pic"
                            src={profileImg}
                            alt="Profile"
                            className="w-full aspect-square rounded-3xl object-cover object-center"
                            style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
                        />
                    </div>
                    <div className="flex-shrink-0 flex flex-col justify-items-center text-xl pt-8 px-6 text-gray-800 dark:text-gray-200">
                        <p ref={el => { if (el) paragraphsRef.current[0] = el; }} className="pb-2">
                            Hi, I'm <span className="text-xl font-extrabold">Brandon Haskell</span>
                        </p>
                        <p ref={el => { if (el) paragraphsRef.current[1] = el; }} className="py-2 text-left">
                            I’m a technical systems and operations professional with 10+ years of experience at Amazon, including work in system administration, global support-routing configuration, data analysis, security and compliance coordination, user acceptance testing, and large-scale operational rollouts.
                        </p>
                        <p ref={el => { if (el) paragraphsRef.current[2] = el; }} className="py-2">
                            I’ve worked across engineering, product, operations, legal, compliance, training, and data teams to launch, improve, and scale business-critical systems. Today, I’m focused on opportunities in automation, internal tools, business systems, technical solutions, and implementation, where I can combine technical breadth, structured problem-solving, and hands-on software development.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;