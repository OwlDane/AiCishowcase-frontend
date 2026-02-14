"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface Student {
    id: string;
    name: string;
    email: string;
    role: string;
    created_at: string;
    enrollments_count: number;
    total_spent: number;
    total_spent_formatted: string;
    last_enrollment_date?: string;
}

export default function AdminStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const loadStudents = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("search", searchQuery);
            
            const data = await api.admin.students.list(params.toString());
            setStudents(data.results);
        } catch (err) {
            console.error("Failed to load students:", err);
            toast.error("Failed to load students");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, [searchQuery]);

    const openModal = async (studentId: string) => {
        try {
            const data = await api.admin.students.get(studentId);
            setSelectedStudent(data);
            setIsModalOpen(true);
        } catch (err) {
            toast.error("Failed to load student details");
        }
    };

    const closeModal = () => {
        setSelectedStudent(null);
        setIsModalOpen(false);
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append("search", searchQuery);
        window.open(api.admin.students.export(params.toString()), '_blank');
    };

    const stats = {
        total: students.length,
        active: students.filter(s => s.enrollments_count > 0).length,
        totalRevenue: students.reduce((sum, s) => sum + s.total_spent, 0),
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="space-y-8">
            {/* Header with Stats */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold text-primary mb-2">Students Management</h3>
                        <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">
                            {stats.total} registered students
                        </p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="bg-secondary text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-secondary/20 hover:bg-primary transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Export CSV
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Total Students</p>
                        <p className="text-3xl font-black text-primary">{stats.total}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-green-600/60 uppercase tracking-widest mb-2">Active Students</p>
                        <p className="text-3xl font-black text-green-600">{stats.active}</p>
                    </div>
                    <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-blue-600/60 uppercase tracking-widest mb-2">Total Revenue</p>
                        <p className="text-2xl font-black text-blue-600">{formatCurrency(stats.totalRevenue)}</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-8">
                <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                    Search Students
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

            {/* Table */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                </div>
            ) : students.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-20 text-center">
                    <p className="text-4xl mb-4">👥</p>
                    <h4 className="text-xl font-bold text-primary mb-2">No students found</h4>
                    <p className="text-primary/60">Try adjusting your search</p>
                </div>
            ) : (
                <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">
                                <tr>
                                    <th className="px-10 py-6">Student</th>
                                    <th className="px-10 py-6">Email</th>
                                    <th className="px-10 py-6">Enrollments</th>
                                    <th className="px-10 py-6">Total Spent</th>
                                    <th className="px-10 py-6">Last Activity</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                    {student.name.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-primary">{student.name}</span>
                                                    <span className="text-xs text-primary/40">ID: {student.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-sm text-primary/60 font-medium">{student.email}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-2xl font-black text-primary">{student.enrollments_count}</span>
                                                <span className="text-xs text-primary/40">classes</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="font-bold text-green-600">{student.total_spent_formatted}</span>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-sm text-primary/40 font-bold">
                                                {student.last_enrollment_date 
                                                    ? new Date(student.last_enrollment_date).toLocaleDateString()
                                                    : 'No activity'}
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button
                                                onClick={() => openModal(student.id)}
                                                className="w-10 h-10 bg-gray-50 text-primary/40 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm ml-auto"
                                                title="View Details"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="min-h-screen flex items-center justify-center p-4">
                        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm" onClick={closeModal} />

                        <div className="relative bg-white w-full max-w-5xl rounded-[3rem] shadow-2xl p-10 md:p-12 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xl">
                                        {selectedStudent.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-primary">{selectedStudent.name}</h3>
                                        <p className="text-sm text-primary/60">{selectedStudent.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={closeModal}
                                    className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary/20 hover:text-red-500 hover:bg-red-50 transition-all"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-gray-50 rounded-2xl p-6 text-center">
                                        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Enrollments</p>
                                        <p className="text-3xl font-black text-primary">{selectedStudent.enrollments_count}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-2xl p-6 text-center">
                                        <p className="text-xs font-bold text-green-600/60 uppercase tracking-widest mb-2">Total Spent</p>
                                        <p className="text-xl font-black text-green-600">{selectedStudent.total_spent_formatted}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-2xl p-6 text-center">
                                        <p className="text-xs font-bold text-blue-600/60 uppercase tracking-widest mb-2">Test Results</p>
                                        <p className="text-3xl font-black text-blue-600">{selectedStudent.test_attempts_count || 0}</p>
                                    </div>
                                </div>

                                {/* Enrollment History */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h4 className="text-lg font-bold text-primary mb-4">Enrollment History</h4>
                                    {selectedStudent.enrollments && selectedStudent.enrollments.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedStudent.enrollments.map((enrollment: any) => (
                                                <div key={enrollment.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold text-primary">{enrollment.class_name}</p>
                                                        <p className="text-xs text-primary/40">{enrollment.enrollment_number}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                            enrollment.status === 'confirmed' ? 'bg-green-100 text-green-600' :
                                                            enrollment.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                                            'bg-red-100 text-red-600'
                                                        }`}>
                                                            {enrollment.status_label}
                                                        </span>
                                                        <p className="text-xs text-primary/40 mt-1">{enrollment.enrolled_at_formatted}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-primary/40 py-8">No enrollments yet</p>
                                    )}
                                </div>

                                {/* Test Results */}
                                <div className="bg-gray-50 rounded-2xl p-6">
                                    <h4 className="text-lg font-bold text-primary mb-4">Test Results</h4>
                                    {selectedStudent.test_attempts && selectedStudent.test_attempts.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedStudent.test_attempts.map((attempt: any) => (
                                                <div key={attempt.id} className="bg-white rounded-xl p-4 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-bold text-primary">{attempt.test_title}</p>
                                                        <p className="text-xs text-primary/40">{attempt.completed_at_formatted}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-black text-primary">{attempt.score}%</p>
                                                        <p className="text-xs text-primary/40">
                                                            {attempt.correct_answers}/{attempt.total_questions} correct
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-center text-primary/40 py-8">No test attempts yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
