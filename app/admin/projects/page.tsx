"use client";

import { useEffect, useState } from "react";
import { api, BackendProject } from "@/lib/api";
import Image from "next/image";

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<BackendProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const loadProjects = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filterStatus !== "all") params.append("status", filterStatus);
            if (searchQuery) params.append("search", searchQuery);
            
            const data = await api.projects.listAll(params.toString());
            setProjects(data.results);
        } catch (err) {
            console.error("Failed to load projects:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, [filterStatus, searchQuery]);

    const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
        if (action === 'delete' && !confirm("Are you sure you want to delete this project?")) return;

        try {
            if (action === 'approve') await api.projects.approve(id);
            if (action === 'reject') await api.projects.reject(id);
            if (action === 'delete') await api.projects.delete(id);
            
            // Refresh list
            loadProjects();
        } catch (err) {
            alert(`Failed to ${action} project`);
        }
    };

    return (
        <div className="space-y-8">
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <input
                            type="text"
                            placeholder="Search projects or students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-12 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                        />
                        <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {["all", "PENDING", "APPROVED", "REJECTED"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                                filterStatus === status 
                                ? "bg-primary text-white shadow-lg shadow-primary/10" 
                                : "bg-gray-50 text-primary/40 hover:bg-gray-100"
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-10 py-6">Project Metadata</th>
                                <th className="px-10 py-6">Category</th>
                                <th className="px-10 py-6">Status</th>
                                <th className="px-10 py-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                [1, 2, 3, 4, 5].map(n => (
                                    <tr key={n}>
                                        <td colSpan={4} className="px-10 py-8 animate-pulse text-center text-primary/20 font-bold">Loading submission data...</td>
                                    </tr>
                                ))
                            ) : projects.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-10 py-20 text-center">
                                        <div className="max-w-xs mx-auto space-y-4">
                                            <p className="text-4xl">🪴</p>
                                            <p className="text-primary font-bold">No projects found</p>
                                            <p className="text-primary/40 text-sm">Try adjusting your filters or search query.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : projects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-16 h-12 rounded-xl overflow-hidden shadow-sm shrink-0 border border-gray-100">
                                                <Image src={project.thumbnail || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1470&auto=format&fit=crop"} alt="" fill className="object-cover" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-primary group-hover:text-secondary transition-colors truncate max-w-[200px]">{project.title}</span>
                                                <span className="text-xs text-primary/40 font-medium">By {project.student.full_name}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className="text-xs font-bold text-primary/60 bg-gray-100 px-3 py-1 rounded-full">{project.category_name}</span>
                                    </td>
                                    <td className="px-10 py-6">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                            (project as any).status === 'APPROVED' ? 'bg-emerald-50 text-emerald-500' : 
                                            (project as any).status === 'REJECTED' ? 'bg-red-50 text-red-500' : 
                                            'bg-amber-50 text-amber-500'
                                        }`}>
                                            {(project as any).status || 'PENDING'}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {(project as any).status !== 'APPROVED' && (
                                                <button 
                                                    onClick={() => handleAction(project.id, 'approve')}
                                                    className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                                    title="Approve"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </button>
                                            )}
                                            {(project as any).status !== 'REJECTED' && (
                                                <button 
                                                    onClick={() => handleAction(project.id, 'reject')}
                                                    className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                                                    title="Reject"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                            <button 
                                                onClick={() => handleAction(project.id, 'delete')}
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
        </div>
    );
}
