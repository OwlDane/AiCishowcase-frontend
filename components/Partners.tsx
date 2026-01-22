"use client";

import { LogoLoop } from "./LogoLoop";

/**
 * Partners Component
 * 
 * Menampilkan logo partner/sekolah yang bekerjasama dengan AiCi.
 * Sekarang menggunakan LogoLoop untuk animasi kontinu.
 */

const partnerLogos = [
    { src: "/icon/bahasa-kita.png", alt: "Bahasa Kita" },
    { src: "/icon/emliku.png", alt: "Emliku" },
    { src: "/icon/helber.png", alt: "Helber" },
    { src: "/icon/jari-visibility.png", alt: "Jari Visibility" },
    { src: "/icon/nusa-aksara.png", alt: "Nusa Aksara" },
    { src: "/icon/prime-skill.png", alt: "Prime Skill" },
    { src: "/icon/tunas-muda.png", alt: "Tunas Muda" },
    { src: "/icon/ubtech.png", alt: "Ubtech" },
    { src: "/icon/imajin.png", alt: "Imajin" },
    { src: "/icon/star-chain.png", alt: "Star Chain" },
    { src: "/icon/widya.png", alt: "Widya" },
    { src: "/icon/uin.png", alt: "Uin" },
    { src: "/icon/pgri.png", alt: "Pgri" },
    { src: "/icon/kominfo.png", alt: "Kominfo" },
    { src: "/icon/tut-wuri-handayani.png", alt: "Tut Wuri Handayani" },
];

const Partners = () => {
    return (
        <section className="py-20 bg-white border-t border-gray-50 overflow-hidden">
            {/* Title Container */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <div className="text-center">
                    <p className="text-[#0B6282] text-xs font-semibold uppercase tracking-[0.3em]">
                        Dipercaya oleh
                    </p>
                </div>
            </div>

            {/* Full-width Partners Loop */}
            <div className="w-full">
                <LogoLoop 
                    logos={partnerLogos}
                    logoHeight={120}
                    direction="right"
                    speed={80}
                    gap={120}
                    grayscaleOnLoop={true}
                    scaleOnHover={false}
                    pauseOnHover={true}
                    fadeOut={true}
                    fadeOutColor="#ffffff"
                />
            </div>
        </section>
    );
};

export default Partners;
