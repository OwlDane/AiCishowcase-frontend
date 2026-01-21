"use client";

import { useState, useEffect } from "react";
import { api, BackendArticle } from "@/lib/api";
import Image from "next/image";

/**
 * Admin Articles Page - Kelola artikel/berita
 */

export default function AdminArticlesPage() {
    const [articles, setArticles] = useState<BackendArticle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await api.content.articles();
            setArticles(data.results);
        } catch (error) {
            console.error("Failed to fetch articles:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Articles</h1>
                    <p className="text-primary/60">Kelola artikel dan berita</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-bold hover:opacity-90 transition-all flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tulis Artikel
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-wider">Thumbnail</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-wider">Judul</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-wider">Author</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-wider">Status</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-wider">Tanggal</th>
                            <th className="text-right px-6 py-4 text-xs font-bold text-primary/40 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-primary/40">Loading...</td>
                            </tr>
                        ) : articles.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-primary/40">
                                    Belum ada artikel. Klik "Tulis Artikel" untuk menambahkan.
                                </td>
                            </tr>
                        ) : (
                            articles.map((article) => (
                                <tr key={article.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="relative w-16 h-12 rounded-lg overflow-hidden">
                                            <Image src={article.thumbnail} alt={article.title} fill className="object-cover" sizes="64px" />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="font-bold text-primary line-clamp-1">{article.title}</p>
                                        <p className="text-primary/40 text-xs">{article.slug}</p>
                                    </td>
                                    <td className="px-6 py-4 text-primary/60">{article.author}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                            article.published_at ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {article.published_at ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-primary/60 text-sm">
                                        {article.published_at ? new Date(article.published_at).toLocaleDateString('id-ID') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary/40 hover:text-primary mr-4">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button className="text-red-400 hover:text-red-600">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4">
                        <h2 className="text-xl font-bold text-primary mb-6">Tulis Artikel</h2>
                        <p className="text-primary/60 mb-4">Form fields: title, slug (auto), excerpt, content (rich text), thumbnail (upload), author, status</p>
                        <div className="flex gap-4 justify-end">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50">Batal</button>
                            <button className="px-6 py-2 bg-gray-200 text-primary rounded-xl font-bold">Simpan Draft</button>
                            <button className="px-6 py-2 bg-secondary text-white rounded-xl font-bold">Publish</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
