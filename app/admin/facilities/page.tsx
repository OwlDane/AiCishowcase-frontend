"use client";

import { useState, useEffect } from "react";
import { api, BackendFacility } from "@/lib/api";
import Image from "next/image";

/**
 * Admin Facilities Page - Kelola fasilitas (Ruangan, Modul, Media Kit, Robot)
 */

const categories = [
    { value: "RUANGAN", label: "Ruangan" },
    { value: "MODUL", label: "Modul" },
    { value: "MEDIA_KIT", label: "Media Kit" },
    { value: "ROBOT", label: "Robot" },
];

export default function AdminFacilitiesPage() {
    const [facilities, setFacilities] = useState<BackendFacility[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeCategory]);

    const fetchData = async () => {
        try {
            const data = await api.content.facilities(activeCategory || undefined);
            setFacilities(data.results);
        } catch (error) {
            console.error("Failed to fetch facilities:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Facilities</h1>
                    <p className="text-primary/60">Kelola fasilitas pembelajaran</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Fasilitas
                </button>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                        activeCategory === null ? "bg-primary text-white" : "bg-white text-primary hover:bg-gray-50"
                    }`}
                >
                    Semua
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => setActiveCategory(cat.value)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            activeCategory === cat.value ? "bg-primary text-white" : "bg-white text-primary hover:bg-gray-50"
                        }`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                            <div className="h-48 bg-gray-100" />
                            <div className="p-6 space-y-2">
                                <div className="h-4 bg-gray-100 rounded w-1/4" />
                                <div className="h-6 bg-gray-100 rounded w-3/4" />
                            </div>
                        </div>
                    ))
                ) : facilities.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-12 text-center text-primary/40">
                        Belum ada fasilitas. Klik "Tambah Fasilitas" untuk menambahkan.
                    </div>
                ) : (
                    facilities.map((facility) => (
                        <div key={facility.id} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                            <div className="relative h-48">
                                <Image
                                    src={facility.image}
                                    alt={facility.title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full">
                                        {facility.category_display}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="font-bold text-primary mb-2">{facility.title}</h3>
                                <p className="text-primary/60 text-sm line-clamp-2">{facility.description}</p>
                                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 text-primary/40 hover:text-primary bg-gray-50 rounded-lg">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button className="p-2 text-red-400 hover:text-red-600 bg-gray-50 rounded-lg">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
                        <h2 className="text-xl font-bold text-primary mb-6">Tambah Fasilitas</h2>
                        <p className="text-primary/60 mb-4">Form fields: category, title, description, image (upload)</p>
                        <div className="flex gap-4 justify-end">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">Batal</button>
                            <button className="px-6 py-2 bg-secondary text-white rounded-xl font-bold">Simpan</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
