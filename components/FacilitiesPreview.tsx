"use client";

import Image from "next/image";
import Link from "next/link";

/**
 * FacilitiesPreview Component
 * 
 * Menampilkan preview 4 kategori fasilitas dari halaman Fasilitas:
 * - Ruangan
 * - Modul
 * - Media Kit
 * - Robot
 * 
 * PANDUAN:
 * - Data ini nanti bisa di-fetch dari API /content/facilities/
 * - Untuk sekarang menggunakan data static
 */

const facilities = [
    {
        category: "Ruangan",
        title: "Nyaman dalam Lingkungan Universitas Indonesia",
        description: "Fasilitas ruangan yang nyaman dan kondusif untuk pembelajaran AI.",
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=600",
    },
    {
        category: "Modul",
        title: "Berlandaskan STEAM",
        description: "Modul pembelajaran yang komprehensif berbasis STEAM education.",
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=600",
    },
    {
        category: "Media Kit",
        title: "Tersedia Lengkap",
        description: "Peralatan dan media pembelajaran yang lengkap untuk praktik.",
        image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=600",
    },
    {
        category: "Robot",
        title: "Pengalaman Belajar dengan Robot AI",
        description: "Belajar langsung dengan berbagai jenis robot yang dilengkapi AI.",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600",
    },
];

const FacilitiesPreview = () => {
    return (
        <section className="py-24 bg-[#0B6282] text-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    {/* Left Column: Text */}
                    <div className="lg:w-1/2">
                        <h2 className="text-6xl md:text-6xl font-semibold font-primary leading-tight mb-6">
                            Fasilitas yang<br />
                            disediakan
                        </h2>
                        
                        <p className="text-base md:text-lg text-white/90 leading-relaxed mb-10 max-w-xl">
                            Untuk Mendukung Kegiatan Di AiCI, Tersedia Fasilitas-Fasilitas Berupa Ruangan, Lab AI Sebanyak 6 Ruang, Media Pembelajaran/ Pelatihan Berupa Kit Dan Robot, Modul Pembelajaran Tingkat SD/MI, SMP/MTs Dan SMA/MA/SMK Serta Perguruan Tinggi.
                        </p>

                        <Link
                            href="/fasilitas"
                            className="inline-block bg-[#f03023] text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#d42a1e] transition-all shadow-xl"
                        >
                            SELENGKAPNYA
                        </Link>
                    </div>

                    {/* Right Column: Featured Image */}
                    <div className="lg:w-1/2 w-full flex justify-end">
                        <div className="relative w-full max-w-[500px] aspect-square p-3 bg-white/20 backdrop-blur-sm rounded-[3rem] border-10 border-white shadow-2xl overflow-hidden transform rotate-2">
                            <div className="relative w-full h-full rounded-[2.2rem] overflow-hidden bg-white">
                                <Image
                                    src="https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=800"
                                    alt="AiCi Facilities Module"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 500px"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FacilitiesPreview;
