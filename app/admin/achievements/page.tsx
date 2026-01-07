"use client";

import { useEffect, useState, useRef } from "react";
import { api, BackendAchievement } from "@/lib/api";
import Image from "next/image";

export default function AdminAchievementsPage() {
    const [achievements, setAchievements] = useState<BackendAchievement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAchievement, setEditingAchievement] = useState<BackendAchievement | null>(null);
    
    // Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState<BackendAchievement['category']>("Competition");
    const [date, setDate] = useState("");
    const [link, setLink] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");
    
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadAchievements = async () => {
        setIsLoading(true);
        try {
            const data = await api.achievements.list();
            setAchievements(data.results);
        } catch (err) {
            console.error("Failed to load achievements:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAchievements();
    }, []);

    const openModal = (achievement?: BackendAchievement) => {
        if (achievement) {
            setEditingAchievement(achievement);
            setTitle(achievement.title);
            setDescription(achievement.description);
            setCategory(achievement.category);
            setDate(achievement.date);
            setLink(achievement.link || "");
            setImagePreview(achievement.image);
        } else {
            setEditingAchievement(null);
            setTitle("");
            setDescription("");
            setCategory("Competition");
            setDate("");
            setLink("");
            setImagePreview("");
        }
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("date", date);
        if (link) formData.append("link", link);
        if (imageFile) formData.append("image", imageFile);

        try {
            if (editingAchievement) {
                await api.achievements.update(editingAchievement.id, formData);
            } else {
                await api.achievements.create(formData);
            }
            setIsModalOpen(false);
            loadAchievements();
        } catch (err) {
            alert("Failed to save achievement");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this achievement?")) return;
        try {
            await api.achievements.delete(id);
            loadAchievements();
        } catch (err) {
            alert("Failed to delete achievement");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-primary">Milestones & Recognitions</h3>
                <button 
                    onClick={() => openModal()}
                    className="bg-primary text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8m0 0v8m0-8h8m-8 0H4" />
                    </svg>
                    New Achievement
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    [1, 2, 3].map(n => (
                        <div key={n} className="bg-white rounded-[2.5rem] h-80 animate-pulse border border-gray-100 shadow-sm" />
                    ))
                ) : achievements.map((ach) => (
                    <div key={ach.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                        <div className="relative h-48 overflow-hidden">
                            <Image src={ach.image || "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=2074&auto=format&fit=crop"} alt="" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-4 left-4">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    ach.category === 'Competition' ? 'bg-secondary text-white' : 
                                    ach.category === 'Partnership' ? 'bg-primary text-white' : 
                                    'bg-white/90 text-primary backdrop-blur-sm'
                                }`}>
                                    {ach.category}
                                </span>
                            </div>
                        </div>
                        <div className="p-8 space-y-4">
                            <div>
                                <h4 className="font-bold text-primary text-lg line-clamp-1 group-hover:text-secondary transition-colors">{ach.title}</h4>
                                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest">{ach.date}</p>
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => openModal(ach)}
                                    className="flex-1 bg-gray-50 text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-all text-xs"
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(ach.id)}
                                    className="px-4 bg-red-50 text-red-500 font-bold py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all text-xs"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="min-h-screen flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        
                        <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 md:p-12 animate-in fade-in zoom-in duration-300">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-bold text-primary">{editingAchievement ? "Edit Achievement" : "Add Achievement"}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary/20 hover:text-red-500 hover:bg-red-50 transition-all">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium"
                                                placeholder="Innovation Award 2024"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Category</label>
                                            <select
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value as any)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium"
                                            >
                                                <option value="Competition">Competition</option>
                                                <option value="Recognition">Recognition</option>
                                                <option value="Partnership">Partnership</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Date</label>
                                            <input
                                                type="text"
                                                required
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium"
                                                placeholder="January 2024"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Cover Image</label>
                                            <div 
                                                onClick={() => fileInputRef.current?.click()}
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
                                                        <p className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Upload Photo</p>
                                                    </div>
                                                )}
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    ref={fileInputRef} 
                                                    onChange={handleFileChange} 
                                                    accept="image/*"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Description</label>
                                    <textarea
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] px-8 py-6 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium leading-relaxed"
                                        placeholder="Describe the achievement in detail..."
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 bg-gray-50 text-primary font-bold py-5 rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-xs"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit"
                                        className="flex-1 bg-primary text-white font-bold py-5 rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary transition-all uppercase tracking-widest text-xs"
                                    >
                                        {editingAchievement ? "Save Changes" : "Create Milestone"}
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
