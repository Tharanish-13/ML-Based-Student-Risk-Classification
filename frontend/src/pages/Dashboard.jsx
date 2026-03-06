import { useEffect, useState } from 'react';
import api from '../api';
import { Users, AlertTriangle, CheckCircle, Mail, ArrowRight, TrendingUp, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import ActionPopup from '../components/ActionPopup';

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, highRisk: 0, lowRisk: 0 });
    const [highRiskStudents, setHighRiskStudents] = useState([]);
    const [selectedStudentEmail, setSelectedStudentEmail] = useState(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/students/');
                const students = res.data;
                const high = students.filter(s => s.risk_level === "High").length;
                const low = students.filter(s => s.risk_level === "Low").length;

                setStats({
                    total: students.length,
                    highRisk: high,
                    lowRisk: low
                });

                const riskOrder = { 'High': 0, 'Moderate': 1, 'Medium': 1, 'Low': 2, 'Pending': 3, 'Unknown': 4 };
                const sortedStudents = [...students].sort((a, b) => {
                    const riskA = riskOrder[a.risk_level] ?? 5;
                    const riskB = riskOrder[b.risk_level] ?? 5;
                    return riskA - riskB;
                });

                setHighRiskStudents(sortedStudents.slice(0, 10));
            } catch (error) {
                console.error("Failed to fetch data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleActionClick = (email) => {
        setSelectedStudentEmail(email);
        setIsPopupOpen(true);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-600">
                        Staff Dashboard
                    </h1>
                    <p className="text-slate-500 mt-1 text-lg">Overview of student performance and risk analysis</p>
                </div>
                <div className="flex gap-3">
                    <span className="px-4 py-2 bg-white/60 backdrop-blur-sm border border-white/50 rounded-full text-sm font-medium text-slate-600 shadow-sm">
                        Academic Year 2025-2026
                    </span>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300 animate-fade-in-up delay-100">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                                <Users size={24} />
                            </div>
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <TrendingUp size={12} /> +12%
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Students</h3>
                        <p className="text-4xl font-bold text-slate-800 mt-1">{stats.total}</p>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300 animate-fade-in-up delay-200">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-red-100 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                                <AlertTriangle size={24} />
                            </div>
                            <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                <Activity size={12} /> High Risk
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">At Risk Students</h3>
                        <p className="text-4xl font-bold text-slate-800 mt-1">{stats.highRisk}</p>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-lg transition-all duration-300 animate-fade-in-up delay-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                <CheckCircle size={24} />
                            </div>
                            <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                                On Track
                            </span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Safe Zone</h3>
                        <p className="text-4xl font-bold text-slate-800 mt-1">{stats.lowRisk}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up delay-400">
                {/* High Risk List */}
                <div className="lg:col-span-2 glass-panel rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100/50 flex justify-between items-center bg-white/40">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-50 rounded-lg">
                                <AlertTriangle size={20} className="text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800">Risk Assessment</h3>
                                <p className="text-xs text-slate-500">Students requiring immediate attention</p>
                            </div>
                        </div>
                        <Link to="/students" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 group">
                            View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100/50 flex-1 overflow-auto max-h-[500px] custom-scrollbar">
                        {isLoading ? (
                            <div className="p-12 flex justify-center text-slate-400">Loading student data...</div>
                        ) : highRiskStudents.length > 0 ? (
                            highRiskStudents.map((student, index) => (
                                <div key={student.id} className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-indigo-50/30 transition-colors group">
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        <div className={`w-1.5 h-12 rounded-full shrink-0 ${student.risk_level === 'High' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' :
                                                student.risk_level === 'Medium' || student.risk_level === 'Moderate' ? 'bg-yellow-500' :
                                                    'bg-emerald-500'
                                            }`} />
                                        <div>
                                            <p className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">{student.name}</p>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-medium">Att: {student.attendance}%</span>
                                                <span className={`font-bold px-2 py-0.5 rounded ${student.risk_level === 'High' ? 'bg-red-50 text-red-600' :
                                                        student.risk_level === 'Medium' || student.risk_level === 'Moderate' ? 'bg-amber-50 text-amber-600' :
                                                            'bg-emerald-50 text-emerald-600'
                                                    }`}>{student.risk_level} Risk</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleActionClick(student.email)}
                                        className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <Mail size={16} /> Contact
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-slate-400">No students found.</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="glass-panel p-6 rounded-2xl h-fit sticky top-24">
                    <h3 className="text-lg font-bold text-slate-800 mb-6">Quick Actions</h3>
                    <div className="space-y-4">
                        <Link to="/predict" className="group block w-full text-center p-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all hover:-translate-y-1">
                            <div className="bg-transparent h-full w-full rounded-lg px-4 py-3 flex items-center justify-center gap-2 text-white font-bold">
                                <Activity size={20} /> Predict New Risk
                            </div>
                        </Link>

                        <Link to="/students" className="block w-full text-center px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-indigo-200 hover:text-indigo-600 transition-all font-medium">
                            Manage Students
                        </Link>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">System Status</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">Model Accuracy</span>
                                    <span className="font-medium text-emerald-600">94.2%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-1.5">
                                    <div className="bg-emerald-500 h-1.5 rounded-full w-[94%]"></div>
                                </div>
                                <div className="flex justify-between items-center text-sm mt-2">
                                    <span className="text-slate-500">Last Updated</span>
                                    <span className="text-slate-700">Just now</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ActionPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                studentEmail={selectedStudentEmail}
            />
        </div>
    );
};

export default Dashboard;
