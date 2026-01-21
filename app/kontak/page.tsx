"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapSection from "@/components/MapSection";
import Image from "next/image";

/**
 * Kontak Page
 * 
 * Struktur sesuai design reference:
 * 1. Hero dengan gambar dan info kontak
 * 2. Social media icons
 * 3. Map
 * 
 * PANDUAN:
 * - Form kontak bisa ditambahkan nanti
 * - Data kontak menggunakan info dari user
 */

const socialLinks = [
    { icon: "instagram", href: "https://instagram.com/aici.official", color: "bg-gradient-to-br from-purple-500 to-pink-500" },
    { icon: "linkedin", href: "https://linkedin.com/company/aici-indonesia", color: "bg-blue-600" },
    { icon: "email", href: "mailto:info@aici-aii.com", color: "bg-red-500" },
    { icon: "whatsapp", href: "https://wa.me/6282110103938", color: "bg-green-500" },
    { icon: "phone", href: "tel:+6282110103938", color: "bg-primary" },
];

export default function KontakPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-primary">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* Image */}
                        <div className="lg:w-1/3">
                            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600"
                                    alt="Contact AiCi"
                                    fill
                                    className="object-cover"
                                    sizes="33vw"
                                />
                            </div>
                        </div>
                        
                        {/* Contact Info */}
                        <div className="lg:w-2/3">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Kontak Kami
                            </h1>
                            
                            <div className="space-y-2 text-white/90 mb-8">
                                <p className="font-bold">Artificial Intelligence Center Indonesia</p>
                                <p>Gd. Laboratorium Riset Multidisiplin Pertamina</p>
                                <p>FMIPA UI Lt. 4, Universitas Indonesia</p>
                                <p>Depok, Jawa Barat 16424</p>
                                <p>Telephone 0821-1010-3938</p>
                            </div>
                            
                            {/* Social Icons */}
                            <div className="flex gap-3">
                                {socialLinks.map((link) => (
                                    <a
                                        key={link.icon}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-12 h-12 ${link.color} rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg`}
                                    >
                                        <SocialIcon type={link.icon} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <MapSection />

            <Footer />
        </main>
    );
}

// Social Icon Component
const SocialIcon = ({ type }: { type: string }) => {
    const iconClass = "w-6 h-6";
    
    switch (type) {
        case "instagram":
            return (
                <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.947-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
            );
        case "linkedin":
            return (
                <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
                </svg>
            );
        case "email":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
            );
        case "whatsapp":
            return (
                <svg className={iconClass} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.319 1.592 5.548 0 10.061-4.512 10.064-10.062 0-2.69-1.048-5.22-2.953-7.127-1.907-1.906-4.436-2.955-7.124-2.956-5.548 0-10.06 4.513-10.063 10.062 0 2.0.525 3.945 1.52 5.679l-.999 3.65 3.736-.98z"/>
                </svg>
            );
        case "phone":
            return (
                <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
            );
        default:
            return null;
    }
};
