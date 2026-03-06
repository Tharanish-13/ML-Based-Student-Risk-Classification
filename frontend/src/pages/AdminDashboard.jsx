import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, ShieldCheck, Activity } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Color palettes for charts
    const COLORS_ROLE = ['#6366f1', '#10b981', '#f59e0b']; // Indigo, Emerald, Amber
    const COLORS_RISK = ['#ef4444', '#f59e0b', '#10b981', '#94a3b8']; // Red, Amber, Emerald, Slate

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/admin/users/dashboard-stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setError("Failed to load analytics data.");
            } finally {
                setLoading(false);
            }
        };

        if (user && user.role === 'admin') {
            fetchStats();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return <div className="p-4 bg-red-50 text-red-600 rounded-xl my-4">{error}</div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl text-white shadow-lg">
                    <ShieldCheck size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-purple-700">
                        System Analytics Overview
                    </h1>
                    <p className="text-slate-500 mt-1">Holistic view of platform usage and student risk distribution.</p>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden p-6 border border-white/50 relative flex items-center justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16" />
                    <div className="relative z-10 w-full">
                        <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Users size={16} /> Total Registered Users
                        </h3>
                        <div className="text-5xl font-extrabold text-slate-800">
                            {stats?.summary?.total_users || 0}
                        </div>
                    </div>
                </div>

                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl overflow-hidden p-6 border border-white/50 relative flex items-center justify-between">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16" />
                    <div className="relative z-10 w-full">
                        <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Activity size={16} /> Tracked Students
                        </h3>
                        <div className="text-5xl font-extrabold text-slate-800">
                            {stats?.summary?.total_students || 0}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* User Roles Bar Chart */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/50">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        User Role Distribution
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={stats?.charts?.roles_distribution || []}
                                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={60}>
                                    {
                                        (stats?.charts?.roles_distribution || []).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS_ROLE[index % COLORS_ROLE.length]} />
                                        ))
                                    }
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Student Risk Pie Chart */}
                <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/50 flex flex-col items-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 w-full text-left">
                        Student Risk Categorization
                    </h3>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats?.charts?.risk_distribution || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {
                                        (stats?.charts?.risk_distribution || []).map((entry, index) => {
                                            // Map risk explicitly to a color if possible
                                            let fill = COLORS_RISK[3]; // Default unknown
                                            const n = entry.name.toLowerCase();
                                            if (n === 'high') fill = COLORS_RISK[0];
                                            if (n === 'moderate' || n === 'medium') fill = COLORS_RISK[1];
                                            if (n === 'low') fill = COLORS_RISK[2];

                                            return <Cell key={`cell-${index}`} fill={fill} />
                                        })
                                    }
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
