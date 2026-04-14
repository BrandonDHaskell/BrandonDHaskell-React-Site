import React, { useEffect, useRef, useState } from "react";
import profileImg from "../images/Profile_Pic_2_small.webp";
import { preLoadImage } from "../utils/imagePreload";

const PARAGRAPH_COUNT = 3;
const STAGGER_DELAY_MS = 250;

const Profile: React.FC = () => {
    const [visibleParagraphs, setVisibleParagraphs] = useState<boolean[]>(
        Array(PARAGRAPH_COUNT).fill(false)
    );

    // Track pending timeouts so they can be cancelled if the component unmounts
    // mid-animation (e.g. during navigation or fast refresh in development).
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        let cancelled = false;

        preLoadImage(profileImg)
            .then(() => {
                if (cancelled) return;

                // Stagger paragraph reveals through state, not DOM manipulation
                for (let i = 0; i < PARAGRAPH_COUNT; i++) {
                    const id = setTimeout(() => {
                        setVisibleParagraphs((prev) => {
                            const next = [...prev];
                            next[i] = true;
                            return next;
                        });
                    }, STAGGER_DELAY_MS * i);
                    timersRef.current.push(id);
                }
            })
            .catch((error) => console.error(error));

        return () => {
            cancelled = true;
            timersRef.current.forEach(clearTimeout);
            timersRef.current = [];
        };
    }, []);

    const slideClass = (index: number): string =>
        visibleParagraphs[index]
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0";

    return (
        <section id="profile" className="bg-white dark:bg-gray-900 transition-colors">
            <div className="container mx-auto px-4">
                <h1 className="title-font text-4xl font-bold text-center py-8 text-gray-900 dark:text-gray-100">
                    Brandon Haskell
                </h1>
                <div className="md:grid md:grid-cols-2 gap-1">
                    <div className="p-6 flex-shrink-0">
                        <img
                            src={profileImg}
                            alt="Profile photo of Brandon Haskell"
                            className="w-full aspect-square rounded-3xl object-contain max-w-full h-auto"
                        />
                    </div>
                    <div className="flex-shrink-0 flex flex-col justify-items-center text-xl pt-8 px-6 text-gray-800 dark:text-gray-200">
                        <p className={`pb-2 transition-all duration-700 ease-out ${slideClass(0)}`}>
                            Hi, I'm <span className="text-xl font-extrabold">Brandon Haskell</span>
                        </p>
                        <p className={`py-2 text-left transition-all duration-700 ease-out ${slideClass(1)}`}>
                            I'm a technical systems and operations professional with 10+ years of experience at Amazon, including work in system administration, global support-routing configuration, data analysis, security and compliance coordination, user acceptance testing, and large-scale operational rollouts.
                        </p>
                        <p className={`py-2 transition-all duration-700 ease-out ${slideClass(2)}`}>
                            I've worked across engineering, product, operations, legal, compliance, training, and data teams to launch, improve, and scale business-critical systems. Today, I'm focused on opportunities in automation, internal tools, business systems, technical solutions, and implementation, where I can combine technical breadth, structured problem-solving, and hands-on software development.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;