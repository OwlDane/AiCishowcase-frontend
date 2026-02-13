"use client";

/**
 * Placement Test List Page
 * Shows available placement tests
 */

import { useQuery } from '@tanstack/react-query';
import { placementTestApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Clock, FileText, Award, ArrowRight, Loader2 } from 'lucide-react';
import type { PlacementTest } from '@/lib/types/placement-test';

export default function PlacementTestListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['placement-tests'],
    queryFn: () => placementTestApi.list(),
  });

  const tests = data?.data || [];

  const educationLevelLabels: Record<string, string> = {
    sd_mi: 'SD/MI',
    smp_mts: 'SMP/MTs',
    sma_ma: 'SMA/MA',
    umum: 'Umum',
  };

  return (
    <main className="min-h-screen bg-[#eef2f5]">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 pb-16 bg-linear-to-br from-[#255d74] to-[#1e4a5f] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Placement Test
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Ikuti placement test untuk mengetahui level kemampuan Anda dan mendapatkan rekomendasi kelas yang sesuai.
            </p>
          </div>
        </div>
      </div>

      {/* Tests List */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#255d74]" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600">Gagal memuat placement test. Silakan coba lagi.</p>
          </div>
        ) : tests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center">
            <p className="text-[#255d74]/60">Belum ada placement test tersedia.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tests.map((test: PlacementTest) => (
              <div
                key={test.id}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full mb-3">
                      {educationLevelLabels[test.education_level] || test.education_level}
                    </span>
                    <h3 className="text-2xl font-bold text-[#255d74] mb-2 group-hover:text-secondary transition-colors">
                      {test.title}
                    </h3>
                    <p className="text-[#255d74]/60 leading-relaxed">
                      {test.description}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-[#255d74]/60">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">{test.duration_minutes} menit</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#255d74]/60">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm font-medium">{test.total_questions} soal</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#255d74]/60">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Min. {test.passing_score}%</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/placement-test/${test.slug}`}
                  className="flex items-center justify-center gap-2 w-full bg-[#255d74] text-white py-3 rounded-xl font-bold hover:bg-[#1e4a5f] transition-all group-hover:shadow-lg group-hover:shadow-[#255d74]/20"
                >
                  Mulai Test
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Retake Info */}
                {test.allow_retake && (
                  <p className="text-xs text-[#255d74]/40 text-center mt-3">
                    Dapat diulang setelah {test.retake_cooldown_days} hari
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-12 bg-linear-to-r from-[#255d74]/5 to-secondary/5 rounded-2xl p-8 border border-[#255d74]/10">
          <h3 className="text-xl font-bold text-[#255d74] mb-4">Mengapa Placement Test?</h3>
          <ul className="space-y-3 text-[#255d74]/80">
            <li className="flex items-start gap-3">
              <span className="text-secondary font-bold">•</span>
              <span>Mengetahui level kemampuan Anda saat ini</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-secondary font-bold">•</span>
              <span>Mendapatkan rekomendasi kelas yang sesuai dengan kemampuan</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-secondary font-bold">•</span>
              <span>Memaksimalkan hasil belajar dengan kurikulum yang tepat</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-secondary font-bold">•</span>
              <span>Mendapatkan sertifikat hasil placement test</span>
            </li>
          </ul>
        </div>
      </div>

      <Footer />
    </main>
  );
}
