import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

const StaffAlerts = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Email Form State
    const [isSending, setIsSending] = useState(false);
    const [emailForm, setEmailForm] = useState({ to_email: '', subject: '', content: '' });
    const [sendSuccess, setSendSuccess] = useState('');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/actions/all-notifications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
            setError('Failed to load past interventions.');
        } finally {
            setLoading(false);
        }
    };

    const handleSendEmail = async (e) => {
        e.preventDefault();
        try {
            setIsSending(true);
            setSendSuccess('');
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/actions/email', emailForm, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSendSuccess('Email sent and notification logged successfully!');
            setEmailForm({ to_email: '', subject: '', content: '' });
            fetchNotifications(); // Refresh log
        } catch (err) {
            console.error('Failed to send email:', err);
            alert(err.response?.data?.detail || 'Failed to send email');
        } finally {
            setIsSending(false);
            setTimeout(() => setSendSuccess(''), 5000);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
                Alerts & Interventions
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Intervention Form */}
                <div className="lg:col-span-1 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden p-6 border border-white/50 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-orange-500"></div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Mail className="text-orange-500" size={20} /> New Intervention
                    </h2>
                    {sendSuccess && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-sm text-center">
                            <CheckCircle size={16} /> {sendSuccess}
                        </div>
                    )}
                    <form onSubmit={handleSendEmail} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student Email</label>
                            <input
                                type="email"
                                required
                                value={emailForm.to_email}
                                onChange={(e) => setEmailForm({ ...emailForm, to_email: e.target.value })}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="student@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input
                                type="text"
                                required
                                value={emailForm.subject}
                                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Urgent: Academic Performance"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                            <textarea
                                required
                                rows={5}
                                value={emailForm.content}
                                onChange={(e) => setEmailForm({ ...emailForm, content: e.target.value })}
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Please schedule a meeting with your advisor..."
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSending}
                            className={`w-full py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white 
                                ${isSending ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'} 
                                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all`}
                        >
                            {isSending ? 'Sending...' : 'Send Alert'}
                        </button>
                    </form>
                </div>

                {/* Intervention Log */}
                <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden p-6 border border-white/50 relative flex flex-col h-full">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertCircle className="text-indigo-500" size={20} /> Intervention History
                    </h2>

                    {error && <div className="text-red-500 mb-4">{error}</div>}

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3" style={{ maxHeight: '600px' }}>
                        {loading ? (
                            <div className="text-center text-gray-500 py-8">Loading...</div>
                        ) : notifications.length === 0 ? (
                            <div className="text-center text-gray-500 py-12 bg-gray-50 rounded-xl border border-gray-100">
                                No interventions logged yet.
                            </div>
                        ) : (
                            notifications.map((notif) => (
                                <div key={notif.id} className="bg-white border text-left border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-semibold text-gray-800">{notif.student_email}</div>
                                        <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                            {new Date(notif.created_at).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">
                                        {notif.message}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StaffAlerts;
