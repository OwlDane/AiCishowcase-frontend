"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import Image from "next/image";
import { useState } from "react";

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
    { src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600", alt: "Kegiatan 1", description: "Event learning AI di Ruang Perkuliahan AiCi tanggal 27 September 2021" },
    { src: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600", alt: "Kegiatan 2", description: "Workshop Robotika dengan peserta dari berbagai sekolah" },
    { src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600", alt: "Kegiatan 3", description: "Praktik langsung programming robot AI" },
    { src: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=600", alt: "Kegiatan 4", description: "Sesi diskusi dan tanya jawab dengan mentor" },
    { src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=600", alt: "Kegiatan 5", description: "Kompetisi robotika antar peserta" },
    { src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=600", alt: "Kegiatan 6", description: "Presentasi project akhir peserta" },
    { src: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600", alt: "Kegiatan 7", description: "Kunjungan industri ke lab AI" },
    { src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600", alt: "Kegiatan 8", description: "Sertifikasi peserta program AI" },
];

export default function GaleriPage() {
    const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);
    return (
        <main className="min-h-screen">
            <Navbar />
            
            {/* Hero Section */}
            <section className="pt-32 pb-24 bg-primary relative overflow-hidden">
                {/* Top Wave Decoration */}
                <div className="absolute top-0 left-0 right-0 z-0">
                    <svg viewBox="0 0 1440 320" className="w-full h-auto opacity-20 transform -scale-y-100">
                        <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Image Left */}
                        <div className="lg:w-1/2">
                            <div className="relative aspect-video lg:aspect-4/3 rounded-2xl overflow-hidden shadow-xl border-4 border-white/10">
                                <Image
                                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800"
                                    alt="Galeri AiCi"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>

                        {/* Text Right */}
                        <div className="lg:w-1/2 text-left">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                                Galeri
                            </h1>
                            <p className="text-white/80 text-sm md:text-base leading-relaxed">
                                Dokumentasi Berbagai Kegiatan Yang Pernah Dilakukan di AiCi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {galleryImages.map((image, index) => (
                            <div
                                key={index}
                                className="group cursor-pointer"
                                onClick={() => setSelectedImage(image)}
                            >
                                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                    {/* Title Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-4">
                                        <h3 className="text-white font-bold text-sm md:text-base">
                                            {image.alt}
                                        </h3>
                                    </div>
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

            {/* Modal Popup */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div 
                        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative aspect-video">
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                fill
                                className="object-cover"
                                sizes="90vw"
                            />
                        </div>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-primary mb-3">
                                {selectedImage.alt}
                            </h2>
                            <p className="text-primary/70 leading-relaxed">
                                {selectedImage.description}
                            </p>
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-all"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Map Section */}
            <MapSection />

            <Footer />
        </main>
    );
}
