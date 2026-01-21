"use client";

import { useState, useEffect } from "react";
import { api, BackendGalleryImage } from "@/lib/api";
import Image from "next/image";

/**
 * Admin Gallery Page - Kelola foto galeri kegiatan
 */

const categories = [
    { value: "KEGIATAN", label: "Kegiatan" },
    { value: "WORKSHOP", label: "Workshop" },
    { value: "KOMPETISI", label: "Kompetisi" },
    { value: "LAINNYA", label: "Lainnya" },
];

export default function AdminGalleryPage() {
    const [images, setImages] = useState<BackendGalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await api.content.gallery();
            setImages(data.results);
        } catch (error) {
            console.error("Failed to fetch gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Gallery</h1>
                    <p className="text-primary/60">Kelola foto galeri kegiatan</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Upload Foto
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {loading ? (
                    [...Array(8)].map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
                    ))
                ) : images.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-12 text-center text-primary/40">
                        Belum ada foto. Klik "Upload Foto" untuk menambahkan.
                    </div>
                ) : (
                    images.map((image) => (
                        <div key={image.id} className="relative aspect-square rounded-xl overflow-hidden group">
                            <Image
                                src={image.image}
                                alt={image.title || "Gallery"}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-4">
                                <p className="text-sm font-medium text-center line-clamp-2">{image.title || "Untitled"}</p>
                                <span className="text-xs mt-1 px-2 py-0.5 bg-secondary rounded-full">{image.category_display}</span>
                                {image.is_featured && (
                                    <span className="text-xs mt-2 text-yellow-400">⭐ Featured</span>
                                )}
                                <div className="flex gap-4 mt-4">
                                    <button className="text-white/80 hover:text-white">Edit</button>
                                    <button className="text-red-400 hover:text-red-300">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
                        <h2 className="text-xl font-bold text-primary mb-6">Upload Foto</h2>
                        <p className="text-primary/60 mb-4">Form fields: title, image (upload), category (dropdown), description, date_taken, is_featured (checkbox)</p>
                        <div className="flex gap-4 justify-end">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">Batal</button>
                            <button className="px-6 py-2 bg-secondary text-white rounded-xl font-bold">Upload</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
