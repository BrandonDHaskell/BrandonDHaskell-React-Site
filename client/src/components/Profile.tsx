import React, { useEffect, useRef, useState } from "react";
import HeroCopy from "./hero/Hero";
import HeroVisual from "./hero/HeroVisual";

/** Number of stagger steps in HeroCopy (eyebrow, headline, paragraph, role, CTAs, chips) */
const STAGGER_COUNT = 6;
const STAGGER_DELAY_MS = 120;

const Profile: React.FC = () => {
    const [visible, setVisible] = useState<boolean[]>(
        Array(STAGGER_COUNT).fill(false)
    );
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        let cancelled = false;

        // Short initial delay so the layout paints before animation starts
        const kickoff = setTimeout(() => {
            if (cancelled) return;

            for (let i = 0; i < STAGGER_COUNT; i++) {
                const id = setTimeout(() => {
                    if (cancelled) return;
                    setVisible((prev) => {
                        const next = [...prev];
                        next[i] = true;
                        return next;
                    });
                }, STAGGER_DELAY_MS * i);
                timersRef.current.push(id);
            }
        }, 100);

        timersRef.current.push(kickoff);

        return () => {
            cancelled = true;
            timersRef.current.forEach(clearTimeout);
            timersRef.current = [];
        };
    }, []);

    return (
        <section
            id="profile"
            className="relative bg-white dark:bg-gray-900 transition-colors overflow-hidden"
        >
            {/* Subtle background radial glow */}
            <div
                className="pointer-events-none absolute inset-0
                           bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(14,165,233,0.06),transparent)]
                           dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(14,165,233,0.08),transparent)]"
                aria-hidden="true"
            />

            <div className="relative container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                    {/* Left — copy, CTAs, chips */}
                    <HeroCopy visible={visible} />

                    {/* Right — visual panel */}
                    <div className="order-last">
                        <HeroVisual />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Profile;