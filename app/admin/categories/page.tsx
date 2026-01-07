"use client";

import { useEffect, useState } from "react";
import { api, BackendCategory } from "@/lib/api";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<BackendCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<BackendCategory | null>(null);
    
    // Form state
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const loadCategories = async () => {
        setIsLoading(true);
        try {
            const data = await api.projects.categories();
            setCategories(data.results);
        } catch (err) {
            console.error("Failed to load categories:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    const openModal = (category?: BackendCategory) => {
        if (category) {
            setEditingCategory(category);
            setName(category.name);
            setDescription(category.description || "");
        } else {
            setEditingCategory(null);
            setName("");
            setDescription("");
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = { name, description };
            if (editingCategory) {
                await api.projects.updateCategory(editingCategory.id, data);
            } else {
                await api.projects.createCategory(data);
            }
            setIsModalOpen(false);
            loadCategories();
        } catch (err) {
            alert("Failed to save category");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        try {
            await api.projects.deleteCategory(id);
            loadCategories();
        } catch (err) {
            alert("Failed to delete category");
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-primary tracking-tight">Project Classifications</h3>
                    <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">Organize submissions by domain</p>
                </div>
                <button 
                    onClick={() => openModal()}
                    className="bg-primary text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center gap-2 group"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {isLoading ? (
                    [1, 2, 3].map(n => (
                        <div key={n} className="bg-white rounded-[3rem] h-64 animate-pulse border border-gray-100 shadow-sm" />
                    ))
                ) : categories.map((cat) => (
                    <div key={cat.id} className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm flex flex-col justify-between group hover:border-secondary transition-all duration-500">
                        <div className="space-y-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all duration-500">
                                <span className="font-bold text-lg">{cat.name[0]}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-primary text-xl tracking-tight">{cat.name}</h4>
                                <p className="text-primary/60 text-sm leading-relaxed mt-2 line-clamp-3 font-medium">{cat.description || "No description provided for this category."}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-8">
                            <button 
                                onClick={() => openModal(cat)}
                                className="flex-1 bg-gray-50 text-primary font-bold py-3 rounded-xl hover:bg-primary hover:text-white transition-all text-[10px] uppercase tracking-widest"
                            >
                                Edit Settings
                            </button>
                            <button 
                                onClick={() => handleDelete(cat.id)}
                                className="px-4 bg-red-50 text-red-500 font-bold py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[10px] uppercase tracking-widest"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal placeholder */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="min-h-screen flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                        <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl p-10 animate-in slide-in-from-bottom-8 duration-500">
                            <h3 className="text-2xl font-bold text-primary mb-8">{editingCategory ? "Edit Category" : "New Category"}</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] ml-1">Category Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-bold"
                                        placeholder="e.g. Artificial Intelligence"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-primary/40 uppercase tracking-[0.2em] ml-1">Description</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary/60 font-medium"
                                        placeholder="What kind of projects belong here?"
                                    />
                                </div>
                                <div className="flex gap-4 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-50 text-primary font-bold py-4 rounded-xl text-xs uppercase tracking-widest">Cancel</button>
                                    <button type="submit" className="flex-1 bg-primary text-white font-bold py-4 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-secondary transition-all">Save Category</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
