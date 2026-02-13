"use client";

/**
 * Class Detail & Enrollment Page
 */

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classesApi, enrollmentsApi } from "@/lib/api";
import { useAuth } from "@/lib/hooks/use-auth";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Clock,
    Users,
    Award,
    Calendar,
    MapPin,
    Loader2,
    CheckCircle,
    AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/format";

const enrollmentSchema = z.object({
    schedule_id: z.string().min(1, "Pilih jadwal"),
    student_name: z.string().min(3, "Nama minimal 3 karakter"),
    student_email: z.string().email("Email tidak valid"),
    student_phone: z.string().min(10, "Nomor telepon tidak valid"),
    student_age: z.number().min(5, "Usia minimal 5 tahun"),
    student_grade: z.string().optional(),
    parent_name: z.string().optional(),
    parent_phone: z.string().optional(),
    parent_email: z
        .string()
        .email("Email tidak valid")
        .optional()
        .or(z.literal("")),
    special_requirements: z.string().optional(),
});

type EnrollmentFormData = z.infer<typeof enrollmentSchema>;

export default function ClassDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);

    const slug = params.slug as string;

    const { data: classData, isLoading } = useQuery({
        queryKey: ["class", slug],
        queryFn: () => classesApi.show(slug),
    });

    const { data: enrollmentData } = useQuery({
        queryKey: ["enrollment-form", classData?.data?.id],
        queryFn: () => enrollmentsApi.create(classData?.data?.id),
        enabled: !!classData?.data?.id && showEnrollmentForm,
    });

    const classItem = classData?.data;
    const schedules = enrollmentData?.data?.schedules || [];

    const enrollMutation = useMutation({
        mutationFn: (data: EnrollmentFormData) => {
            const payload = {
                ...data,
                class_id: classItem.id,
            };
            return enrollmentsApi.store(payload);
        },
        onSuccess: (response) => {
            toast.success("Pendaftaran berhasil!");
            router.push(`/enrollment/${response.data.enrollment_id}`);
        },
        onError: (error: any) => {
            toast.error(error.message || "Pendaftaran gagal");
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<EnrollmentFormData>({
        resolver: zodResolver(enrollmentSchema),
        defaultValues: {
            student_name: user?.name || "",
            student_email: user?.email || "",
            student_age: 0,
        },
    });

    const onSubmit = (data: EnrollmentFormData) => {
        if (!isAuthenticated) {
            toast.error("Silakan login terlebih dahulu");
            router.push("/login");
            return;
        }
        enrollMutation.mutate(data);
    };

    if (isLoading) {
        return (
            <main className="min-h-screen bg-[#eef2f5] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-[#255d74]" />
            </main>
        );
    }

    if (!classItem) {
        return (
            <main className="min-h-screen bg-[#eef2f5]">
                <Navbar />
                <div className="max-w-4xl mx-auto px-6 py-32 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-[#255d74] mb-2">
                        Kelas Tidak Ditemukan
                    </h1>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#eef2f5]">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-32">
                {!showEnrollmentForm ? (
                    <>
                        {/* Class Header */}
                        <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100 mb-8">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-bold rounded-full mb-3">
                                        {classItem.program_name}
                                    </span>
                                    <h1 className="text-4xl font-bold text-[#255d74] mb-4">
                                        {classItem.name}
                                    </h1>
                                    <p className="text-xl text-[#255d74]/80 leading-relaxed">
                                        {classItem.description}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                                <div className="flex flex-col items-center p-4 bg-[#255d74]/5 rounded-xl">
                                    <Clock className="w-6 h-6 text-[#255d74] mb-2" />
                                    <span className="text-sm text-[#255d74]/60">Durasi</span>
                                    <span className="text-lg font-bold text-[#255d74]">
                                        {classItem.duration_hours}h
                                    </span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-[#255d74]/5 rounded-xl">
                                    <Users className="w-6 h-6 text-[#255d74] mb-2" />
                                    <span className="text-sm text-[#255d74]/60">Kapasitas</span>
                                    <span className="text-lg font-bold text-[#255d74]">
                                        {classItem.capacity}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-[#255d74]/5 rounded-xl">
                                    <Award className="w-6 h-6 text-[#255d74] mb-2" />
                                    <span className="text-sm text-[#255d74]/60">Level</span>
                                    <span className="text-lg font-bold text-[#255d74]">
                                        {classItem.level}
                                    </span>
                                </div>
                                <div className="flex flex-col items-center p-4 bg-[#255d74]/5 rounded-xl">
                                    <span className="text-2xl mb-2">💰</span>
                                    <span className="text-sm text-[#255d74]/60">Harga</span>
                                    <span className="text-lg font-bold text-[#255d74]">
                                        {classItem.price_formatted}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowEnrollmentForm(true)}
                                className="w-full mt-8 bg-secondary text-white py-4 rounded-xl font-bold hover:bg-[#e63c1e] transition-all shadow-lg shadow-secondary/20"
                            >
                                Daftar Sekarang
                            </button>
                        </div>

                        {/* Curriculum */}
                        {classItem.curriculum && classItem.curriculum.length > 0 && (
                            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 mb-8">
                                <h2 className="text-2xl font-bold text-[#255d74] mb-6">
                                    Kurikulum
                                </h2>
                                <ul className="space-y-3">
                                    {classItem.curriculum.map((item: string, index: number) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <span className="text-[#255d74]/80">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </>
                ) : (
                    /* Enrollment Form */
                    <div className="bg-white rounded-[2.5rem] p-12 shadow-sm border border-gray-100">
                        <h2 className="text-3xl font-bold text-[#255d74] mb-2">
                            Form Pendaftaran
                        </h2>
                        <p className="text-[#255d74]/60 mb-8">
                            Lengkapi data berikut untuk mendaftar kelas {classItem.name}
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {/* Schedule Selection */}
                            <div>
                                <label className="block text-sm font-bold text-[#255d74]/80 mb-3">
                                    Pilih Jadwal *
                                </label>
                                <div className="space-y-3">
                                    {schedules.map((schedule: any) => (
                                        <label
                                            key={schedule.id}
                                            className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#255d74] transition-all"
                                        >
                                            <input
                                                type="radio"
                                                value={schedule.id}
                                                {...register("schedule_id")}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <p className="font-bold text-[#255d74]">
                                                    {schedule.batch_name}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-[#255d74]/60 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {schedule.start_date}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {schedule.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {schedule.location}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-green-600 mt-1">
                                                    {schedule.remaining_slots} slot tersisa
                                                </p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.schedule_id && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {errors.schedule_id.message}
                                    </p>
                                )}
                            </div>

                            {/* Student Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#255d74]/80 mb-2">
                                        Nama Siswa *
                                    </label>
                                    <input
                                        type="text"
                                        {...register("student_name")}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${errors.student_name
                                                ? "border-red-300"
                                                : "border-gray-200 focus:border-[#255d74]"
                                            }`}
                                    />
                                    {errors.student_name && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.student_name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#255d74]/80 mb-2">
                                        Email Siswa *
                                    </label>
                                    <input
                                        type="email"
                                        {...register("student_email")}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${errors.student_email
                                                ? "border-red-300"
                                                : "border-gray-200 focus:border-[#255d74]"
                                            }`}
                                    />
                                    {errors.student_email && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.student_email.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#255d74]/80 mb-2">
                                        No. Telepon Siswa *
                                    </label>
                                    <input
                                        type="tel"
                                        {...register("student_phone")}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${errors.student_phone
                                                ? "border-red-300"
                                                : "border-gray-200 focus:border-[#255d74]"
                                            }`}
                                    />
                                    {errors.student_phone && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.student_phone.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-[#255d74]/80 mb-2">
                                        Usia *
                                    </label>
                                    <input
                                        type="number"
                                        {...register("student_age", { valueAsNumber: true })}
                                        className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${errors.student_age
                                                ? "border-red-300"
                                                : "border-gray-200 focus:border-[#255d74]"
                                            }`}
                                    />
                                    {errors.student_age && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.student_age.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Parent Info (Optional) */}
                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-lg font-bold text-[#255d74] mb-4">
                                    Data Orang Tua (Opsional)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-[#255d74]/80 mb-2">
                                            Nama Orang Tua
                                        </label>
                                        <input
                                            type="text"
                                            {...register("parent_name")}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#255d74] transition-all focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-[#255d74]/80 mb-2">
                                            No. Telepon Orang Tua
                                        </label>
                                        <input
                                            type="tel"
                                            {...register("parent_phone")}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#255d74] transition-all focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Special Requirements */}
                            <div>
                                <label className="block text-sm font-bold text-[#255d74]/80 mb-2">
                                    Kebutuhan Khusus (Opsional)
                                </label>
                                <textarea
                                    {...register("special_requirements")}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#255d74] transition-all focus:outline-none resize-none"
                                    rows={3}
                                    placeholder="Contoh: Alergi, kebutuhan aksesibilitas, dll."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowEnrollmentForm(false)}
                                    className="flex-1 border-2 border-gray-200 text-[#255d74] py-4 rounded-xl font-bold hover:bg-gray-50 transition-all"
                                    disabled={enrollMutation.isPending}
                                >
                                    Kembali
                                </button>
                                <button
                                    type="submit"
                                    disabled={enrollMutation.isPending}
                                    className="flex-1 bg-secondary text-white py-4 rounded-xl font-bold hover:bg-[#e63c1e] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
                                >
                                    {enrollMutation.isPending ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        "Daftar Sekarang"
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
