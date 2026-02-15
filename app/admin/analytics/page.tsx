"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

interface AnalyticsData {
    revenue: {
        total: number;
        monthly: Array<{ month: string; amount: number }>;
        by_class: Array<{ class_name: string; amount: number }>;
        by_method: Array<{ method: string; amount: number; count: number }>;
    };
    enrollments: {
        total: number;
        monthly: Array<{ month: string; count: number }>;
        by_status: Array<{ status: string; count: number }>;
        by_level: Array<{ level: string; count: number }>;
    };
    students: {
        total: number;
        active: number;
        monthly_growth: Array<{ month: string; count: number }>;
        by_age_group: Array<{ age_group: string; count: number }>;
    };
    tests: {
        total_attempts: number;
        completion_rate: number;
        average_score: number;
        by_test: Array<{ test_name: string; attempts: number; avg_score: number }>;
        pass_fail: Array<{ status: string; count: number }>;
    };
}

const COLORS = {
    primary: "#255d74",
    secondary: "#ff4d30",
    success: "#10b981",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6",
    purple: "#8b5cf6",
    pink: "#ec4899",
};

const PIE_COLORS = [COLORS.primary, COLORS.secondary, COLORS.success, COLORS.warning, COLORS.danger, COLORS.info];

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState("6months");

    const loadAnalytics = async () => {
        setIsLoading(true);
        try {
            const analyticsData = await api.admin.analytics.overview(dateRange);
            setData(analyticsData);
        } catch (err) {
            console.error("Failed to load analytics:", err);
            toast.error("Failed to load analytics data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, [dateRange]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-primary/60 font-medium">Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-primary/40">No analytics data available</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-black text-primary mb-2">Analytics Dashboard</h1>
                        <p className="text-primary/40 text-xs font-bold uppercase tracking-widest">
                            Business Intelligence & Insights
                        </p>
                    </div>
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-sm font-medium"
                    >
                        <option value="1month">Last Month</option>
                        <option value="3months">Last 3 Months</option>
                        <option value="6months">Last 6 Months</option>
                        <option value="1year">Last Year</option>
                        <option value="all">All Time</option>
                    </select>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-linear-to-br from-primary to-primary/80 rounded-2xl p-6 text-white">
                        <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Total Revenue</p>
                        <p className="text-3xl font-black">
                            Rp {(data.revenue.total / 1000000).toFixed(1)}M
                        </p>
                    </div>
                    <div className="bg-linear-to-br from-secondary to-secondary/80 rounded-2xl p-6 text-white">
                        <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Total Enrollments</p>
                        <p className="text-3xl font-black">{data.enrollments.total}</p>
                    </div>
                    <div className="bg-linear-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                        <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Active Students</p>
                        <p className="text-3xl font-black">{data.students.active}</p>
                    </div>
                    <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                        <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-80">Avg Test Score</p>
                        <p className="text-3xl font-black">{data.tests.average_score}%</p>
                    </div>
                </div>
            </div>

            {/* Revenue Analytics */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <h2 className="text-2xl font-black text-primary mb-6">Revenue Analytics</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Monthly Revenue Trend */}
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Monthly Revenue Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.revenue.monthly}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#255d74" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#255d74" style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'white', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                    formatter={(value: any) => `Rp ${(value / 1000000).toFixed(2)}M`}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke={COLORS.primary} 
                                    strokeWidth={3}
                                    name="Revenue"
                                    dot={{ fill: COLORS.primary, r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Revenue by Payment Method */}
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Payment Methods</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.revenue.by_method}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry: any) => `${entry.method}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="amount"
                                >
                                    {data.revenue.by_method.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => `Rp ${(value / 1000000).toFixed(2)}M`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Revenue by Class */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold text-primary mb-4">Top Revenue by Class</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.revenue.by_class.slice(0, 10)}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="class_name" stroke="#255d74" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={100} />
                                <YAxis stroke="#255d74" style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'white', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                    formatter={(value: any) => `Rp ${(value / 1000000).toFixed(2)}M`}
                                />
                                <Bar dataKey="amount" fill={COLORS.secondary} name="Revenue" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Enrollment Analytics */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <h2 className="text-2xl font-black text-primary mb-6">Enrollment Analytics</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Monthly Enrollment Trend */}
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Monthly Enrollment Trend</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.enrollments.monthly}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#255d74" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#255d74" style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'white', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke={COLORS.secondary} 
                                    strokeWidth={3}
                                    name="Enrollments"
                                    dot={{ fill: COLORS.secondary, r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Enrollment by Status */}
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Enrollment Status</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={data.enrollments.by_status}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry: any) => `${entry.status}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {data.enrollments.by_status.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Enrollment by Education Level */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-bold text-primary mb-4">Enrollment by Education Level</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.enrollments.by_level}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="level" stroke="#255d74" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#255d74" style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'white', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                />
                                <Bar dataKey="count" fill={COLORS.success} name="Enrollments" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Student Analytics */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <h2 className="text-2xl font-black text-primary mb-6">Student Analytics</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Student Growth */}
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Student Growth</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.students.monthly_growth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="month" stroke="#255d74" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#255d74" style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'white', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                />
                                <Legend />
                                <Line 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke={COLORS.success} 
                                    strokeWidth={3}
                                    name="Students"
                                    dot={{ fill: COLORS.success, r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Students by Age Group */}
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Students by Age Group</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.students.by_age_group}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="age_group" stroke="#255d74" style={{ fontSize: '12px' }} />
                                <YAxis stroke="#255d74" style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'white', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                />
                                <Bar dataKey="count" fill={COLORS.info} name="Students" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Test Analytics */}
            <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 p-10">
                <h2 className="text-2xl font-black text-primary mb-6">Placement Test Analytics</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Pass/Fail Distribution */}
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Pass/Fail Rate</h3>
                        <div className="flex items-center justify-center mb-4">
                            <div className="text-center">
                                <p className="text-5xl font-black text-primary">{data.tests.completion_rate}%</p>
                                <p className="text-sm text-primary/60 font-medium mt-2">Completion Rate</p>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={data.tests.pass_fail}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry: any) => `${entry.status}: ${((entry.percent || 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {data.tests.pass_fail.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.status === 'Pass' ? COLORS.success : COLORS.danger} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Test Performance */}
                    <div>
                        <h3 className="text-lg font-bold text-primary mb-4">Test Performance</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.tests.by_test}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="test_name" stroke="#255d74" style={{ fontSize: '11px' }} angle={-45} textAnchor="end" height={100} />
                                <YAxis stroke="#255d74" style={{ fontSize: '12px' }} />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: 'white', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '12px',
                                        padding: '12px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="attempts" fill={COLORS.primary} name="Attempts" />
                                <Bar dataKey="avg_score" fill={COLORS.secondary} name="Avg Score (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
