"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import MapSection from "@/components/MapSection";

/**
 * Profil Page
 * 
 * Struktur sesuai design reference:
 * 1. Hero dengan foto dan judul
 * 2. Tentang AiCi
 * 3. Visi & Misi
 * 4. Tim Operasional dan Tutor
 * 5. Map
 */

const teamMembers = [
    {
        name: "Rika Dewantari, S.Pd.",
        position: "Tim Operasional",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300",
    },
    {
        name: "Fahrizal Surya Permana, M.Si.",
        position: "Tutor",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
    },
    {
        name: "Febri Alifi Rifai, S.Si.",
        position: "Tutor",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
    },
];

export default function ProfilPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-primary relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Text */}
                        <div className="lg:w-1/2">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                Artificial<br />
                                Intelligence<br />
                                Center Indonesia
                            </h1>
                            <p className="text-white/70 mt-6 max-w-lg">
                                Lembaga yang didirikan atas kerjasama FMIPA Universitas Indonesia dengan UMG IdeaLab Indonesia yang berfokus pada pengembangan sumber daya manusia dalam bidang artificial intelligence (kecerdasan artifisial).
                            </p>
                        </div>
                        
                        {/* Images */}
                        <div className="lg:w-1/2 flex gap-4">
                            <div className="relative w-1/2 aspect-3/4 rounded-2xl overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=400"
                                    alt="AiCi Activity 1"
                                    fill
                                    className="object-cover"
                                    sizes="25vw"
                                />
                            </div>
                            <div className="relative w-1/2 aspect-3/4 rounded-2xl overflow-hidden mt-8">
                                <Image
                                    src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=400"
                                    alt="AiCi Activity 2"
                                    fill
                                    className="object-cover"
                                    sizes="25vw"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Wave decoration */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                        <path d="M0 60L1440 60L1440 30C1200 50 960 10 720 30C480 50 240 10 0 30L0 60Z" fill="white"/>
                    </svg>
                </div>
            </section>

            {/* About Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="bg-primary/5 p-8 rounded-2xl">
                            <p className="text-primary/80 leading-relaxed">
                                Sebuah Lembaga Yang Diberi Nama Atas Kerjasama FMIPA UI dengan Direktorat Jenderal SMK Dikdasmen LPMP dan Industri Indonesia Untuk Mengembangkan Sumber Daya Manusia Dalam Bidang Artificial Intelligence. Cita-cita Bangsa Untuk Menginspirasi Seluruh Indonesia Melalui AI.
                            </p>
                        </div>
                        <div>
                            {/* Visi */}
                            <div className="mb-8">
                                <h3 className="text-secondary font-bold text-sm uppercase tracking-wider mb-3">VISI</h3>
                                <p className="text-primary/70">
                                    Menjadi Pusat Pembelajaran, Inovasi, dan Konsultasi Bidang Artificial Intelligence (Kecerdasan Buatan) Yang Terkemuka Di Indonesia. Untuk Membangun Sumber Daya Manusia Yang Berkualitas Dan Unggul Di Dalam Bidang Artificial Intelligence.
                                </p>
                            </div>
                            
                            {/* Misi */}
                            <div>
                                <h3 className="text-secondary font-bold text-sm uppercase tracking-wider mb-3">MISI</h3>
                                <ul className="text-primary/70 space-y-2">
                                    <li className="flex gap-2">
                                        <span className="text-secondary">•</span>
                                        <span>Melaksanakan pendidikan bidang artificial intelligence yang berkualitas dan inovatif untuk target yang lebih tinggi.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-secondary">•</span>
                                        <span>Mengembangkan riset dan inovasi dalam bidang artificial intelligence yang bermanfaat bagi pembangunan nasional.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-secondary">•</span>
                                        <span>Melaksanakan kerjasama untuk pengembangan bidang artificial intelligence di Indonesia.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-secondary">•</span>
                                        <span>Menyediakan Sumber Daya dalam bidang yang siap dan berkompeten dalam bidang terkait karir/lapangan.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-primary text-center mb-12">
                        Tim Operasional dan Tutor
                    </h2>
                    
                    <div className="flex flex-wrap justify-center gap-12">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="text-center">
                                <div className="relative w-48 h-48 rounded-full overflow-hidden mx-auto mb-4 shadow-lg">
                                    <Image
                                        src={member.photo}
                                        alt={member.name}
                                        fill
                                        className="object-cover"
                                        sizes="192px"
                                    />
                                </div>
                                <h3 className="font-bold text-primary">{member.name}</h3>
                                <p className="text-primary/50 text-sm">{member.position}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <MapSection />

            <Footer />
        </main>
    );
}
