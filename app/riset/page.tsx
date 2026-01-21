"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import Image from "next/image";

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

export default function RisetPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            
            {/* Hero Section - Full Width Image */}
            <section className="pt-20 relative">
                <div className="relative h-[60vh] w-full">
                    <Image
                        src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600"
                        alt="Workshop AiCi"
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority
                    />
                    {/* Overlay with text */}
                    <div className="absolute inset-0 bg-linear-to-r from-primary/80 to-transparent flex items-center">
                        <div className="max-w-7xl mx-auto px-6 w-full">
                            <h1 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-wider">
                                Workshop
                            </h1>
                            <p className="text-xl md:text-2xl text-white/90 mt-4 max-w-2xl">
                                Peningkatan Kompetensi Guru SMK<br />
                                Bidang Artificial Intelligence
                            </p>
                            <p className="text-white/70 mt-4">
                                28 September s.d. Oktober 2020
                            </p>
                            {/* Partner logos */}
                            <div className="flex gap-4 mt-6">
                                <div className="bg-white/20 px-4 py-2 rounded-lg text-white text-sm">
                                    SMK BISA-HEBAT
                                </div>
                                <div className="bg-white/20 px-4 py-2 rounded-lg text-white text-sm">
                                    MIT ●Mitra Industri●
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Research Content Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-primary mb-8 text-center">
                        Riset dan Publikasi
                    </h2>
                    
                    <div className="text-center text-primary/60 py-12">
                        <svg className="w-16 h-16 mx-auto mb-4 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-lg">
                            Halaman riset dan publikasi sedang dalam pengembangan.
                        </p>
                        <p className="mt-2">
                            Konten akan segera ditambahkan.
                        </p>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <MapSection />

            <Footer />
        </main>
    );
}
