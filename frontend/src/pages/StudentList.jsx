import { useState, useEffect } from 'react';
import api from '../api';
import { Trash2, Edit, Search, Plus, Filter, MoreVertical, FileText } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const riskParam = searchParams.get('risk');
        if (riskParam) {
            setFilter(riskParam);
        }
    }, [searchParams]);

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/students/?search=${search}&risk=${filter}`);
            setStudents(res.data);
        } catch (error) {
            console.error("Failed to fetch students");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [search, filter]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this student?")) {
            await api.delete(`/students/${id}`);
            fetchStudents();
        }
    };

    const getRiskBadge = (risk) => {
        const styles = {
            "High": "bg-red-50 text-red-600 border-red-100",
            "Medium": "bg-amber-50 text-amber-600 border-amber-100",
            "Moderate": "bg-amber-50 text-amber-600 border-amber-100",
            "Low": "bg-emerald-50 text-emerald-600 border-emerald-100",
            "Pending": "bg-slate-50 text-slate-600 border-slate-100"
        };
        const style = styles[risk] || styles["Pending"];
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${style} flex items-center gap-1 w-fit`}>
                <span className={`w-1.5 h-1.5 rounded-full ${risk === 'High' ? 'bg-red-500' : risk === 'Low' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                {risk}
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in-up">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Student Directory</h1>
                    <p className="text-slate-500 mt-1">Manage student records and monitor risk levels</p>
                </div>
                <Link to="/add-student" className="btn-primary px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 flex items-center gap-2 text-sm font-medium transition-transform active:scale-95">
                    <Plus size={18} /> Add New Student
                </Link>
            </div>

            <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between animate-fade-in-up delay-100">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search students by name..."
                        className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none">
                        <Filter className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                        <select
                            className="w-full md:w-48 pl-10 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none cursor-pointer transition-all"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="All">All Risk Levels</option>
                            <option value="High">High Risk</option>
                            <option value="Medium">Medium Risk</option>
                            <option value="Low">Low Risk</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="glass-panel rounded-2xl overflow-hidden animate-fade-in-up delay-200 min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Student Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Attendance</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Performance</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm">Risk Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-600 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="loader-spinner text-indigo-500 border-t-indigo-500 border-indigo-200"></div>
                                            <p className="text-slate-400 text-sm">Loading students...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : students.length > 0 ? (
                                students.map((student, index) => (
                                    <tr key={student.id} className="group hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800">{student.name}</p>
                                                    <p className="text-xs text-slate-400">{student.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-full max-w-[80px] h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${student.attendance >= 75 ? 'bg-emerald-500' : student.attendance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                        style={{ width: `${student.attendance}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-slate-600">{student.attendance}%</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">{student.marks} / 100</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRiskBadge(student.risk_level)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/edit-student/${student.id}`} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Student">
                                                    <Edit size={18} />
                                                </Link>
                                                <button onClick={() => handleDelete(student.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Student">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                                            <div className="p-4 bg-slate-50 rounded-full">
                                                <FileText size={32} />
                                            </div>
                                            <p>No students found matching your criteria</p>
                                            <button onClick={() => { setSearch(''); setFilter('All'); }} className="text-indigo-600 text-sm font-medium hover:underline">
                                                Clear filters
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {students.length > 0 && (
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/30 flex justify-between items-center text-sm text-slate-500">
                        <span>Showing {students.length} students</span>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Previous</button>
                            <button className="px-3 py-1 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50" disabled>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentList;
