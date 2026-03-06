import { useEffect, useState } from 'react';
import api from '../api';
import { User, Activity, BookOpen, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/students/me');
                setStudent(res.data);

                // Fetch notifications
                const notifRes = await api.get('/actions/notifications');
                setNotifications(notifRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-8 text-center">Loading profile...</div>;

    if (!student) return (
        <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
            <p className="mb-4">It seems your student profile hasn't been linked or created yet.</p>
            <p className="text-gray-500">Please contact a staff member to create your student record with your email address.</p>
        </div>
    );

    const getRiskColor = (level) => {
        switch (level) {
            case 'High': return 'text-red-500 bg-red-100 border-red-200';
            case 'Moderate': return 'text-yellow-500 bg-yellow-100 border-yellow-200';
            case 'Low': return 'text-green-500 bg-green-100 border-green-200';
            default: return 'text-gray-500 bg-gray-100 border-gray-200';
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">My Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <User className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{student.name}</h2>
                            <p className="text-gray-500">{student.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="flex items-center gap-2 text-gray-600"><Clock size={18} /> Study Hours</span>
                            <span className="font-semibold">{student.study_hours} hrs/week</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="flex items-center gap-2 text-gray-600"><BookOpen size={18} /> Assignments</span>
                            <span className="font-semibold">{student.assignments}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="flex items-center gap-2 text-gray-600"><Activity size={18} /> Attendance</span>
                            <span className="font-semibold">{student.attendance}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                            <span className="flex items-center gap-2 text-gray-600"><CheckCircle size={18} /> Marks</span>
                            <span className="font-semibold">{student.marks}</span>
                        </div>
                    </div>
                </div>

                {/* Risk Status Card */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-100 flex flex-col justify-center items-center text-center">
                    <h2 className="text-lg font-semibold text-gray-500 mb-4">Current Risk Assessment</h2>
                    <div className={`p-6 rounded-full border-4 mb-4 ${getRiskColor(student.risk_level)}`}>
                        <AlertTriangle size={64} />
                    </div>
                    <h3 className="text-4xl font-bold mb-2">{student.risk_level} Risk</h3>
                    <p className="text-gray-500 max-w-xs mx-auto">
                        {student.risk_level === 'High'
                            ? "Immediate attention needed. Please consult with your advisor."
                            : "Keep up the good work and continue measuring your progress."}
                    </p>

                    <Link to="/predict" className="mt-8 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">
                        Manual Risk Check
                    </Link>
                </div>
            </div>

            {/* Notifications Section */}
            <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-slate-100">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800">
                    <AlertTriangle className="text-yellow-500" size={24} /> Notifications & Warnings
                </h3>
                {notifications.length > 0 ? (
                    <div className="space-y-4">
                        {notifications.map(notif => (
                            <div key={notif.id} className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex gap-4 items-start">
                                <div className="p-2 bg-white rounded-full shadow-sm">
                                    <AlertTriangle size={20} className="text-yellow-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{notif.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(notif.created_at).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-400">No new notifications.</div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
