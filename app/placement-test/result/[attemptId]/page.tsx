"use client";

/**
 * Placement Test Result Page
 * Shows test results and class recommendations
 */

import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { placementTestApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Trophy, Download, Clock, CheckCircle, TrendingUp, BookOpen, Loader2, ArrowRight } from 'lucide-react';
import { formatCurrency, formatDuration } from '@/lib/utils/format';

export default function PlacementTestResultPage() {
    const params = useParams();
    const router = useRouter();
    const attemptId = params.attemptId as string;

    const { data, isLoading } = useQuery({
        queryKey: ['test-result', attemptId],
        queryFn: () => placementTestApi.getResult(attemptId),
    });

    const attempt = data?.data?.attempt;
    const result = data?.data?.result;
    const recommendedClasses = data?.data?.recommendedClasses || [];

    const levelColors: Record<string, string> = {
        beginner: 'bg-blue-100 text-blue-600',
        elementary: 'bg-green-100 text-green-600',
        intermediate: 'bg-yellow-100 text-yellow-600',
        advanced: 'bg-purple-100 text-purple-600',
    };

    const levelLabels: Record<string, string> = {
        beginner: 'Pemula',
        elementary: 'Dasar',
        intermediate: 'Menengah',
        advanced: 'Lanjut',
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#eef2f5] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#255d74]" />
            </main>
        );
    }

    if (!attempt || !result) {
        return (
            <main className="min-h-screen bg-[#eef2f5]">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 py-32 text-center">
                    <p className="text-[#255d74]/60">Hasil test tidak ditemukan.</p>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#eef2f5]">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-32">
                {/* Result Header */}
                <div className="bg--to-br from-[#255d74] to-[#1e4a5f] rounded-[2.5rem] p-12 text-white mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <Trophy className="w-12 h-12" />
                            <div>
                                <h1 className="text-3xl font-bold">Test Selesai!</h1>
                                <p className="text-white/80">Berikut adalah hasil placement test Anda</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                <p className="text-white/60 text-sm mb-2">Skor Akhir</p>
                                <p className="text-4xl font-bold">{attempt.score}%</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                <p className="text-white/60 text-sm mb-2">Level</p>
                                <p className="text-2xl font-bold">{levelLabels[attempt.level_result] || attempt.level_result}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                <p className="text-white/60 text-sm mb-2">Benar</p>
                                <p className="text-2xl font-bold">{attempt.correct_answers}/{attempt.total_questions}</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                                <p className="text-white/60 text-sm mb-2">Waktu</p>
                                <p className="text-2xl font-bold">{formatDuration(attempt.time_spent_seconds)}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => window.open(placementTestApi.downloadResult(attemptId), '_blank')}
                            className="mt-8 px-6 py-3 bg-white text-[#255d74] rounded-xl font-bold hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg"
                        >
                            <Download className="w-5 h-5" />
                            Download Sertifikat PDF
                        </button>
                    </div>
                </div>

                {/* Performance Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Category Scores */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-[#255d74] mb-6 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6" />
                            Skor per Kategori
                        </h2>
                        <div className="space-y-4">
                            {Object.entries(result.category_scores as Record<string, number>).map(([category, score]) => (
                                <div key={category}>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-[#255d74]/80 capitalize">{category.replace('_', ' ')}</span>
                                        <span className="font-bold text-[#255d74]">{score}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-linear-to-r from-[#255d74] to-secondary transition-all"
                                            style={{ width: `${score}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Strengths & Weaknesses */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-[#255d74] mb-6">Analisis</h2>

                        {result.strengths && result.strengths.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-green-600 mb-3 flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Kekuatan
                                </h3>
                                <ul className="space-y-2">
                                    {result.strengths.map((strength: string, index: number) => (
                                        <li key={index} className="text-[#255d74]/80 text-sm flex items-start gap-2">
                                            <span className="text-green-500 mt-1">•</span>
                                            <span>{strength}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result.weaknesses && result.weaknesses.length > 0 && (
                            <div>
                                <h3 className="text-sm font-bold text-orange-600 mb-3 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Area Pengembangan
                                </h3>
                                <ul className="space-y-2">
                                    {result.weaknesses.map((weakness: string, index: number) => (
                                        <li key={index} className="text-[#255d74]/80 text-sm flex items-start gap-2">
                                            <span className="text-orange-500 mt-1">•</span>
                                            <span>{weakness}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Performance Summary */}
                {result.performance_summary && (
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-8">
                        <h2 className="text-xl font-bold text-[#255d74] mb-4">Ringkasan Performa</h2>
                        <p className="text-[#255d74]/80 leading-relaxed">{result.performance_summary}</p>
                    </div>
                )}

                {/* Recommended Classes */}
                {recommendedClasses.length > 0 && (
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-[#255d74] mb-2 flex items-center gap-2">
                            <BookOpen className="w-7 h-7" />
                            Rekomendasi Kelas untuk Anda
                        </h2>
                        <p className="text-[#255d74]/60 mb-8">Berdasarkan hasil test, berikut kelas yang cocok untuk level Anda</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recommendedClasses.map((classItem: any) => (
                                <div
                                    key={classItem.id}
                                    className="border-2 border-gray-100 rounded-2xl p-6 hover:border-[#255d74]/30 hover:shadow-lg transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${levelColors[classItem.level] || 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {levelLabels[classItem.level] || classItem.level}
                                            </span>
                                            <h3 className="text-xl font-bold text-[#255d74] mb-2 group-hover:text-secondary transition-colors">
                                                {classItem.name}
                                            </h3>
                                            <p className="text-sm text-[#255d74]/60 mb-3">{classItem.program_name}</p>
                                        </div>
                                    </div>

                                    <p className="text-[#255d74]/80 text-sm mb-4 line-clamp-2">{classItem.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                        <div>
                                            <p className="text-xs text-[#255d74]/40">Harga</p>
                                            <p className="text-lg font-bold text-[#255d74]">{formatCurrency(classItem.price)}</p>
                                        </div>
                                        <Link
                                            href={`/classes/${classItem.slug}`}
                                            className="px-4 py-2 bg-[#255d74] text-white rounded-xl text-sm font-bold hover:bg-[#1e4a5f] transition-all flex items-center gap-2"
                                        >
                                            Lihat Detail
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Next Steps */}
                {result.next_steps && result.next_steps.length > 0 && (
                    <div className="mt-8 bg--to-r from-[#255d74]/5 to-secondary/5 rounded-2xl p-8 border border-[#255d74]/10">
                        <h3 className="text-xl font-bold text-[#255d74] mb-4">Langkah Selanjutnya</h3>
                        <ul className="space-y-3">
                            {result.next_steps.map((step: string, index: number) => (
                                <li key={index} className="flex items-start gap-3 text-[#255d74]/80">
                                    <span className="shrink-0 w-6 h-6 bg-secondary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
