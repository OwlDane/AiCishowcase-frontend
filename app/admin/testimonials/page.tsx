"use client";

import { useState, useEffect } from "react";
import { api, BackendTestimonial, PaginatedResponse } from "@/lib/api";
import Image from "next/image";

/**
 * Admin Testimonials Page
 * 
 * CRUD untuk mengelola testimoni siswa.
 * 
 * PANDUAN untuk modifikasi:
 * - Form fields: name, role, quote, photo
 * - Data diambil dari API /content/testimonials/
 */

export default function AdminTestimonialsPage() {
    const [testimonials, setTestimonials] = useState<BackendTestimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState<BackendTestimonial | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await api.content.testimonials();
            setTestimonials(data.results);
        } catch (error) {
            console.error("Failed to fetch testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Yakin ingin menghapus testimoni ini?")) return;
        // TODO: Implement delete API call
        alert("Delete functionality - implement API call");
    };

    const handleEdit = (item: BackendTestimonial) => {
        setEditingItem(item);
        setShowModal(true);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Testimonials</h1>
                    <p className="text-primary/60">Kelola testimoni siswa AiCi</p>
                </div>
                <button
                    onClick={() => { setEditingItem(null); setShowModal(true); }}
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Testimoni
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-wider">Foto</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-wider">Nama</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-wider">Role</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-wider">Quote</th>
                            <th className="text-right px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-primary/40">
                                    Loading...
                                </td>
                            </tr>
                        ) : testimonials.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-primary/40">
                                    Belum ada testimoni. Klik "Tambah Testimoni" untuk menambahkan.
                                </td>
                            </tr>
                        ) : (
                            testimonials.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        {item.photo ? (
                                            <div className="w-12 h-12 rounded-full overflow-hidden relative">
                                                <Image src={item.photo} alt={item.name} fill className="object-cover" sizes="48px" />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {item.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-primary">{item.name}</td>
                                    <td className="px-6 py-4 text-primary/60">{item.role}</td>
                                    <td className="px-6 py-4 text-primary/60 max-w-xs truncate">"{item.quote}"</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-primary/40 hover:text-primary mr-4"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-400 hover:text-red-600"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal - TODO: Implement form */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
                        <h2 className="text-xl font-bold text-primary mb-6">
                            {editingItem ? "Edit Testimoni" : "Tambah Testimoni"}
                        </h2>
                        <p className="text-primary/60 mb-4">Form implementasi - TODO</p>
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button className="px-6 py-2 bg-secondary text-white rounded-xl font-bold">
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
