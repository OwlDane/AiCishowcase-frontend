"use client";

import Link from "next/link";

/**
 * ProgramsPreview Component
 * 
 * Menampilkan 6 program AiCi dalam bentuk cards dengan icons.
 * Setiap card memiliki: icon, judul, deskripsi singkat
 * 
 * Ini adalah PANDUAN untuk kamu jika ingin modifikasi:
 * - Ganti icons dengan SVG custom jika diperlukan
 * - Ubah warna background card sesuai kebutuhan
 * - Tambah/kurangi items di array `programs`
 */

// This comment is added to trigger a re-render if the file is being watched by a development server.
const programs = [
    {
        title: "Fun Learning With AI Untuk Siswa SD/MI, SMP/MTs Dan SMA/MA/SMK",
        description: "Kegiatan belajar yang diselenggarakan oleh AiCi bertujuan untuk memperkenalkan dan meningkatkan pengetahuan serta keterampilan peserta didik dalam bidang Artificial Intelligence ...",
    },
    {
        title: "AI For Education",
        description: "Kegiatan pelatihan implementasi AI dalam bidang pendidikan untuk Guru dan Dosen. Bertujuan untuk meningkatkan pengetahuan, keterampilan, serta melatih kemampuan guru dan dosen dalam mengembangkan pembelajaran artificial intelligence ...",
    },
    {
        title: "AI Day",
        description: "AI Day merupakan sebuah kegiatan yang dilaksanakan selama satu hari dengan tujuan untuk menumbuhkan minat, pengetahuan, dan keterampilan peserta didik dalam bidang artificial intelligence dengan cara yang menyenangkan (fun learning) ...",
    },
    {
        title: "AI Edu Fair",
        description: "Sebuah kegiatan yang dilaksanakan selama satu hari dengan tujuan untuk menumbuhkan rasa ingin tahu, pengetahuan, dan keterampilan peserta didik dalam bidang artificial intelligence. Selain itu, pada kegiatan ini dikembangkan juga beberapa soft skills ...",
    },
    {
        title: "Preparing Artificial Intelligence (AI) Talents",
        description: "Merupakan program PT Artifisial Intelegensia Indonesia (AiCi) bekerjasama dengan Departemen Fisika FMIPA UI dan beberapa praktisi dalam lingkungan kerja start-up dan industri dalam bentuk Studi Independen Bersertifikat Kampus Merdeka ...",
    },
];

const ProgramsPreview = () => {
    /* Updated styling for cards */
    return (
        <section className="py-20 bg-[#eef2f5]">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {programs.map((program, index) => (
                        <div
                            key={index}
                            className="bg-[#0B6282] text-white p-8 rounded-[2rem] shadow-xl hover:shadow-2xl transition-all duration-300 group"
                        >
                            {/* Vertical Bar Icon */}
                            <div className="flex gap-1 mb-4">
                                <div className="w-1.5 h-6 bg-[#f03023] rounded-full" />
                                <div className="w-1.5 h-6 bg-yellow-400 rounded-full mt-1.5" />
                                <div className="w-1.5 h-6 bg-white rounded-full mt-3" />
                            </div>
                            
                            <h3 className="text-lg font-semibold mb-4 min-h-10 leading-tight">
                                {program.title}
                            </h3>
                            <p className="text-white/80 text-[13px] leading-relaxed line-clamp-6">
                                {program.description}
                            </p>
                        </div>
                    ))}

                    {/* Button Card (Slot 6) */}
                    <div className="flex items-center justify-center p-6">
                        <Link
                            href="/program"
                            className="bg-[#f03023] text-white px-10 py-5 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-[#d42a1e] transition-all shadow-xl text-center w-full max-w-[280px]"
                        >
                            DETAIL PROGRAM
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProgramsPreview;
