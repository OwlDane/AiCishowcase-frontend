"use client";

/**
 * MapSection Component
 * 
 * Menampilkan Google Maps embed lokasi AiCi.
 * Lokasi: FMIPA UI, Gedung Laboratorium Riset Multidisiplin, Depok
 * 
 * CATATAN:
 * - Menggunakan iframe dari Google Maps
 * - Link sudah disediakan oleh user
 */

const MapSection = () => {
    return (
        <section className="bg-white">
            {/* Full-width Map */}
            <div className="w-full h-[400px] md:h-[500px] relative">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2042856296957!2d106.82363877571048!3d-6.367603293622534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed6f766ef0f9%3A0x1ed13c8f0c344b3d!2sArtificial%20Intelligence%20Center%20Indonesia%20(AiCI)!5e0!3m2!1sen!2sid!4v1768965567384!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                />
            </div>
        </section>
    );
};

export default MapSection;
