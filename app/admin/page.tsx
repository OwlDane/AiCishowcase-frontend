"use client";

import { useEffect, useState, useMemo } from "react";
import { api, BackendProject} from "@/lib/api";
import Link from "next/link";
import { 
    XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalCategories: 0,
        totalLikes: 0,
        totalAchievements: 0,
        totalTestimonials: 0,
        totalPartners: 0,
        totalFacilities: 0,
        totalTeam: 0,
        totalGallery: 0,
        totalArticles: 0
    });
    const [recentProjects, setRecentProjects] = useState<BackendProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                const [
                    projectsData, achievementsData, categoriesData,
                    testimonialsData, partnersData, facilitiesData,
                    teamData, galleryData, articlesData
                ] = await Promise.all([
                    api.projects.list(),
                    api.achievements.list(),
                    api.projects.categories(),
                    api.content.testimonials(),
                    api.content.partners(),
                    api.content.facilities(),
                    api.content.team(),
                    api.content.gallery(),
                    api.content.articles()
                ]);

                // Basic stats calculation
                const projects = projectsData.results;
                setRecentProjects(projects.slice(0, 5));
                
                setStats({
                    totalProjects: projectsData.count,
                    totalCategories: categoriesData.count,
                    totalLikes: projects.reduce((acc: number, curr: any) => acc + (curr.likes_count || 0), 0),
                    totalAchievements: achievementsData.count,
                    totalTestimonials: testimonialsData.count,
                    totalPartners: partnersData.count,
                    totalFacilities: facilitiesData.count,
                    totalTeam: teamData.count,
                    totalGallery: galleryData.count,
                    totalArticles: articlesData.count
                });
            } catch (err) {
                console.error("Failed to load dashboard data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    const chartData = useMemo(() => {
        if (!recentProjects.length) return { monthly: [], category: [] };

        // 1. Monthly Trends (last 6 months)
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        const monthlySubmissions: Record<string, number> = {};
        
        // Initialize last 6 months
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            monthlySubmissions[`${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`] = 0;
        }

        // Fill data from projects
        recentProjects.forEach(p => {
            const d = new Date(p.created_at);
            const key = `${months[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
            if (monthlySubmissions[key] !== undefined) {
                monthlySubmissions[key]++;
            }
        });

        const monthly = Object.entries(monthlySubmissions).map(([name, total]) => ({ name, total }));

        // 2. Category Share (based on total likes)
        const categoryLikes: Record<string, number> = {};
        recentProjects.forEach(p => {
            categoryLikes[p.category_name] = (categoryLikes[p.category_name] || 0) + p.likes_count;
        });

        const category = Object.entries(categoryLikes).map(([name, value]) => ({ name, value }));

        return { monthly, category };
    }, [recentProjects]);

    const COLORS = ['#255d74', '#ff4d30', '#fbbf24', '#10b981', '#6366f1', '#f472b6'];

    const statCards = [
        { 
            name: "Total Projects", 
            value: stats.totalProjects, 
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
            ), 
            color: "bg-blue-500" 
        },
        { 
            name: "Total Categories", 
            value: stats.totalCategories, 
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ), 
            color: "bg-amber-500" 
        },
        { 
            name: "Total Likes", 
            value: stats.totalLikes, 
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
            ), 
            color: "bg-rose-500" 
        },
        { 
            name: "Achievements", 
            value: stats.totalAchievements, 
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
                </svg>
            ), 
            color: "bg-emerald-500" 
        },
        { 
            name: "Testimonials", 
            value: stats.totalTestimonials, 
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            ), 
            color: "bg-purple-500" 
        },
        { 
            name: "Partners", 
            value: stats.totalPartners, 
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ), 
            color: "bg-indigo-500" 
        },
        { 
            name: "Facilities", 
            value: stats.totalFacilities, 
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ), 
            color: "bg-sky-500" 
        },
        { 
            name: "Team", 
            value: stats.totalTeam, 
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            ), 
            color: "bg-orange-500" 
        },
        { 
            name: "Gallery", 
            value: stats.totalGallery, 
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ), 
            color: "bg-pink-500" 
        },
        { 
            name: "Articles", 
            value: stats.totalArticles, 
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
            ), 
            color: "bg-teal-500" 
        },
    ];

    return (
        <div className="space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {statCards.map((stat, i) => (
                    <div 
                        key={i} 
                        className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500"
                    >
                        <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-current/20 group-hover:scale-110 transition-transform duration-500`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-primary/40 text-[10px] font-bold uppercase tracking-widest">{stat.name}</p>
                            <h3 className="text-3xl font-black text-primary leading-none mt-1">{isLoading ? "..." : stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-primary">Submission Trends</h3>
                        <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">Last 6 Months</span>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.monthly}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#255d74" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#255d74" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="total" stroke="#255d74" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-primary">Likes by Category</h3>
                        <span className="text-xs font-bold text-primary/40 uppercase tracking-widest">Popularity</span>
                    </div>
                    <div className="h-[300px] w-full flex items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData.category}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.category.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-1/3 space-y-2">
                            {chartData.category.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                    <span className="text-xs font-bold text-primary/60 truncate">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Recent Projects Table */}
                <div className="lg:col-span-2 bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-10 border-b border-gray-50 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-primary">Recent Submissions</h3>
                        <Link href="/admin/projects" className="text-secondary text-xs font-bold uppercase tracking-widest hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-10 py-5 text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">Project</th>
                                    <th className="px-10 py-5 text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">Student</th>
                                    <th className="px-10 py-5 text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {isLoading ? (
                                    [1, 2, 3].map(n => (
                                        <tr key={n}>
                                            <td colSpan={4} className="px-10 py-6 animate-pulse">
                                                <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                                            </td>
                                        </tr>
                                    ))
                                ) : recentProjects.map((project) => (
                                    <tr key={project.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                    <img src={project.thumbnail} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <span className="font-bold text-primary group-hover:text-secondary transition-colors truncate max-w-[200px]">{project.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <span className="text-primary/60 font-medium">{project.student?.full_name || project.student_name}</span>
                                        </td>
                                        <td className="px-10 py-6 text-sm text-primary/40 font-bold">
                                            {new Date(project.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Activity */}
                <div className="space-y-8">
                    <div className="bg-primary rounded-[3rem] p-10 text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        <h4 className="text-lg font-bold mb-4 relative z-10">Quick Actions</h4>
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <Link href="/admin/achievements" className="bg-white/10 hover:bg-white/20 p-6 rounded-2xl flex flex-col gap-3 transition-all group/btn">
                                <div className="p-2 w-10 h-10 bg-white/10 rounded-xl group-hover/btn:bg-white/20 transition-colors">
                                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">Add Achievement</span>
                            </Link>
                            <Link href="/admin/categories" className="bg-white/10 hover:bg-white/20 p-6 rounded-2xl flex flex-col gap-3 transition-all group/btn">
                                <div className="p-2 w-10 h-10 bg-white/10 rounded-xl group-hover/btn:bg-white/20 transition-colors">
                                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wider">New Category</span>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                        <h4 className="text-lg font-bold text-primary mb-6">System Status</h4>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-primary">API Backend</p>
                                    <p className="text-xs text-primary/40">Connected and healthy</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-primary">Database</p>
                                    <p className="text-xs text-primary/40">Syncing complete</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
