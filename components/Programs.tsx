"use client";

import Link from "next/link";
import Image from "next/image";

const Programs = () => {
    const programs = [
        {
            title: "Fun Learning with AI",
            image: "/program-1.png", // Need to use a placeholder or provided images if any
        },
        {
            title: "Extracurricular AI and Robotic Club",
            image: "/program-2.png",
        },
        {
            title: "AI for Education",
            image: "/program-3.png",
        },
    ];

    return (
        <section className="relative py-24 px-6 overflow-hidden bg-white">
            {/* Background Brain Pattern */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `url('/aici-logo-otak.png')`,
                    backgroundSize: '200px',
                    backgroundRepeat: 'repeat',
                }}
            />

            <div className="relative max-w-7xl mx-auto text-center z-10">
                <h2 className="text-4xl font-bold text-primary mb-6">Program Kami</h2>
                <p className="text-primary/70 max-w-3xl mx-auto mb-16 px-4">
                    Lembaga yang didirikan atas kerjasama FMIPA Universitas Indonesia dengan UMG IdeaLab Indonesia yang berfokus pada pengembangan sumber daya manusia dalam bidang artificial intelligence (kecerdasan artifisial).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {programs.map((program, index) => (
                        <div key={index} className="group cursor-pointer">
                            <div className="relative aspect-4/3 rounded-3xl overflow-hidden shadow-lg mb-6 transition-transform group-hover:scale-105">
                                {/* Placeholder Image */}
                                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                    <p className="text-primary/40 font-bold uppercase tracking-widest">{program.title}</p>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-primary px-4">
                                {program.title}
                            </h3>
                        </div>
                    ))}
                </div>

                <Link
                    href="/programs"
                    className="text-primary font-bold border-b-2 border-primary hover:text-secondary hover:border-secondary transition-colors inline-block"
                >
                    Jelajahi Program
                </Link>
            </div>
        </section>
    );
};

export default Programs;
