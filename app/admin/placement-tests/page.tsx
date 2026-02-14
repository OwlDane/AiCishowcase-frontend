"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import Link from "next/link";

interface PlacementTest {
    id: string;
    title: string;
    slug: string;
    education_level: string;
    duration_minutes: number;
    total_questions: number;
    passing_score: number;
    is_active: boolean;
    attempts_count?: number;
    avg_score?: number;
}

export default function AdminPlacementTestsPage() {
    const [tests, setTests] = useState<PlacementTest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTest, setEditingTest] = useState<PlacementTest | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [levelFilter, setLevelFilter] = useState("all");

    // Form state
    const [title, setTitle] = useState("");
    const [educationLevel, setEducationLevel] = useState("SD");
    const [durationMinutes, setDurationMinutes] = useState("");
    const [passingScore, setPassingScore] = useState("");
    const [description, setDescription] = useState("");
    const [instructions, setInstructions] = useState("");
    const [isActive, setIsActive] = useState(true);
    const [showResultImmediately, setShowResultImmediately] = useState(true);
    const [allowRetake, setAllowRetake] = useState(true);

    const loadTests = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("search", searchQuery);
            if (levelFilter !== "all") params.append("education_level", levelFilter);
            
            const data = await api.admin.placementTests.list(params.toString());
            setTests(data.results);
        } catch (err) {
            console.error("Failed to load tests:", err);
            toast.error("Failed to load placement tests");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTests();
    }, [searchQuery, levelFilter]);

    const openModal = (test?: PlacementTest) => {
        if (test) {
            setEditingTest(test);
            setTitle(test.title);
            setEducationLevel(test.education_level);
            setDurationMinutes(test.duration_minutes.toString());
            setPassingScore(test.passing_score.toString());
            setIsActive(test.is_active);
        } else {
            resetForm();
        }
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingTest(null);
        setTitle("");
        setEducationLevel("SD");
        setDurationMinutes("");
        setPassingScore("");
        setDescription("");
        setInstructions("");
        setIsActive(true);
        setShowResultImmediately(true);
        setAllowRetake(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const data = {
            title,
            education_level: educationLevel,
            duration_minutes: parseInt(durationMinutes),
            passing_score: parseInt(passingScore),
            description,
            instructions,
            is_active: isActive,
            show_result_immediately: showResultImmediately,
            allow_retake: allowRetake,
        };

        try {
            if (editingTest) {
                await api.admin.placementTests.update(editingTest.id, data);
                toast.success("Test updated");
            } else {
                await api.admin.placementTests.create(data);
                toast.success("Test created");
            }
            setIsModalOpen(false);
            resetForm();
            loadTests();
        } catch (err: any) {
            toast.error(err.message || "Failed to save test");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this test? This will also delete all questions and attempts.")) return;

        try {
            await api.admin.placementTests.delete(id);
            toast.success("Test deleted");
            loadTests();
        } catch (err) {
            toast.error("Failed to delete test");
        }
    };

    const stats = {
        total: tests.length,
        active: tests.filter(t => t.is_active).length,
        totalAttempts: tests.reduce((sum, t) => sum + (t.attempts_count || 0), 0),
        avgScore: tests.length > 0 
            ? Math.round(tests.reduce((sum, t) => sum + (t.avg_score || 0), 0) / tests.length)
            : 0,
    };

    return (
        <div className="space-y-8">
            {/* Header with Stats */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Placement Tests Management</h3>
                        <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">
                            {stats.total} placement tests
                        </p>
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="bg-primary text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-primary/20 hover:bg-secondary transition-all flex items-center gap-2 group"
                    >
                        <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        New Test
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Total Tests</p>
                        <p className="text-3xl font-black text-primary">{stats.total}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-green-600/60 uppercase tracking-widest mb-2">Active</p>
                        <p className="text-3xl font-black text-green-600">{stats.active}</p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-blue-600/60 uppercase tracking-widest mb-2">Total Attempts</p>
                        <p className="text-3xl font-black text-blue-600">{stats.totalAttempts}</p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-purple-600/60 uppercase tracking-widest mb-2">Avg Score</p>
                        <p className="text-3xl font-black text-purple-600">{stats.avgScore}%</p>
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
                                placeholder="Search by title..."
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
                            Education Level
                        </label>
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                        >
                            <option value="all">All Levels</option>
                            <option value="SD">SD (Elementary)</option>
                            <option value="SMP">SMP (Junior High)</option>
                            <option value="SMA">SMA (Senior High)</option>
                            <option value="UMUM">Umum (General)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                </div>
            ) : tests.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center">
                    <p className="text-4xl mb-4">📝</p>
                    <h4 className="text-xl font-bold text-primary mb-2">No tests found</h4>
                    <p className="text-primary/60">Create your first placement test to get started</p>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-10 py-6">Test</th>
                                    <th className="px-10 py-6">Level</th>
                                    <th className="px-10 py-6">Questions</th>
                                    <th className="px-10 py-6">Duration</th>
                                    <th className="px-10 py-6">Attempts</th>
                                    <th className="px-10 py-6">Avg Score</th>
                                    <th className="px-10 py-6">Status</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {tests.map((test) => (
                                    <tr key={test.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-primary">{test.title}</span>
                                                <span className="text-xs text-primary/40">{test.slug}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600">
                                                {test.education_level}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-2xl font-black text-primary">{test.total_questions}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="font-bold text-primary">{test.duration_minutes} min</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-xl font-black text-blue-600">{test.attempts_count || 0}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-xl font-black text-purple-600">{test.avg_score || 0}%</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                test.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {test.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/placement-tests/${test.id}/questions`}
                                                    className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                                                    title="Manage Questions"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                                    </svg>
                                                </Link>
                                                <Link
                                                    href={`/admin/placement-tests/${test.id}/attempts`}
                                                    className="w-10 h-10 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center hover:bg-purple-500 hover:text-white transition-all shadow-sm"
                                                    title="View Attempts"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                </Link>
                                                <button
                                                    onClick={() => openModal(test)}
                                                    className="w-10 h-10 bg-gray-50 text-primary/40 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                                                    title="Edit"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(test.id)}
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

                        <div className="relative bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl p-10 md:p-12 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-bold text-primary">
                                    {editingTest ? "Edit Test" : "New Placement Test"}
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
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Title</label>
                                        <input
                                            type="text"
                                            required
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            disabled={isSaving}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                            placeholder="e.g., Placement Test SD Kelas 4-6"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Education Level</label>
                                            <select
                                                value={educationLevel}
                                                onChange={(e) => setEducationLevel(e.target.value)}
                                                disabled={isSaving}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                            >
                                                <option value="SD">SD (Elementary)</option>
                                                <option value="SMP">SMP (Junior High)</option>
                                                <option value="SMA">SMA (Senior High)</option>
                                                <option value="UMUM">Umum (General)</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Duration (Minutes)</label>
                                            <input
                                                type="number"
                                                required
                                                value={durationMinutes}
                                                onChange={(e) => setDurationMinutes(e.target.value)}
                                                disabled={isSaving}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                                placeholder="30"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Passing Score (%)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max="100"
                                            value={passingScore}
                                            onChange={(e) => setPassingScore(e.target.value)}
                                            disabled={isSaving}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                            placeholder="70"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Description</label>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            disabled={isSaving}
                                            rows={3}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                            placeholder="Brief description of the test..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1">Instructions</label>
                                        <textarea
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                            disabled={isSaving}
                                            rows={4}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-primary font-medium disabled:opacity-50"
                                            placeholder="Test instructions for students..."
                                        />
                                    </div>

                                    <div className="flex flex-col gap-4 bg-gray-50 rounded-2xl p-6">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={isActive}
                                                onChange={(e) => setIsActive(e.target.checked)}
                                                disabled={isSaving}
                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-secondary"
                                            />
                                            <div>
                                                <span className="text-sm font-bold text-primary block">Active</span>
                                                <span className="text-xs text-primary/60">Test is available for students</span>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={showResultImmediately}
                                                onChange={(e) => setShowResultImmediately(e.target.checked)}
                                                disabled={isSaving}
                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-secondary"
                                            />
                                            <div>
                                                <span className="text-sm font-bold text-primary block">Show Result Immediately</span>
                                                <span className="text-xs text-primary/60">Display results after completion</span>
                                            </div>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={allowRetake}
                                                onChange={(e) => setAllowRetake(e.target.checked)}
                                                disabled={isSaving}
                                                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-secondary"
                                            />
                                            <div>
                                                <span className="text-sm font-bold text-primary block">Allow Retake</span>
                                                <span className="text-xs text-primary/60">Students can retake the test</span>
                                            </div>
                                        </label>
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
                                            editingTest ? "Save Changes" : "Create Test"
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
