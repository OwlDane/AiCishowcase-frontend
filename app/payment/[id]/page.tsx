"use client";

/**
 * Payment Invoice Page
 */

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';
import { CreditCard, Clock, CheckCircle, AlertCircle, Loader2, RefreshCw, Download } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';

export default function PaymentInvoicePage() {
    const params = useParams();
    const router = useRouter();
    const paymentId = params.id as string;

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['payment', paymentId],
        queryFn: () => paymentsApi.show(paymentId),
        refetchInterval: (query) => {
            // Auto-refresh every 10s if payment is pending
            return query.state.data?.data?.payment?.status === 'pending' ? 10000 : false;
        },
    });

    const checkStatusMutation = useMutation({
        mutationFn: () => paymentsApi.checkStatus(paymentId),
        onSuccess: () => {
            toast.success('Status diperbarui');
            refetch();
        },
        onError: (error: any) => {
            toast.error(error.message || 'Gagal memeriksa status');
        },
    });

    const payment = data?.data?.payment;
    const enrollment = data?.data?.enrollment;
    const courseClass = data?.data?.courseClass;

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#eef2f5] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#255d74]" />
            </main>
        );
    }

    if (!payment) {
        return (
            <main className="min-h-screen bg-[#eef2f5]">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 py-32 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-[#255d74]/60">Invoice tidak ditemukan.</p>
                </div>
                <Footer />
            </main>
        );
    }

    const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
        pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        paid: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        failed: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        expired: { icon: AlertCircle, color: 'text-gray-600', bg: 'bg-gray-50' },
    };

    const config = statusConfig[payment.status] || statusConfig.pending;
    const StatusIcon = config.icon;

    return (
        <main className="min-h-screen bg-[#eef2f5]">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 py-32">
                {/* Status Header */}
                <div className={`${config.bg} rounded-[2rem] p-8 mb-8 text-center border-2 ${config.color.replace('text-', 'border-')}`}>
                    <StatusIcon className={`w-16 h-16 mx-auto mb-4 ${config.color}`} />
                    <h1 className="text-2xl font-bold text-[#255d74] mb-2">
                        {payment.status === 'paid' ? 'Pembayaran Berhasil!' :
                            payment.status === 'pending' ? 'Menunggu Pembayaran' :
                                payment.status === 'failed' ? 'Pembayaran Gagal' : 'Invoice Expired'}
                    </h1>
                    <p className="text-[#255d74]/60">Invoice: {payment.invoice_number}</p>
                </div>

                {/* Invoice Details */}
                <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-8">
                    <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-2xl font-bold text-[#255d74]">Invoice Pembayaran</h2>
                            <p className="text-[#255d74]/60 text-sm mt-1">
                                Dibuat: {payment.created_at_formatted}
                            </p>
                        </div>
                        <button
                            onClick={() => checkStatusMutation.mutate()}
                            disabled={checkStatusMutation.isPending}
                            className="flex items-center gap-2 px-4 py-2 border-2 border-gray-200 rounded-xl text-sm font-bold text-[#255d74] hover:bg-gray-50 transition-all"
                        >
                            <RefreshCw className={`w-4 h-4 ${checkStatusMutation.isPending ? 'animate-spin' : ''}`} />
                            Refresh Status
                        </button>
                    </div>

                    {/* Class Info */}
                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-[#255d74]/60 uppercase tracking-wider mb-3">Detail Kelas</h3>
                        <p className="text-lg font-bold text-[#255d74]">{courseClass?.name}</p>
                        <p className="text-[#255d74]/60">{courseClass?.program_name}</p>
                    </div>

                    {/* Payment Breakdown */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
                        <div className="flex justify-between">
                            <span className="text-[#255d74]/80">Harga Kelas</span>
                            <span className="font-bold text-[#255d74]">{payment.amount_formatted}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-[#255d74]/80">Biaya Admin</span>
                            <span className="font-bold text-[#255d74]">{payment.admin_fee_formatted}</span>
                        </div>
                        <div className="flex justify-between text-xl pt-3 border-t border-gray-100">
                            <span className="font-bold text-[#255d74]">Total</span>
                            <span className="font-bold text-[#255d74]">{payment.total_amount_formatted}</span>
                        </div>
                    </div>

                    {/* Payment Info */}
                    {payment.expired_at && payment.status === 'pending' && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-yellow-800">
                                <Clock className="w-4 h-4 inline mr-2" />
                                Invoice akan expired pada: {payment.expired_at_formatted}
                            </p>
                        </div>
                    )}

                    {payment.paid_at && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-green-800">
                                <CheckCircle className="w-4 h-4 inline mr-2" />
                                Dibayar pada: {payment.paid_at_formatted}
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                    {payment.status === 'pending' && payment.xendit_invoice_url && (
                        <a
                            href={payment.xendit_invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-[#255d74] text-white py-4 rounded-xl font-bold hover:bg-[#1e4a5f] transition-all text-center flex items-center justify-center gap-2 shadow-lg shadow-[#255d74]/20"
                        >
                            <CreditCard className="w-5 h-5" />
                            Bayar Sekarang
                        </a>
                    )}

                    {payment.status === 'paid' && (
                        <>
                            <button
                                onClick={() => window.open(paymentsApi.downloadReceipt(paymentId), '_blank')}
                                className="flex-1 bg-[#255d74] text-white py-4 rounded-xl font-bold hover:bg-[#1e4a5f] transition-all flex items-center justify-center gap-2"
                            >
                                <Download className="w-5 h-5" />
                                Download Bukti Pembayaran
                            </button>
                            <button
                                onClick={() => router.push('/dashboard/enrollments')}
                                className="px-6 py-4 border-2 border-gray-200 text-[#255d74] rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Lihat Pendaftaran
                            </button>
                        </>
                    )}

                    {(payment.status === 'failed' || payment.status === 'expired') && (
                        <button
                            onClick={() => router.push(`/enrollment/${enrollment?.id}`)}
                            className="flex-1 bg-[#255d74] text-white py-4 rounded-xl font-bold hover:bg-[#1e4a5f] transition-all"
                        >
                            Kembali ke Pendaftaran
                        </button>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    );
}
