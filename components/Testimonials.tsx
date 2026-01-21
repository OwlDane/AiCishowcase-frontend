"use client";

import Image from "next/image";

/**
 * Testimonials Component
 * 
 * Menampilkan testimoni dari siswa AiCi.
 * Data testimoni yang sudah disediakan:
 * 1. Kahfi - Siswa SD - "Cool!"
 * 2. Sachio - Siswa SMP - "Hi Tech, robots and AI are our future..."
 * 3. Aulia - Siswa SMA - "The problem is that the world in the future..."
 * 4. Sandhya - Siswa SD - "Cool, That's Clever!"
 * 
 * PANDUAN:
 * - Nanti bisa diganti dengan data dari API /content/testimonials/
 * - Ganti placeholder foto dengan foto asli siswa
 */

const testimonials = [
    {
        name: "Kahfi",
        role: "Siswa SD",
        quote: "Cool!",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400",
    },
    {
        name: "Sachio",
        role: "Siswa SMP",
        quote: "Hi Tech, robots and AI are our future, because now technology is increasingly being used",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    },
    {
        name: "Aulia",
        role: "Siswa SMA",
        quote: "The problem is that the world in the future will also be more sophisticated than now, there will definitely be many more",
        photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400",
    },
    {
        name: "Sandhya",
        role: "Siswa SD",
        quote: "Cool, That's Clever!",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400",
    },
];

const Testimonials = () => {
    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-semibold text-[#0B6282] mb-3">
                        Testimonials
                    </h2>
                    <p className="text-[#0B6282] text-lg md:text-xl font-medium opacity-80">
                        What Do They Think After Studying At AiCI?
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-24">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center group hover:-translate-y-2 hover:shadow-2xl hover:bg-white rounded-3xl p-6 transition-all duration-300"
                        >
                            {/* Photo Container with bottom curve */}
                            <div className="relative w-full max-w-[400px] aspect-square mb-6">
                                <div className="absolute inset-0 rounded-[2.5rem] overflow-hidden">
                                    <Image
                                        src={testimonial.photo}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 400px"
                                    />
                                    {/* Bottom Curve Overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-white flex items-center justify-center">
                                        <div className="absolute top-[-40px] left-0 right-0 h-20 bg-white rounded-[50%_50%_0_0] transform scale-x-[1.2]" />
                                    </div>
                                </div>
                                
                                {/* Role Label (Overlapping the curve) */}
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
                                    <div className="bg-white px-8 py-2 rounded-full border border-gray-200/50 shadow-sm text-sm font-normal text-gray-800">
                                        {testimonial.role}
                                    </div>
                                </div>
                            </div>

                            {/* Name & Quote */}
                            <div className="text-center mt-4">
                                <h3 className="text-2xl md:text-3xl font-semibold text-[#0B6282] mb-3">
                                    {testimonial.name}
                                </h3>
                                <p className="text-[#0B6282] text-sm md:text-base italic max-w-xs mx-auto leading-relaxed">
                                    "{testimonial.quote}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
