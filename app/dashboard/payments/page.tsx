"use client";

import { CreditCard, Download, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDateTime } from '@/lib/utils/format';

export default function DashboardPaymentsPage() {
    // Mock data - replace with actual API call
    const payments: any[] = [];
    const isLoading = false;

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-600',
        paid: 'bg-green-100 text-green-600',
        failed: 'bg-red-100 text-red-600',
        expired: 'bg-gray-100 text-gray-600',
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#255d74] mb-2">Riwayat Pembayaran</h1>
                <p className="text-[#255d74]/60">Lihat semua transaksi pembayaran Anda</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-[#255d74]" />
                </div>
            ) : payments.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center">
                    <CreditCard className="w-16 h-16 text-[#255d74]/20 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-[#255d74] mb-2">Belum Ada Pembayaran</h3>
                    <p className="text-[#255d74]/60">Riwayat pembayaran Anda akan muncul di sini</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#255d74]/60 uppercase tracking-wider">
                                    Invoice
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#255d74]/60 uppercase tracking-wider">
                                    Kelas
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#255d74]/60 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#255d74]/60 uppercase tracking-wider">
                                    Total
                                </th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-[#255d74]/60 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="text-right px-6 py-4 text-xs font-bold text-[#255d74]/60 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {payments.map((payment: any) => (
                                <tr key={payment.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-[#255d74]">{payment.invoice_number}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-[#255d74]">{payment.class_name}</p>
                                    </td>
                                    <td className="px-6 py-4 text-[#255d74]/60 text-sm">
                                        {formatDateTime(payment.created_at)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-[#255d74]">{formatCurrency(payment.total_amount)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[payment.status]}`}>
                                            {payment.status_label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/payment/${payment.id}`}
                                                className="p-2 text-[#255d74] hover:bg-[#255d74]/5 rounded-lg transition-all"
                                                title="Lihat Detail"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            {payment.status === 'paid' && (
                                                <button
                                                    onClick={() => window.open(`/api/payments/${payment.id}/receipt`, '_blank')}
                                                    className="p-2 text-[#255d74] hover:bg-[#255d74]/5 rounded-lg transition-all"
                                                    title="Download Receipt"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
