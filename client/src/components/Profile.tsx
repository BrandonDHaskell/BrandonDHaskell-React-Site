import React, { useEffect, useRef, useState } from "react";
import profileImg from "../images/Profile_Pic_2_small.webp";

const preLoadImage = (src: string) => {
    return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image at ${src}"));
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
        <section id="profile" className="bg-red-500">
            <div className="container mx-auto px-4">
                <div className="md:columns-2 gap-1">
                    <div className="p-6 basis-1">
                        <img 
                            id="profile-pic"
                            src={profileImg}
                            alt="Profile"
                            className="w-full aspect-square rounded-3xl object-none object-center"
                            style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
                        />
                    </div>
                    <div className="basis-1 flex flex-col justify-items-center text-sm">
                        <p ref={el => { if (el) paragraphsRef.current[0] = el; }} className="py-2">Hi, my name is <span className="text-xl font-extrabold">BrandonDHaskell</span></p>
                        {/* <h1 className="pl-4">BrandonDHaskell</h1> */}
                        <p ref={el => { if (el) paragraphsRef.current[1] = el; }} className="py-2 text-left">I am an aspiring Software Developer with experience in large scale systems and a rich background in Technical Program Management.  I'm driven by a commitment to growth and learning as I journey into the software development world.</p>
                        <p ref={el => { if (el) paragraphsRef.current[2] = el; }} className="py-2">After a meaningful hiatus caring for a family member and relocating to San Francisco, I'm ready to return to my passion for technology. As I re-enter the workforce, I am on the lookout for opportunities where my skills as a fast learner and effective communicator can thrive. I am especially interested in roles that will allow me to contribute as a collaborative team player in Mobile and Web Development.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Profile;