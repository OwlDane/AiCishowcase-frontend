"use client";

/**
 * Classes List Page
 * Browse all available classes
 */

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { classesApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Clock, Users, Award, ArrowRight, Loader2, Filter } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/format';

export default function ClassesListPage() {
    const [levelFilter, setLevelFilter] = useState<string>('all');

    const { data, isLoading } = useQuery({
        queryKey: ['classes', levelFilter],
        queryFn: () => classesApi.list(levelFilter !== 'all' ? `level=${levelFilter}` : ''),
    });

    const classes = data?.data || [];

    const levels = [
        { value: 'all', label: 'Semua Level' },
        { value: 'beginner', label: 'Pemula' },
        { value: 'elementary', label: 'Dasar' },
        { value: 'intermediate', label: 'Menengah' },
        { value: 'advanced', label: 'Lanjut' },
    ];

    const levelColors: Record<string, string> = {
        beginner: 'bg-blue-100 text-blue-600',
        elementary: 'bg-green-100 text-green-600',
        intermediate: 'bg-yellow-100 text-yellow-600',
        advanced: 'bg-purple-100 text-purple-600',
    };

    return (
        <main className="min-h-screen bg-[#eef2f5]">
            <Navbar />

            {/* Hero */}
            <div className="pt-32 pb-16 bg-linear-to-br from-[#255d74] to-[#1e4a5f] text-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Kelas Tersedia</h1>
                    <p className="text-xl text-white/80 max-w-2xl">
                        Pilih kelas yang sesuai dengan level dan minat Anda dalam AI & Robotika
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Filters */}
                <div className="flex items-center gap-4 mb-8 flex-wrap">
                    <div className="flex items-center gap-2 text-[#255d74]/60">
                        <Filter className="w-5 h-5" />
                        <span className="font-bold">Filter:</span>
                    </div>
                    {levels.map((level) => (
                        <button
                            key={level.value}
                            onClick={() => setLevelFilter(level.value)}
                            className={`px-4 py-2 rounded-xl font-medium transition-all ${levelFilter === level.value
                                    ? 'bg-[#255d74] text-white shadow-lg'
                                    : 'bg-white text-[#255d74] hover:bg-gray-50'
                                }`}
                        >
                            {level.label}
                        </button>
                    ))}
                </div>

                {/* Classes Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-[#255d74]" />
                    </div>
                ) : classes.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <p className="text-[#255d74]/60">Tidak ada kelas tersedia untuk filter ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {classes.map((classItem: any) => (
                            <div
                                key={classItem.id}
                                className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
                            >
                                {classItem.image && (
                                    <div className="relative h-48 bg-linear-to-br from-[#255d74]/10 to-secondary/10">
                                        <img
                                            src={classItem.image}
                                            alt={classItem.name}
                                            className="w-full h-full object-cover"
                                        />
                                        {classItem.is_featured && (
                                            <div className="absolute top-4 right-4 px-3 py-1 bg-secondary text-white text-xs font-bold rounded-full">
                                                Featured
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${levelColors[classItem.level] || 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {classItem.level}
                                        </span>
                                        <span className="text-xs text-[#255d74]/40">{classItem.program_name}</span>
                                    </div>

                                    <h3 className="text-xl font-bold text-[#255d74] mb-2 group-hover:text-secondary transition-colors">
                                        {classItem.name}
                                    </h3>
                                    <p className="text-[#255d74]/60 text-sm mb-4 line-clamp-2">
                                        {classItem.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-[#255d74]/60 mb-4">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{classItem.duration_hours}h</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="w-4 h-4" />
                                            <span>{classItem.capacity - classItem.enrolled_count} slot</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-xs text-[#255d74]/40">Harga</p>
                                            <p className="text-xl font-bold text-[#255d74]">{classItem.price_formatted}</p>
                                        </div>
                                        <Link
                                            href={`/classes/${classItem.slug}`}
                                            className="px-4 py-2 bg-[#255d74] text-white rounded-xl text-sm font-bold hover:bg-[#1e4a5f] transition-all flex items-center gap-2"
                                        >
                                            Detail
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
