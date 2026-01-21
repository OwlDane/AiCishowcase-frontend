"use client";

import { useState, useEffect } from "react";
import { api, BackendPartner } from "@/lib/api";
import Image from "next/image";

/**
 * Admin Partners Page - Kelola partner/sponsor logos
 */

export default function AdminPartnersPage() {
    const [partners, setPartners] = useState<BackendPartner[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await api.content.partners();
            setPartners(data.results);
        } catch (error) {
            console.error("Failed to fetch partners:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Partners</h1>
                    <p className="text-primary/60">Kelola logo partner dan sponsor</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Partner
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                            <div className="h-20 bg-gray-100 rounded-lg" />
                        </div>
                    ))
                ) : partners.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-12 text-center text-primary/40">
                        Belum ada partner. Klik "Tambah Partner" untuk menambahkan.
                    </div>
                ) : (
                    partners.map((partner) => (
                        <div key={partner.id} className="bg-white rounded-2xl p-6 hover:shadow-lg transition-all group">
                            <div className="relative h-20 mb-4">
                                <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    fill
                                    className="object-contain"
                                    sizes="150px"
                                />
                            </div>
                            <p className="text-center text-sm font-medium text-primary truncate">{partner.name}</p>
                            <div className="flex justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-primary/40 hover:text-primary">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button className="p-2 text-red-400 hover:text-red-600">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
                        <h2 className="text-xl font-bold text-primary mb-6">Tambah Partner</h2>
                        <p className="text-primary/60 mb-4">Form fields: name, logo (upload), website_url</p>
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
