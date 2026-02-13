"use client";

import { useState } from 'react';
import { useAuth } from '@/lib/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { User, Mail, Lock, Save, Loader2 } from 'lucide-react';

const profileSchema = z.object({
    name: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.string().email('Email tidak valid'),
});

const passwordSchema = z.object({
    current_password: z.string().min(1, 'Password lama wajib diisi'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: 'Password tidak cocok',
    path: ['password_confirmation'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

export default function DashboardProfilePage() {
    const { user } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        formState: { errors: passwordErrors },
        reset: resetPassword,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
    });

    const onSubmitProfile = async (data: ProfileFormData) => {
        setIsUpdating(true);
        try {
            // API call to update profile
            toast.success('Profil berhasil diperbarui');
        } catch (error: any) {
            toast.error(error.message || 'Gagal memperbarui profil');
        } finally {
            setIsUpdating(false);
        }
    };

    const onSubmitPassword = async (data: PasswordFormData) => {
        setIsUpdating(true);
        try {
            // API call to update password
            toast.success('Password berhasil diubah');
            resetPassword();
        } catch (error: any) {
            toast.error(error.message || 'Gagal mengubah password');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#255d74] mb-2">Profil Saya</h1>
                <p className="text-[#255d74]/60">Kelola informasi akun Anda</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Info */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
                        <div className="w-24 h-24 bg-[#255d74] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <h3 className="text-xl font-bold text-[#255d74] mb-1">{user?.name}</h3>
                        <p className="text-[#255d74]/60 text-sm mb-4">{user?.email}</p>
                        <span className="inline-block px-4 py-2 bg-[#255d74]/10 text-[#255d74] text-xs font-bold rounded-full">
                            Student
                        </span>
                    </div>
                </div>

                {/* Forms */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Update Profile */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-[#255d74] mb-6 flex items-center gap-2">
                            <User className="w-6 h-6" />
                            Informasi Profil
                        </h2>

                        <form onSubmit={handleSubmitProfile(onSubmitProfile)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-[#255d74]/80 mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    {...registerProfile('name')}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${profileErrors.name ? 'border-red-300' : 'border-gray-200 focus:border-[#255d74]'
                                        }`}
                                    disabled={isUpdating}
                                />
                                {profileErrors.name && (
                                    <p className="mt-2 text-sm text-red-500">{profileErrors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#255d74]/80 mb-2">Email</label>
                                <input
                                    type="email"
                                    {...registerProfile('email')}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${profileErrors.email ? 'border-red-300' : 'border-gray-200 focus:border-[#255d74]'
                                        }`}
                                    disabled={isUpdating}
                                />
                                {profileErrors.email && (
                                    <p className="mt-2 text-sm text-red-500">{profileErrors.email.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full bg-[#255d74] text-white py-3 rounded-xl font-bold hover:bg-[#1e4a5f] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Simpan Perubahan
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-[#255d74] mb-6 flex items-center gap-2">
                            <Lock className="w-6 h-6" />
                            Ubah Password
                        </h2>

                        <form onSubmit={handleSubmitPassword(onSubmitPassword)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-[#255d74]/80 mb-2">Password Lama</label>
                                <input
                                    type="password"
                                    {...registerPassword('current_password')}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${passwordErrors.current_password ? 'border-red-300' : 'border-gray-200 focus:border-[#255d74]'
                                        }`}
                                    disabled={isUpdating}
                                />
                                {passwordErrors.current_password && (
                                    <p className="mt-2 text-sm text-red-500">{passwordErrors.current_password.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#255d74]/80 mb-2">Password Baru</label>
                                <input
                                    type="password"
                                    {...registerPassword('password')}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${passwordErrors.password ? 'border-red-300' : 'border-gray-200 focus:border-[#255d74]'
                                        }`}
                                    disabled={isUpdating}
                                />
                                {passwordErrors.password && (
                                    <p className="mt-2 text-sm text-red-500">{passwordErrors.password.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#255d74]/80 mb-2">Konfirmasi Password Baru</label>
                                <input
                                    type="password"
                                    {...registerPassword('password_confirmation')}
                                    className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${passwordErrors.password_confirmation ? 'border-red-300' : 'border-gray-200 focus:border-[#255d74]'
                                        }`}
                                    disabled={isUpdating}
                                />
                                {passwordErrors.password_confirmation && (
                                    <p className="mt-2 text-sm text-red-500">{passwordErrors.password_confirmation.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full bg-secondary text-white py-3 rounded-xl font-bold hover:bg-[#e63c1e] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-5 h-5" />
                                        Ubah Password
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
