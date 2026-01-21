"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import Image from "next/image";

/**
 * Galeri Page
 * 
 * Menampilkan foto-foto kegiatan AiCi dalam bentuk grid.
 * Data akan diambil dari API /content/gallery/ nanti.
 * 
 * PANDUAN untuk kamu jika ingin modifikasi:
 * - Ganti dummy images dengan data dari API
 * - Tambahkan filter berdasarkan kategori jika diperlukan
 * - Tambahkan lightbox/modal untuk preview foto
 */

// Placeholder gallery images
const galleryImages = [
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600", alt: "Kegiatan 1" },
    { src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600", alt: "Kegiatan 2" },
    { src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600", alt: "Kegiatan 3" },
    { src: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=600", alt: "Kegiatan 4" },
    { src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600", alt: "Kegiatan 5" },
    { src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=600", alt: "Kegiatan 6" },
    { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600", alt: "Kegiatan 7" },
    { src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600", alt: "Kegiatan 8" },
    { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600", alt: "Kegiatan 9" },
];

export default function GaleriPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            
            {/* Hero Section */}
            <section className="pt-24 pb-12 bg-primary">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Galeri Kegiatan
                    </h1>
                    <p className="text-white/70 max-w-2xl mx-auto">
                        Dokumentasi berbagai kegiatan pembelajaran AI dan Robotika yang telah dilaksanakan oleh AiCi.
                    </p>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {galleryImages.map((image, index) => (
                            <div
                                key={index}
                                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-primary/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Load More Button */}
                    <div className="text-center mt-12">
                        <button className="px-8 py-3 border-2 border-primary text-primary rounded-full font-bold hover:bg-primary hover:text-white transition-all">
                            Lihat Lebih Banyak
                        </button>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <MapSection />

            <Footer />
        </main>
    );
}
