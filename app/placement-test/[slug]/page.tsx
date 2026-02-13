"use client";

/**
 * Placement Test Instructions & Pre-Assessment Page
 */

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { placementTestApi } from '@/lib/api';
import { useAuth } from '@/lib/hooks/use-auth';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Clock, FileText, Award, AlertCircle, Loader2, Play } from 'lucide-react';

const preAssessmentSchema = z.object({
  full_name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  age: z.number().min(5, 'Usia minimal 5 tahun').max(100, 'Usia tidak valid'),
  education_level: z.enum(['sd_mi', 'smp_mts', 'sma_ma', 'umum']),
  current_grade: z.string().optional(),
  experience_ai: z.boolean().optional(),
  experience_robotics: z.boolean().optional(),
  experience_programming: z.boolean().optional(),
  interests: z.string().optional(),
});

type PreAssessmentFormData = z.infer<typeof preAssessmentSchema>;

export default function PlacementTestInstructionsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const slug = params.slug as string;

  // Fetch test details
  const { data, isLoading } = useQuery({
    queryKey: ['placement-test', slug],
    queryFn: () => placementTestApi.show(slug),
  });

  const test = data?.data?.test;
  const existingAttempt = data?.data?.existingAttempt;

  // Start test mutation
  const startTestMutation = useMutation({
    mutationFn: (formData: PreAssessmentFormData) => {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        age: formData.age,
        education_level: formData.education_level,
        current_grade: formData.current_grade || undefined,
        experience: {
          ai: formData.experience_ai || false,
          robotics: formData.experience_robotics || false,
          programming: formData.experience_programming || false,
        },
        interests: formData.interests ? formData.interests.split(',').map(i => i.trim()) : [],
      };
      return placementTestApi.start(test.id, payload);
    },
    onSuccess: (response) => {
      toast.success('Test dimulai! Semangat!');
      router.push(`/placement-test/${slug}/test?attempt=${response.data.attempt_id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Gagal memulai test');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PreAssessmentFormData>({
    resolver: zodResolver(preAssessmentSchema),
    defaultValues: {
      full_name: user?.name || '',
      email: user?.email || '',
      age: 0,
      education_level: 'sd_mi',
      experience_ai: false,
      experience_robotics: false,
      experience_programming: false,
    },
  });

  const onSubmit = (data: PreAssessmentFormData) => {
    startTestMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#eef2f5] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#255d74]" />
      </main>
    );
  }

  if (!test) {
    return (
      <main className="min-h-screen bg-[#eef2f5]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-32 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-[#255d74] mb-2">Test Tidak Ditemukan</h1>
          <p className="text-[#255d74]/60">Placement test yang Anda cari tidak tersedia.</p>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef2f5]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-32">
        {/* Test Header */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#255d74] mb-4">
            {test.title}
          </h1>
          <p className="text-[#255d74]/80 text-lg leading-relaxed mb-6">
            {test.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 bg-[#255d74]/5 rounded-xl">
              <Clock className="w-6 h-6 text-[#255d74] mb-2" />
              <span className="text-sm text-[#255d74]/60">Durasi</span>
              <span className="text-lg font-bold text-[#255d74]">{test.duration_minutes} menit</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-[#255d74]/5 rounded-xl">
              <FileText className="w-6 h-6 text-[#255d74] mb-2" />
              <span className="text-sm text-[#255d74]/60">Soal</span>
              <span className="text-lg font-bold text-[#255d74]">{test.total_questions}</span>
            </div>
            <div className="flex flex-col items-center p-4 bg-[#255d74]/5 rounded-xl">
              <Award className="w-6 h-6 text-[#255d74] mb-2" />
              <span className="text-sm text-[#255d74]/60">Passing</span>
              <span className="text-lg font-bold text-[#255d74]">{test.passing_score}%</span>
            </div>
          </div>
        </div>

        {/* Existing Attempt Warning */}
        {existingAttempt && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-1">Anda Sudah Pernah Mengikuti Test Ini</h3>
                <p className="text-yellow-800 text-sm mb-3">
                  Skor: {existingAttempt.score}% | Level: {existingAttempt.level_result}
                </p>
                <button
                  onClick={() => router.push(`/placement-test/result/${existingAttempt.id}`)}
                  className="text-sm text-yellow-900 underline font-medium"
                >
                  Lihat Hasil Test →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!showForm ? (
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#255d74] mb-6">Instruksi Test</h2>
            <div
              className="prose prose-lg max-w-none text-[#255d74]/80"
              dangerouslySetInnerHTML={{ __html: test.instructions || '<p>Ikuti petunjuk yang diberikan pada setiap soal.</p>' }}
            />

            <div className="mt-8 pt-8 border-t border-gray-100">
              <button
                onClick={() => setShowForm(true)}
                className="w-full bg-[#255d74] text-white py-4 rounded-xl font-bold hover:bg-[#1e4a5f] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#255d74]/20"
              >
                <Play className="w-5 h-5" />
                Lanjutkan ke Form Pre-Assessment
              </button>
            </div>
          </div>
        ) : (
          /* Pre-Assessment Form */
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold text-[#255d74] mb-2">Pre-Assessment</h2>
            <p className="text-[#255d74]/60 mb-8">Isi data diri Anda sebelum memulai test</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#255d74]/80 mb-2">Nama Lengkap *</label>
                  <input
                    type="text"
                    {...register('full_name')}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                      errors.full_name ? 'border-red-300' : 'border-gray-200 focus:border-[#255d74]'
                    }`}
                    disabled={startTestMutation.isPending}
                  />
                  {errors.full_name && <p className="mt-1 text-sm text-red-500">{errors.full_name.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#255d74]/80 mb-2">Email *</label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                      errors.email ? 'border-red-300' : 'border-gray-200 focus:border-[#255d74]'
                    }`}
                    disabled={startTestMutation.isPending}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#255d74]/80 mb-2">Usia *</label>
                  <input
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                      errors.age ? 'border-red-300' : 'border-gray-200 focus:border-[#255d74]'
                    }`}
                    disabled={startTestMutation.isPending}
                  />
                  {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#255d74]/80 mb-2">Jenjang Pendidikan *</label>
                  <select
                    {...register('education_level')}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                      errors.education_level ? 'border-red-300' : 'border-gray-200 focus:border-[#255d74]'
                    }`}
                    disabled={startTestMutation.isPending}
                  >
                    <option value="sd_mi">SD/MI</option>
                    <option value="smp_mts">SMP/MTs</option>
                    <option value="sma_ma">SMA/MA</option>
                    <option value="umum">Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#255d74]/80 mb-2">Kelas Saat Ini (opsional)</label>
                  <input
                    type="text"
                    {...register('current_grade')}
                    placeholder="Contoh: 5, 8, 11"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#255d74] transition-all focus:outline-none"
                    disabled={startTestMutation.isPending}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#255d74]/80 mb-2">Minat (opsional)</label>
                  <input
                    type="text"
                    {...register('interests')}
                    placeholder="Pisahkan dengan koma"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#255d74] transition-all focus:outline-none"
                    disabled={startTestMutation.isPending}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#255d74]/80 mb-3">Pengalaman (opsional)</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('experience_ai')} className="w-4 h-4 rounded" disabled={startTestMutation.isPending} />
                    <span className="text-[#255d74]/80">Artificial Intelligence</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('experience_robotics')} className="w-4 h-4 rounded" disabled={startTestMutation.isPending} />
                    <span className="text-[#255d74]/80">Robotika</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('experience_programming')} className="w-4 h-4 rounded" disabled={startTestMutation.isPending} />
                    <span className="text-[#255d74]/80">Programming</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border-2 border-gray-200 text-[#255d74] py-3 rounded-xl font-bold hover:bg-gray-50 transition-all"
                  disabled={startTestMutation.isPending}
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={startTestMutation.isPending}
                  className="flex-1 bg-secondary text-white py-3 rounded-xl font-bold hover:bg-[#e63c1e] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
                >
                  {startTestMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Memulai...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Mulai Test Sekarang
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
