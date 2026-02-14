"use client";

import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import Image from "next/image";

interface ClassData {
    id: string;
    name: string;
    code: string;
    level: string;
    description: string;
    price: number;
    price_formatted: string;
    capacity: number;
    enrolled_count: number;
    duration_hours: number;
    total_sessions: number;
    image?: string;
    is_active: boolean;
    is_featured: boolean;
    program_name: string;
}

export default function AdminClassesPage() {
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClass, setEditingClass] = useState<ClassData | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState("all");

    // Form state
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [level, setLevel] = useState("BEGINNER");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [capacity, setCapacity] = useState("");
    const [durationHours, setDurationHours] = useState("");
    const [totalSessions, setTotalSessions] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadClasses = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("search", searchQuery);
            if (levelFilter !== "all") params.append("level", levelFilter);
            
            const data = await api.admin.classes.list(params.toString());
            setClasses(data.results);
        } catch (err) {
            console.error("Failed to load classes:", err);
            toast.error("Failed to load classes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadClasses();
    }, [searchQuery, levelFilter]);

    const openModal = (classData?: ClassData) => {
        if (classData) {
            setEditingClass(classData);
            setName(classData.name);
            setCode(classData.code);
            setLevel(classData.level);
            setDescription(classData.description);
            setPrice(classData.price.toString());
            setCapacity(classData.capacity.toString());
            setDurationHours(classData.duration_hours.toString());
            setTotalSessions(classData.total_sessions.toString());
            setImagePreview(classData.image || "");
            setIsActive(classData.is_active);
            setIsFeatured(classData.is_featured);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingClass(null);
        setName("");
        setCode("");
        setLevel("BEGINNER");
        setDescription("");
        setPrice("");
        setCapacity("");
        setDurationHours("");
        setTotalSessions("");
        setImageFile(null);
        setImagePreview("");
        setIsActive(true);
        setIsFeatured(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) {
                toast.error("Image size must be less than 3MB");
                return;
            }
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("code", code);
        formData.append("level", level);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("capacity", capacity);
        formData.append("duration_hours", durationHours);
        formData.append("total_sessions", totalSessions);
        formData.append("is_active", isActive.toString());
        formData.append("is_featured", isFeatured.toString());
        if (imageFile) formData.append("image", imageFile);

        try {
            if (editingClass) {
                await api.admin.classes.update(editingClass.id, formData);
                toast.success("Class updated");
            } else {
                await api.admin.classes.create(formData);
                toast.success("Class created");
            }
            setIsModalOpen(false);
            resetForm();
            loadClasses();
        } catch (err: any) {
            toast.error(err.message || "Failed to save class");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this class? This action cannot be undone.")) return;

        try {
            await api.admin.classes.delete(id);
            toast.success("Class deleted");
            loadClasses();
        } catch (err) {
            toast.error("Failed to delete class");
        }
    };

    const stats = {
        total: classes.length,
        active: classes.filter(c => c.is_active).length,
        featured: classes.filter(c => c.is_featured).length,
        totalCapacity: classes.reduce((sum, c) => sum + c.capacity, 0),
        totalEnrolled: classes.reduce((sum, c) => sum + c.enrolled_count, 0),
    };

    return (
        <div className="space-y-8">
            {/* Header with Stats */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Classes Management</h3>
                        <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">
                            {stats.total} total classes
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-primary text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center gap-2 group"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Class
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Total</p>
                        <p className="text-3xl font-black text-primary">{stats.total}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-green-600/60 uppercase tracking-widest mb-2">Active</p>
                        <p className="text-3xl font-black text-green-600">{stats.active}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-yellow-600/60 uppercase tracking-widest mb-2">Featured</p>
                        <p className="text-3xl font-black text-yellow-600">{stats.featured}</p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-blue-600/60 uppercase tracking-widest mb-2">Capacity</p>
                        <p className="text-3xl font-black text-blue-600">{stats.totalCapacity}</p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-purple-600/60 uppercase tracking-widest mb-2">Enrolled</p>
                        <p className="text-3xl font-black text-purple-600">{stats.totalEnrolled}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                            Search
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                            />
                            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                            Level
                        </label>
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                        >
                            <option value="all">All Levels</option>
                            <option value="BEGINNER">Beginner</option>
                            <option value="INTERMEDIATE">Intermediate</option>
                            <option value="ADVANCED">Advanced</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                </div>
            ) : classes.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center">
                    <p className="text-4xl mb-4">📚</p>
                    <h4 className="text-xl font-bold text-primary mb-2">No classes found</h4>
                    <p className="text-primary/60">Create your first class to get started</p>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-10 py-6">Class</th>
                                    <th className="px-10 py-6">Level</th>
                                    <th className="px-10 py-6">Price</th>
                                    <th className="px-10 py-6">Capacity</th>
                                    <th className="px-10 py-6">Status</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {classes.map((classData) => (
                                    <tr key={classData.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                {classData.image && (
                                                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                                                        <Image
                                                            src={classData.image}
                                                            alt={classData.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-primary">{classData.name}</span>
                                                    <span className="text-xs text-primary/40">{classData.code}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
                                                {classData.level}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="font-bold text-primary">{classData.price_formatted}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-primary">{classData.enrolled_count}/{classData.capacity}</span>
                                                <span className="text-xs text-primary/40">
                                                    {classData.capacity - classData.enrolled_count} slots left
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex gap-2">
                                                {classData.is_active && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-600">
                                                        Active
                                                    </span>
                                                )}
                                                {classData.is_featured && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-600">
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(classData)}
                                                    className="w-10 h-10 bg-gray-50 text-primary/40 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(classData.id)}
                                                    className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="min-h-screen flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => !isSaving && setIsModalOpen(false)} />

                        <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl p-10 md:p-12 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-bold text-primary">
                                    {editingClass ? "Edit Class" : "New Class"}
                                </h3>
                                <button
                                    onClick={() => !isSaving && setIsModalOpen(false)}
                                    disabled={isSaving}
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary/20 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    disabled={isSaving}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Code</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={code}
                                                    onChange={(e) => setCode(e.target.value)}
                                                    disabled={isSaving}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Description</label>
                                            <textarea
                                                required
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                disabled={isSaving}
                                                rows={3}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Level</label>
                                                <select
                                                    value={level}
                                                    onChange={(e) => setLevel(e.target.value)}
                                                    disabled={isSaving}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                                >
                                                    <option value="BEGINNER">Beginner</option>
                                                    <option value="INTERMEDIATE">Intermediate</option>
                                                    <option value="ADVANCED">Advanced</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Price (IDR)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    disabled={isSaving}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Capacity</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={capacity}
                                                    onChange={(e) => setCapacity(e.target.value)}
                                                    disabled={isSaving}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Duration (Hours)</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={durationHours}
                                                    onChange={(e) => setDurationHours(e.target.value)}
                                                    disabled={isSaving}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Sessions</label>
                                                <input
                                                    type="number"
                                                    required
                                                    value={totalSessions}
                                                    onChange={(e) => setTotalSessions(e.target.value)}
                                                    disabled={isSaving}
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isActive}
                                                    onChange={(e) => setIsActive(e.target.checked)}
                                                    disabled={isSaving}
                                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-secondary"
                                                />
                                                <span className="text-sm font-bold text-primary">Active</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={isFeatured}
                                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                                    disabled={isSaving}
                                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-secondary"
                                                />
                                                <span className="text-sm font-bold text-primary">Featured</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Image (Max 3MB)</label>
                                        <div
                                            onClick={() => !isSaving && fileInputRef.current?.click()}
                                            className="w-full aspect-square bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group"
                                        >
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                            ) : (
                                                <div className="text-center space-y-2">
                                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform">
                                                        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                    <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Upload</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="hidden"
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                accept="image/*"
                                                disabled={isSaving}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        disabled={isSaving}
                                        className="flex-1 bg-gray-50 text-primary font-bold py-5 rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="flex-1 bg-primary text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary transition-all uppercase tracking-widest text-xs disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            editingClass ? "Save Changes" : "Create Class"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
