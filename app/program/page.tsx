"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";

/**
 * Program Page
 * 
 * Menampilkan 7 program AiCi dengan detail lengkap.
 * Layout: alternating image left/right
 * 
 * Data program sudah disediakan oleh user dengan deskripsi lengkap.
 */

const programs = [
    {
        id: 1,
        title: "Fun Learning with AI untuk Siswa SD/MI, SMP/MTs dan SMA/MA/SMK",
        description: `Kegiatan belajar yang diselenggarakan oleh AiCI bertujuan untuk memperkenalkan dan meningkatkan pengetahuan serta keterampilan peserta didik dalam bidang Artificial Intelligence dengan cara yang menyenangkan sesuai dengan jenjang peserta didik. Selain itu, kegiatan ini juga bertujuan untuk mengembangkan keterampilan peserta didik dalam aplikasi-aplikasi artificial intelligence yang dapat dipergunakan dalam kehidupan sehari-hari.

Pembelajaran AI akan ditemani langsung oleh Tutor dari Universitas Indonesia. Di dalam program Fun Learning with AI peserta didik akan mempelajari 4 (empat) pokok pembahasan di antaranya adalah robotik, coding, programing, dan data science.

Fun learning with AI ditunjang dengan kurikulum yang lengkap. Peserta didik akan mendapatkan Modul pembelajaran, jaringan internet, dan sertifikat.`,
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800",
    },
    {
        id: 2,
        title: "AI Day",
        description: `AI Day merupakan sebuah kegiatan yang dilaksanakan selama satu hari dengan tujuan untuk menumbuhkan minat, pengetahuan, dan keterampilan peserta didik dalam bidang artificial intelligence dengan cara yang menyenangkan (fun learning).

Kegiatan ini sebagian besar merupakan pengenalan robotik dan artificial intelligence untuk siswa SD/MI, SMP/MTs, dan SMA/MA/SMK.`,
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=800",
    },
    {
        id: 3,
        title: "AI Edu Fair",
        description: `Sebuah kegiatan yang dilaksanakan selama satu hari dengan tujuan untuk menumbuhkan rasa ingin tahu, pengetahuan, dan keterampilan peserta didik dalam bidang artificial intelligence.

Selain itu, pada kegiatan ini dikembangkan juga beberapa soft skills seperti: berpikir logis, berpikir kritis, teamwork, dan lain-lain.

Kegiatan ini ditujukan untuk siswa SD/MI dengan kegiatan utama berupa pelatihan perakitan robot, pembuatan program dan mengikuti mini competition untuk memicu ketertarikan pada pembelajaran AI.`,
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800",
    },
    {
        id: 4,
        title: "Preparing Artificial Intelligence (AI) Talents for Indonesian Future Technology",
        description: `Merupakan program PT Artifisial Intelegensia Indonesia (AiCI) bekerjasama dengan Departemen Fisika FMIPA UI dan beberapa praktisi dalam lingkungan kerja start-up dan industri dalam bentuk Studi Independen Bersertifikat Kampus Merdeka.

Program ini bernama Indonesian Artificial Intelligence (AI) Talents. Peserta dapat mengikuti program yang dilaksanakan secara daring dalam durasi 5 bulan dengan biaya pelatihan Rp 3.750.000,-/mahasiswa/5 bulan.`,
        image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=800",
    },
    {
        id: 5,
        title: "AiCI SIM KLIN",
        description: `Solusi Klinik dalam menyiapkan sistem integrasi yang aman, responsif, dan prediktif sebagai upaya penyelenggaraan rekam medis elektronik sesuai dengan arahan KEMENKES RI.`,
        image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800",
    },
    {
        id: 6,
        title: "Digital Marketing for Business",
        description: `Dengan semakin berkembangnya teknologi digital, penting bagi perusahaan untuk memanfaatkan platform online seperti Google Ads, Landing Page, Website dan SEO untuk meningkatkan visibilitas dan omset.

Agensi kami siap membantu perusahaan Anda dalam mencapai tujuan tersebut.`,
        image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=800",
    },
    {
        id: 7,
        title: "Extracurricular AI and Robotic Club",
        description: `AiCI terbuka untuk menjadi bagian dari Ekstrakurikuler di sekolah-sekolah yang ingin membuka Ekstrakurikuler AI dan Robotik Club.

Kegiatan Ekstrakurikuler di sekolah adalah bentuk dari kerja sama AiCI dalam menyelenggarakan pendidikan yang berkualitas dengan cara mengenalkan dan membekali ilmu AI kepada siswa-siswi.

Kegiatan ekstrakurikuler dapat diikuti oleh siswa SD, SMP, dan SMA dengan modul pembelajaran sesuai tingkatannya. Siswa-siswi yang mengikuti ekstrakurikuler akan dibimbing langsung oleh tutor berpengalaman dari Universitas Indonesia.

Setiap siswa juga akan diberikan fasilitas media pembelajaran berupa berbagai jenis robot dan modul pembelajaran. Setiap sesi pembelajaran berlangsung 90 – 120 menit.`,
        image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?q=80&w=800",
    },
];

export default function ProgramPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            
            {/* Hero Section */}
            <section className="pt-24 pb-12 bg-primary">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Fun Learning with AI<br />
                        untuk Siswa SD/MI,<br />
                        SMP/MTs dan SMA/<br />
                        MA/SMK
                    </h1>
                    <p className="text-white/70 max-w-2xl mt-6">
                        Berbagai program pengembangan keterampilan AI dan Robotika yang dirancang untuk semua tingkatan pendidikan.
                    </p>
                </div>
            </section>

            {/* Programs List */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    {programs.map((program, index) => (
                        <div
                            key={program.id}
                            className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 py-16 ${index !== programs.length - 1 ? 'border-b border-gray-100' : ''}`}
                        >
                            {/* Image */}
                            <div className="lg:w-1/2">
                                <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg">
                                    <Image
                                        src={program.image}
                                        alt={program.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="lg:w-1/2 flex flex-col justify-center">
                                <span className="text-secondary text-sm font-bold uppercase tracking-wider mb-2">
                                    Program
                                </span>
                                <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                                    {program.title}
                                </h2>
                                <div className="text-primary/70 whitespace-pre-line leading-relaxed">
                                    {program.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </main>
    );
}
