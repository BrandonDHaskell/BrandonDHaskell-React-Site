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
    /**Tips from Chris Wan:
     * You need to break down the project into more components
     * Example: break the image and text into different components
     */

   
    //  container: Sets the width to a responsive container width with padding.
    //  mx-auto: Margin on the left and right set to auto, centering the container.
    //  md:grid: For medium-sized screens and larger, enables a grid layout.
    //  md:grid-cols-2: For medium-sized screens and larger, sets the grid to have 2 columns.
    //  gap-1: Sets the gap between grid items to a size of 1.
    //  p-6: Sets padding on all sides to a size of 6.
    //  flex-shrink-0: Prevents the flex item from shrinking.
    //  w-full: Sets the width to 100%.
    //  aspect-square: Maintains an aspect ratio of 1:1 (square).
    //  rounded-3xl: Sets rounded corners with a large radius.
    //  object-cover: Scales the image as needed while maintaining its aspect ratio and cropping excess.
    //  object-center: Centers the content of the flex container.
    //  text-xl: Sets the text size to extra-large.
    //  font-extrabold: Sets the font weight to extra bold.
    //  py-2: Sets padding on the y-axis (top and bottom) to a size of 2.
    //  text-left: Aligns the text to the left.

     //  bg-white: Background color set to white.
<section id="profile" className="bg-white">
    <div className="container mx-auto px-4">
        <h1 
            className="text-4xl font-bold text-center py-8" 
            style={{ fontFamily: 'JetBrains Mono, sans-serif' }}
            >Brandon D Haskell</h1>
        {/* Two-column layout for medium-sized screens and larger 
              - md:grid-cols-2: For medium-sized screens and larger, sets the grid to have 2 columns.
              - gap-1: Sets the gap between grid items to a size of 1.

        */}
        <div className="md:grid md:grid-cols-2 gap-1">
            {/* First column with profile picture 
                  - p-6: Sets padding on all sides to a size of 6.
                  - flex-shrink-0: Prevents the flex item from shrinking.
            */}
            <div className="p-6 flex-shrink-0">
                {/* Profile picture */}
                <img 
                    id="profile-pic"
                    src={profileImg}
                    alt="Profile"
                    // Responsive image styling
                    className="w-full aspect-square rounded-3xl object-cover object-center"
                    style={{ maxWidth: "100%", height: "auto", objectFit: "contain" }}
                />
            </div>

            {/* Second column with profile details
                  - flex-shrink-0: Prevents the flex container from shrinking, ensuring it maintains its size.
                  - flex: Establishes a flex container to organize child elements.
                  - flex-col: Sets the flex container to be a column, arranging child elements vertically.
                  - justify-items-center: Aligns the items along the cross-axis (vertical axis in this case) to the center.
                  - text-sm: Sets the text size to small.
            */}
            <div className="flex-shrink-0 flex flex-col justify-items-center text-m pt-8 px-6">
                {/* Introduction */}
                <p ref={el => { if (el) paragraphsRef.current[0] = el; }} className="pb-2">
                    Hi, my name is <span className="text-xl font-extrabold">BrandonDHaskell</span>
                </p>

                {/* Additional details */}
                <p ref={el => { if (el) paragraphsRef.current[1] = el; }} className="py-2 text-left">
                    I am an aspiring Software Developer with experience in large scale systems and a rich background in Technical Program Management at Amazon. 
                    I'm driven by a commitment to growth and learning as I journey into the software development world.
                </p>

                {/* Work history and goals */}
                <p ref={el => { if (el) paragraphsRef.current[2] = el; }} className="py-2">
                    As I re-enter the workforce, I am on the lookout for opportunities where my skills as a fast learner and effective communicator can thrive. 
                    I am especially interested in roles that will allow me to contribute as a collaborative team player in Mobile and Web Development.
                </p>
            </div>
        </div>
    </div>
</section>

    )
}

export default Profile;