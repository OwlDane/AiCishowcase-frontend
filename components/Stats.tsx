"use client";

import { useState, useEffect, useRef } from "react";

const AnimatedNumber = ({ value }: { value: string }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const targetValue = parseInt(value);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (hasAnimated.current) return;
        
        let start = 0;
        const duration = 2000; // 2 seconds
        const increment = targetValue / (duration / 16); // 60fps

        const animate = () => {
            start += increment;
            if (start < targetValue) {
                setDisplayValue(Math.floor(start));
                requestAnimationFrame(animate);
            } else {
                setDisplayValue(targetValue);
                hasAnimated.current = true;
            }
        };

        animate();
    }, [targetValue]);

    return <span>{displayValue}</span>;
};

const Stats = () => {
    const stats = [
        { label: "Course Participant", value: "500+" },
        { label: "International Achievement", value: "20+" },
        { label: "Sponsorship", value: "10+" },
    ];

    return (
        /* Mengubah padding agar lebih lebar ke bawah (pb-32 dan md:pb-60) */
        <section className="pt-20 pb-32 md:pt-32 md:pb-60 bg-white">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                {stats.map((stat, index) => (
                    <div key={index} className="space-y-4 group transition-transform hover:scale-105">
                        <h2 className="text-5xl md:text-7xl font-bold text-primary tracking-tight">
                            <AnimatedNumber value={stat.value} />
                            <span>+</span>
                        </h2>
                        <p className="text-lg md:text-2xl text-primary/70 font-medium max-w-[200px] mx-auto leading-relaxed">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Stats;
