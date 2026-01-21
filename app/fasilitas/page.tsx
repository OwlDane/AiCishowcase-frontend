"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

/**
 * Fasilitas Page
 * 
 * Menampilkan 4 kategori fasilitas:
 * 1. Ruangan - Nyaman dalam Lingkungan Universitas Indonesia
 * 2. Modul - Berlandaskan STEAM
 * 3. Media Kit - Tersedia Lengkap
 * 4. Robot - Pengalaman Belajar dengan Robot yang Dilengkapi AI
 * 
 * Layout: alternating image left/right
 */

const facilities = [
    {
        category: "RUANGAN",
        title: "Nyaman dalam Lingkungan Universitas Indonesia",
        description: "Fasilitas ruangan yang nyaman dan kondusif untuk pembelajaran. Terletak di lingkungan kampus Universitas Indonesia yang asri dan mendukung proses belajar mengajar dengan optimal. Ruangan dilengkapi dengan AC, proyektor, papan tulis, dan tempat duduk yang nyaman.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800",
        imagePosition: "left",
    },
    {
        category: "MODUL",
        title: "Berlandaskan STEAM",
        description: "Modul pembelajaran yang komprehensif berbasis STEAM (Science, Technology, Engineering, Arts, Mathematics). Kurikulum dirancang oleh tim ahli dari Universitas Indonesia untuk memastikan peserta didik mendapatkan pemahaman yang mendalam tentang AI dan Robotika.",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800",
        imagePosition: "right",
    },
    {
        category: "MEDIA KIT",
        title: "Tersedia Lengkap",
        description: "Peralatan dan media pembelajaran yang lengkap untuk mendukung praktik langsung. Setiap peserta didik akan mendapatkan akses ke berbagai peralatan dan software yang dibutuhkan untuk belajar coding, programming, dan pengembangan AI.",
        image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=800",
        imagePosition: "left",
    },
    {
        category: "ROBOT",
        title: "Pengalaman Belajar dengan Robot yang Dilengkapi AI",
        description: "Belajar langsung dengan berbagai jenis robot yang dilengkapi dengan teknologi AI terkini. Peserta didik dapat berinteraksi, memprogram, dan mengembangkan robot mereka sendiri dengan bimbingan tutor berpengalaman dari Universitas Indonesia.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800",
        imagePosition: "right",
    },
];

const categoryTabs = ["RUANGAN", "MODUL", "MEDIA KIT", "ROBOT"];

export default function FasilitasPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-primary relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Text */}
                        <div className="lg:w-1/2">
                            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                                Fasilitas yang<br />
                                disediakan
                            </h1>
                            <p className="text-white/70 mt-6 max-w-lg">
                                Berbagai fasilitas yang kami sediakan untuk mendukung pengalaman belajar AI dan Robotika yang optimal, mulai dari ruangan yang nyaman hingga robot-robot canggih.
                            </p>
                            <Link
                                href="#facilities"
                                className="inline-block mt-6 bg-secondary text-white px-6 py-3 rounded-full font-bold hover:opacity-90 transition-all"
                            >
                                SELENGKAPNYA TENTANG FASILITAS
                            </Link>
                        </div>
                        
                        {/* Image */}
                        <div className="lg:w-1/2">
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800"
                                    alt="Robot Facilities"
                                    fill
                                    className="object-cover"
                                    sizes="50vw"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Category Tabs */}
                <div className="max-w-7xl mx-auto px-6 mt-12">
                    <div className="flex flex-wrap gap-4 justify-center">
                        {categoryTabs.map((tab) => (
                            <a
                                key={tab}
                                href={`#${tab.toLowerCase().replace(' ', '-')}`}
                                className="px-6 py-2 rounded-full bg-secondary/20 text-white text-sm font-medium hover:bg-secondary transition-all"
                            >
                                {tab}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Facilities List */}
            <section id="facilities" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    {facilities.map((facility, index) => (
                        <div
                            key={facility.category}
                            id={facility.category.toLowerCase().replace(' ', '-')}
                            className={`flex flex-col ${facility.imagePosition === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 py-16 ${index !== facilities.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            {/* Image */}
                            <div className="lg:w-1/2">
                                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                                    <Image
                                        src={facility.image}
                                        alt={facility.title}
                                        fill
                                        className="object-cover"
                                        sizes="50vw"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="lg:w-1/2 flex flex-col justify-center">
                                <span className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">
                                    {facility.category}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                                    {facility.title}
                                </h2>
                                <p className="text-primary/70 leading-relaxed">
                                    {facility.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
