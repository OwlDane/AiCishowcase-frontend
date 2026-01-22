"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import Image from "next/image";
import Link from "next/link";
import { researchItems } from "@/data/research";
import { type ResearchItem } from "@/data/research";

/**
 * Riset Page
 * 
 * Halaman untuk menampilkan riset dan workshop AiCi.
 * Berdasarkan design reference: hero dengan gambar workshop.
 * 
 * PANDUAN:
 * - Ini adalah placeholder page
 * - Nanti bisa ditambahkan list riset/publikasi dari API
 */

const typeIcons = {
    workshop: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
    ),
    paper: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    conference: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
};

export default function RisetPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            
            {/* Hero Section - Full Width Image */}
            <section className="pt-32 relative">
                <div className="relative h-[60vh] w-full">
                    <Image
                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600"
                        alt="Workshop AiCi"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                    {/* Wave Decoration */}
                    <div className="absolute top-0 left-0 right-0 z-10">
                        <svg viewBox="0 0 1440 320" className="w-full h-auto opacity-30 transform -scale-y-100">
                            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                        </svg>
                    </div>
                    {/* Overlay with text */}
                    <div className="absolute inset-0 bg-linear-to-r from-primary/90 to-primary/40 flex items-center z-20">
                        <div className="max-w-7xl mx-auto px-6 w-full">
                            <h1 className="text-4xl md:text-6xl font-bold text-white uppercase tracking-wider mb-4">
                                Workshop
                            </h1>
                            <p className="text-xl md:text-3xl text-white font-semibold mt-4 max-w-2xl leading-tight">
                                Peningkatan Kompetensi Guru SMK<br />
                                Bidang Artificial Intelligence
                            </p>
                            <p className="text-white/90 mt-6 text-lg">
                                28 September s.d. Oktober 2020
                            </p>
                            {/* Partner logos */}
                            <div className="flex flex-wrap gap-4 mt-8">
                                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold border border-white/30">
                                    SMK BISA-HEBAT
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-semibold border border-white/30">
                                    MIT ● Mitra Industri ●
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Research Content Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-primary mb-4">
                            Riset dan Publikasi
                        </h2>
                        <p className="text-primary/70 max-w-2xl mx-auto">
                            Dokumentasi riset, workshop, dan publikasi ilmiah yang telah dilakukan oleh tim AiCi dalam mengembangkan pendidikan AI di Indonesia.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {researchItems.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-100 flex flex-col"
                            >
                                {/* Type Icon & Date */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3 text-primary">
                                        {typeIcons[item.type as keyof typeof typeIcons]}
                                        <span className="text-sm font-semibold uppercase tracking-wider">
                                            {item.type}
                                        </span>
                                    </div>
                                    <span className="text-sm text-primary/60">{item.date}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-primary mb-3 leading-tight">
                                    {item.title}
                                </h3>

                                {/* Authors */}
                                <p className="text-sm text-primary/70 mb-4 italic">
                                    {item.authors}
                                </p>

                                {/* Abstract */}
                                <p className="text-primary/80 leading-relaxed mb-6 text-sm grow">
                                    {item.abstract}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {item.tags.map((tag, tagIndex) => (
                                        <span
                                            key={tagIndex}
                                            className="px-3 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Read More Link */}
                                <div className="mt-auto">
                                    <Link 
                                        href={`/riset/${item.slug}`}
                                        className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-secondary transition-colors"
                                    >
                                        Baca Selengkapnya
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
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
