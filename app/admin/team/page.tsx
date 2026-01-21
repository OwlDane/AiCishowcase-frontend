"use client";

import { useState, useEffect } from "react";
import { api, BackendTeamMember } from "@/lib/api";
import Image from "next/image";

/**
 * Admin Team Page - Kelola Tim Operasional dan Tutor
 */

export default function AdminTeamPage() {
    const [members, setMembers] = useState<BackendTeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await api.content.team();
            setMembers(data.results);
        } catch (error) {
            console.error("Failed to fetch team:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Team Members</h1>
                    <p className="text-primary/60">Kelola Tim Operasional dan Tutor</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Anggota
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 animate-pulse text-center">
                            <div className="w-24 h-24 rounded-full bg-gray-100 mx-auto mb-4" />
                            <div className="h-4 bg-gray-100 rounded w-3/4 mx-auto mb-2" />
                            <div className="h-3 bg-gray-100 rounded w-1/2 mx-auto" />
                        </div>
                    ))
                ) : members.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl p-12 text-center text-primary/40">
                        Belum ada anggota tim. Klik "Tambah Anggota" untuk menambahkan.
                    </div>
                ) : (
                    members.map((member) => (
                        <div key={member.id} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all group">
                            <div className="relative w-24 h-24 rounded-full overflow-hidden mx-auto mb-4">
                                <Image
                                    src={member.photo}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                    sizes="96px"
                                />
                            </div>
                            <h3 className="font-bold text-primary">{member.name}</h3>
                            <p className="text-primary/60 text-sm">{member.position}</p>
                            <span className={`inline-block mt-2 px-3 py-1 text-xs font-bold rounded-full ${
                                member.role_type === 'OPERASIONAL' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                            }`}>
                                {member.role_type_display}
                            </span>
                            <div className="flex justify-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 text-primary/40 hover:text-primary">Edit</button>
                                <button className="p-2 text-red-400 hover:text-red-600">Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4">
                        <h2 className="text-xl font-bold text-primary mb-6">Tambah Anggota Tim</h2>
                        <p className="text-primary/60 mb-4">Form fields: name, position, role_type (dropdown), photo (upload)</p>
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
