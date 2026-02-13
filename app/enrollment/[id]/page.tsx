"use client";

/**
 * Enrollment Confirmation Page
 */

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { enrollmentsApi, paymentsApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';
import { CheckCircle, Calendar, MapPin, Clock, User, Mail, Phone, CreditCard, Loader2, XCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils/format';

export default function EnrollmentConfirmationPage() {
    const params = useParams();
    const router = useRouter();
    const enrollmentId = params.id as string;

    const { data, isLoading } = useQuery({
        queryKey: ['enrollment', enrollmentId],
        queryFn: () => enrollmentsApi.show(enrollmentId),
    });

    const createPaymentMutation = useMutation({
        mutationFn: () => paymentsApi.create(enrollmentId),
        onSuccess: (response) => {
            toast.success('Invoice pembayaran dibuat!');
            router.push(`/payment/${response.data.payment_id}`);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Gagal membuat invoice');
        },
    });

    const cancelMutation = useMutation({
        mutationFn: (reason: string) => enrollmentsApi.cancel(enrollmentId, reason),
        onSuccess: () => {
            toast.success('Pendaftaran dibatalkan');
            router.push('/dashboard/enrollments');
        },
        onError: (error: any) => {
            toast.error(error.message || 'Gagal membatalkan');
        },
    });

    const enrollment = data?.data?.enrollment;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#eef2f5] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#255d74]" />
            </main>
        );
    }

    if (!enrollment) {
        return (
            <main className="min-h-screen bg-[#eef2f5]">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 py-32 text-center">
                    <p className="text-[#255d74]/60">Pendaftaran tidak ditemukan.</p>
                </div>
                <Footer />
            </main>
        );
    }

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-600',
        confirmed: 'bg-green-100 text-green-600',
        cancelled: 'bg-red-100 text-red-600',
        completed: 'bg-blue-100 text-blue-600',
    };

    return (
        <main className="min-h-screen bg-[#eef2f5]">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-32">
                {/* Success Header */}
                <div className="bg-linear-to-br from-green-500 to-green-600 rounded-[2rem] p-12 text-white mb-8 text-center">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold mb-2">Pendaftaran Berhasil!</h1>
                    <p className="text-white/80 mb-4">Nomor Pendaftaran: {enrollment.enrollment_number}</p>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${statusColors[enrollment.status]}`}>
                        {enrollment.status_label}
                    </span>
                </div>

                {/* Enrollment Details */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-8">
                    <h2 className="text-2xl font-bold text-[#255d74] mb-6">Detail Pendaftaran</h2>

                    {/* Class Info */}
                    <div className="mb-6 pb-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-[#255d74] mb-3">Informasi Kelas</h3>
                        <div className="space-y-2">
                            <p className="text-[#255d74]/80"><span className="font-bold">Kelas:</span> {enrollment.class.name}</p>
                            <p className="text-[#255d74]/80"><span className="font-bold">Program:</span> {enrollment.class.program_name}</p>
                            <p className="text-[#255d74]/80"><span className="font-bold">Level:</span> {enrollment.class.level}</p>
                            <p className="text-[#255d74]/80"><span className="font-bold">Durasi:</span> {enrollment.class.duration_hours} jam</p>
                            <p className="text-[#255d74]/80"><span className="font-bold">Harga:</span> {enrollment.class.price_formatted}</p>
                        </div>
                    </div>

                    {/* Schedule Info */}
                    {enrollment.schedule && (
                        <div className="mb-6 pb-6 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-[#255d74] mb-3">Jadwal</h3>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2 text-[#255d74]/80">
                                    <Calendar className="w-4 h-4" />
                                    {enrollment.schedule.batch_name}
                                </p>
                                <p className="flex items-center gap-2 text-[#255d74]/80">
                                    <Clock className="w-4 h-4" />
                                    {enrollment.schedule.day_of_week}, {enrollment.schedule.time}
                                </p>
                                <p className="flex items-center gap-2 text-[#255d74]/80">
                                    <MapPin className="w-4 h-4" />
                                    {enrollment.schedule.location}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Student Info */}
                    <div className="mb-6 pb-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-[#255d74] mb-3">Data Siswa</h3>
                        <div className="space-y-2">
                            <p className="flex items-center gap-2 text-[#255d74]/80">
                                <User className="w-4 h-4" />
                                {enrollment.student_name}
                            </p>
                            <p className="flex items-center gap-2 text-[#255d74]/80">
                                <Mail className="w-4 h-4" />
                                {enrollment.student_email}
                            </p>
                            <p className="flex items-center gap-2 text-[#255d74]/80">
                                <Phone className="w-4 h-4" />
                                {enrollment.student_phone}
                            </p>
                        </div>
                    </div>

                    {/* Payment Info */}
                    {enrollment.payment && (
                        <div>
                            <h3 className="text-lg font-bold text-[#255d74] mb-3">Status Pembayaran</h3>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-[#255d74]/60">Invoice: {enrollment.payment.invoice_number}</p>
                                    <p className="text-xl font-bold text-[#255d74]">{enrollment.payment.total_amount_formatted}</p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${enrollment.payment.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {enrollment.payment.status_label}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    {enrollment.status === 'pending' && !enrollment.payment && (
                        <button
                            onClick={() => createPaymentMutation.mutate()}
                            disabled={createPaymentMutation.isPending}
                            className="flex-1 bg-[#255d74] text-white py-4 rounded-xl font-bold hover:bg-[#1e4a5f] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-[#255d74]/20"
                        >
                            {createPaymentMutation.isPending ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Memproses...
                                </>
                            ) : (
                                <>
                                    <CreditCard className="w-5 h-5" />
                                    Lanjut ke Pembayaran
                                </>
                            )}
                        </button>
                    )}

                    {enrollment.payment && enrollment.payment.status === 'pending' && (
                        <button
                            onClick={() => router.push(`/payment/${enrollment.payment.id}`)}
                            className="flex-1 bg-[#255d74] text-white py-4 rounded-xl font-bold hover:bg-[#1e4a5f] transition-all flex items-center justify-center gap-2"
                        >
                            <CreditCard className="w-5 h-5" />
                            Lihat Invoice Pembayaran
                        </button>
                    )}

                    {enrollment.status === 'pending' && (
                        <button
                            onClick={() => {
                                const reason = prompt('Alasan pembatalan:');
                                if (reason) cancelMutation.mutate(reason);
                            }}
                            disabled={cancelMutation.isPending}
                            className="px-6 py-4 border-2 border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all flex items-center gap-2"
                        >
                            <XCircle className="w-5 h-5" />
                            Batalkan
                        </button>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
