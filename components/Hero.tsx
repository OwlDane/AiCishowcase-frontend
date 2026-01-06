"use client";

import Link from "next/link";
import Image from "next/image";

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 px-6 md:px-20 bg-primary text-white overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
                {/* Left Content */}
                <div className="flex-1 space-y-8">
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                        Artificial <br />
                        Intelligence <br />
                        Center Indonesia
                    </h1>
                    <p className="text-lg opacity-90 max-w-lg">
                        Lembaga yang didirikan atas kerjasama FMIPA Universitas Indonesia dengan UMG IdeaLab Indonesia yang berfokus pada pengembangan sumber daya manusia dalam bidang artificial intelligence (kecerdasan artifisial).
                    </p>
                    <Link
                        href="/achievements"
                        className="inline-block bg-secondary text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                    >
                        Jelajahi Pencapaian
                    </Link>
                </div>

                {/* Right Card / Slider */}
                <div className="flex-1 relative">
                    <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-2xl">
                        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-200 mb-6">
                            {/* Placeholder for image */}
                            <div className="absolute inset-0 flex items-center justify-center text-primary/50">
                                <span className="text-sm">Featured Project Image</span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Grand Champion AI Innovation Cup</h3>
                            <p className="text-sm opacity-80">
                                Jajang sujang Meraih Penghargaan Utama atas keunggulan dalam merancang solusi AI yang orisinal dan aplikatif.
                            </p>
                        </div>
                    </div>

                    {/* Slider Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        <div className="w-8 h-2 bg-white rounded-full"></div>
                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                        <div className="w-2 h-2 bg-white/40 rounded-full"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
