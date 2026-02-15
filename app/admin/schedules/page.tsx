"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

interface Schedule {
    id: string;
    class_id: string;
    class_name: string;
    batch_name: string;
    start_date: string;
    end_date: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    location: string;
    instructor_name: string;
    capacity: number;
    enrolled_count: number;
    is_available: boolean;
    notes?: string;
}

interface ClassOption {
    id: string;
    name: string;
    code: string;
}

export default function SchedulesManagementPage() {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
    const [formData, setFormData] = useState({
        class_id: "",
        batch_name: "",
        start_date: "",
        end_date: "",
        day_of_week: "",
        start_time: "",
        end_time: "",
        location: "",
        instructor_name: "",
        capacity: 20,
        is_available: true,
        notes: "",
    });

    const loadSchedules = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append("search", searchQuery);
            if (classFilter !== "all") params.append("class_id", classFilter);
            
            const data = await api.admin.schedules.list(params.toString());
            setSchedules(data.results || data);
        } catch (err) {
            console.error("Failed to load schedules:", err);
            toast.error("Failed to load schedules");
        } finally {
            setIsLoading(false);
        }
    };

    const loadClasses = async () => {
        try {
            const data = await api.admin.classes.list();
            setClasses(data.results || data);
        } catch (err) {
            console.error("Failed to load classes:", err);
        }
    };

    useEffect(() => {
        loadClasses();
    }, []);

    useEffect(() => {
        loadSchedules();
    }, [searchQuery, classFilter]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (editingSchedule) {
                await api.admin.schedules.update(editingSchedule.id, formData);
                toast.success("Schedule updated successfully");
            } else {
                await api.admin.schedules.create(formData);
                toast.success("Schedule created successfully");
            }
            
            setShowModal(false);
            setEditingSchedule(null);
            resetForm();
            loadSchedules();
        } catch (err: any) {
            toast.error(err.message || "Failed to save schedule");
        }
    };

    const handleEdit = (schedule: Schedule) => {
        setEditingSchedule(schedule);
        setFormData({
            class_id: schedule.class_id,
            batch_name: schedule.batch_name,
            start_date: schedule.start_date,
            end_date: schedule.end_date,
            day_of_week: schedule.day_of_week,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            location: schedule.location,
            instructor_name: schedule.instructor_name,
            capacity: schedule.capacity,
            is_available: schedule.is_available,
            notes: schedule.notes || "",
        });
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this schedule?")) return;
        
        try {
            await api.admin.schedules.delete(id);
            toast.success("Schedule deleted successfully");
            loadSchedules();
        } catch (err: any) {
            toast.error(err.message || "Failed to delete schedule");
        }
    };

    const resetForm = () => {
        setFormData({
            class_id: "",
            batch_name: "",
            start_date: "",
            end_date: "",
            day_of_week: "",
            start_time: "",
            end_time: "",
            location: "",
            instructor_name: "",
            capacity: 20,
            is_available: true,
            notes: "",
        });
    };

    const stats = {
        total: schedules.length,
        available: schedules.filter(s => s.is_available).length,
        upcoming: schedules.filter(s => new Date(s.start_date) > new Date()).length,
        totalCapacity: schedules.reduce((sum, s) => sum + s.capacity, 0),
    };

    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-black text-primary mb-2">Schedules Management</h1>
                        <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">
                            Manage Class Schedules & Batches
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setEditingSchedule(null);
                            resetForm();
                            setShowModal(true);
                        }}
                        className="bg-secondary text-white px-8 py-4 rounded-2xl font-bold hover:bg-secondary/90 transition-all flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add Schedule
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-primary/40 uppercase tracking-widest mb-2">Total Schedules</p>
                        <p className="text-3xl font-black text-primary">{stats.total}</p>
                    </div>
                    <div className="bg-green-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-green-600/60 uppercase tracking-widest mb-2">Available</p>
                        <p className="text-3xl font-black text-green-600">{stats.available}</p>
                    </div>
                    <div className="bg-blue-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-blue-600/60 uppercase tracking-widest mb-2">Upcoming</p>
                        <p className="text-3xl font-black text-blue-600">{stats.upcoming}</p>
                    </div>
                    <div className="bg-purple-50 rounded-2xl p-6">
                        <p className="text-xs font-bold text-purple-600/60 uppercase tracking-widest mb-2">Total Capacity</p>
                        <p className="text-3xl font-black text-purple-600">{stats.totalCapacity}</p>
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
                                placeholder="Search by batch name, location..."
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
                            Filter by Class
                        </label>
                        <select
                            value={classFilter}
                            onChange={(e) => setClassFilter(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                        >
                            <option value="all">All Classes</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.code} - {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Schedules List */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-primary/40 text-sm font-medium mt-4">Loading schedules...</p>
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="w-16 h-16 mx-auto text-primary/20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-primary/40 text-sm font-medium">No schedules found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {schedules.map((schedule) => (
                            <div
                                key={schedule.id}
                                className="bg-gray-50 rounded-2xl p-6 hover:shadow-md transition-all"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="text-lg font-bold text-primary">
                                                {schedule.batch_name}
                                            </h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                schedule.is_available
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}>
                                                {schedule.is_available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-primary/60 mb-3">{schedule.class_name}</p>
                                        
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mb-1">Period</p>
                                                <p className="text-primary/80 font-medium">
                                                    {new Date(schedule.start_date).toLocaleDateString()} - {new Date(schedule.end_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mb-1">Schedule</p>
                                                <p className="text-primary/80 font-medium">
                                                    {schedule.day_of_week}, {schedule.start_time} - {schedule.end_time}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mb-1">Location</p>
                                                <p className="text-primary/80 font-medium">{schedule.location}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mb-1">Capacity</p>
                                                <p className="text-primary/80 font-medium">
                                                    {schedule.enrolled_count}/{schedule.capacity} enrolled
                                                </p>
                                            </div>
                                        </div>

                                        {schedule.instructor_name && (
                                            <div className="mt-3">
                                                <p className="text-xs text-primary/40 font-bold uppercase tracking-widest mb-1">Instructor</p>
                                                <p className="text-primary/80 font-medium">{schedule.instructor_name}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(schedule)}
                                            className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-100 transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(schedule.id)}
                                            className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-100 transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[3rem] max-w-3xl w-full max-h-[90vh] overflow-y-auto p-10">
                        <h2 className="text-2xl font-black text-primary mb-6">
                            {editingSchedule ? "Edit Schedule" : "Add New Schedule"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                                        Class *
                                    </label>
                                    <select
                                        required
                                        value={formData.class_id}
                                        onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                                    >
                                        <option value="">Select a class</option>
                                        {classes.map((cls) => (
                                            <option key={cls.id} value={cls.id}>
                                                {cls.code} - {cls.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                                        Batch Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.batch_name}
                                        onChange={(e) => setFormData({ ...formData, batch_name: e.target.value })}
                                        placeholder="e.g., Batch 2024-A"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                                        Day of Week *
                                    </label>
                                    <select
                                        required
                                        value={formData.day_of_week}
                                        onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                                    >
                                        <option value="">Select day</option>
                                        {daysOfWeek.map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                                        Capacity *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                                        Start Time *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                                        End Time *
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="e.g., Room A1, Online"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                                        Instructor Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.instructor_name}
                                        onChange={(e) => setFormData({ ...formData, instructor_name: e.target.value })}
                                        placeholder="Instructor name (optional)"
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-primary/40 uppercase tracking-widest ml-1 mb-2 block">
                                        Notes
                                    </label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Additional notes (optional)"
                                        rows={3}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium resize-none"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_available}
                                            onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                                            className="w-5 h-5 rounded border-gray-300 text-secondary focus:ring-secondary"
                                        />
                                        <span className="text-sm font-medium text-primary">Available for enrollment</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingSchedule(null);
                                        resetForm();
                                    }}
                                    className="flex-1 bg-gray-100 text-primary px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-secondary text-white px-8 py-4 rounded-2xl font-bold hover:bg-secondary/90 transition-all"
                                >
                                    {editingSchedule ? "Update Schedule" : "Create Schedule"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
