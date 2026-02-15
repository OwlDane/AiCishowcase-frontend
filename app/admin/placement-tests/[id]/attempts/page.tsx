"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Attempt {
    id: string;
    student_name: string;
    student_email: string;
    score: number;
    correct_answers: number;
    total_questions: number;
    time_taken_minutes: number;
    status: string;
    started_at: string;
    completed_at: string;
    completed_at_formatted: string;
}

export default function TestAttemptsPage() {
    const params = useParams();
    const router = useRouter();
    const testId = params.id as string;
    
    const [test, setTest] = useState<any>(null);
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const loadTest = async () => {
        try {
            const data = await api.admin.placementTests.get(testId);
            setTest(data);
        } catch (err) {
            toast.error("Failed to load test");
            router.push("/admin/placement-tests");
        }
    };

    const loadAttempts = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("test_id", testId);
            if (searchQuery) params.append("search", searchQuery);
            if (statusFilter !== "all") params.append("status", statusFilter);
            
            const data = await api.admin.placementTests.attempts(params.toString());
            setAttempts(data.results || data);
        } catch (err) {
            console.error("Failed to load attempts:", err);
            toast.error("Failed to load attempts");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadTest();
    }, [testId]);

    useEffect(() => {
        loadAttempts();
    }, [testId, searchQuery, statusFilter]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-50';
        if (score >= 60) return 'bg-yellow-50';
        return 'bg-red-50';
    };

    const stats = {
        total: attempts.length,
        completed: attempts.filter(a => a.status === 'completed').length,
        avgScore: attempts.length > 0 
            ? Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length)
            : 0,
        passRate: attempts.length > 0
            ? Math.round((attempts.filter(a => a.score >= (test?.passing_score || 70)).length / attempts.length) * 100)
            : 0,
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <div className="flex items-center gap-4 mb-6">
                    <Link
                        href="/admin/placement-tests"
                        className="w-10 h-10 bg-gray-50 text-primary/40 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold text-primary">{test?.title}</h3>
                        <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">
                            Test Attempts & Results
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Total Attempts</p>
                        <p className="text-3xl font-black text-primary">{stats.total}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-green-600/60 uppercase tracking-widest mb-2">Completed</p>
                        <p className="text-3xl font-black text-green-600">{stats.completed}</p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-blue-600/60 uppercase tracking-widest mb-2">Avg Score</p>
                        <p className="text-3xl font-black text-blue-600">{stats.avgScore}%</p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-purple-600/60 uppercase tracking-widest mb-2">Pass Rate</p>
                        <p className="text-3xl font-black text-purple-600">{stats.passRate}%</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                            Search Student
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by name or email..."
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
                            Status
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="in_progress">In Progress</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Attempts List */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-primary/40 text-sm font-medium mt-4">Loading attempts...</p>
                    </div>
                ) : attempts.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-primary/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-primary/40 text-sm font-medium">No attempts found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {attempts.map((attempt) => (
                            <div
                                key={attempt.id}
                                className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-bold text-primary truncate">
                                                {attempt.student_name}
                                            </h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                attempt.status === 'completed' 
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {attempt.status === 'completed' ? 'Completed' : 'In Progress'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-primary/60 mb-3">{attempt.student_email}</p>
                                        
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-primary/60 font-medium">
                                                    {attempt.time_taken_minutes} min
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-primary/60 font-medium">
                                                    {attempt.completed_at_formatted}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className={`${getScoreBgColor(attempt.score)} rounded-2xl px-6 py-4 text-center min-w-30`}>
                                            <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-1">Score</p>
                                            <p className={`text-3xl font-black ${getScoreColor(attempt.score)}`}>
                                                {attempt.score}%
                                            </p>
                                            <p className="text-xs text-primary/60 font-medium mt-1">
                                                {attempt.correct_answers}/{attempt.total_questions}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
