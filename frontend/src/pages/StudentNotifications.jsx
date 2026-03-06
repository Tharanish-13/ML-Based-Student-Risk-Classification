import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, AlertCircle, CheckCircle } from 'lucide-react';

const StudentNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/actions/notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
            setError('Failed to load your notifications.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                    <Bell size={28} />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
                    My Notifications
                </h1>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden p-6 md:p-8 border border-white/50 relative min-h-[500px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-500"></div>

                {error && <div className="text-red-500 mb-4 bg-red-50 p-4 rounded-xl">{error}</div>}

                {loading ? (
                    <div className="flex justify-center items-center h-64 text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="mx-auto w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">You're all caught up!</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            You don't have any new notifications or alerts from the staff at this moment.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notif) => (
                            <div key={notif.id} className="bg-white border text-left border-red-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-red-500 group-hover:bg-red-600 transition-colors"></div>
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 flex-shrink-0 bg-red-50 p-2 rounded-full text-red-500">
                                        <AlertCircle size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="font-bold text-gray-900">Staff Alert</div>
                                            <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                                {new Date(notif.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {notif.message}
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
};

export default StudentNotifications;
