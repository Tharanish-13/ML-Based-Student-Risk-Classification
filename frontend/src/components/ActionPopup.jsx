import { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import api from '../api';

const ActionPopup = ({ isOpen, onClose, studentEmail }) => {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [sending, setSending] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await api.post('/actions/email', {
                to_email: studentEmail,
                subject,
                content
            });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2000);
        } catch (error) {
            alert("Failed to send email");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                        <Mail className="text-primary" /> Send Email Action
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X size={24} />
                    </button>
                </div>

                {success ? (
                    <div className="text-center py-8 text-green-600">
                        <Send size={48} className="mx-auto mb-4" />
                        <p className="text-xl font-semibold">Email Sent Successfully!</p>
                    </div>
                ) : (
                    <form onSubmit={handleSend}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                            <input
                                type="text"
                                value={studentEmail}
                                disabled
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-gray-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                                required
                                placeholder="e.g., Meeting Request regarding Attendance"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg p-2 h-32 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                                required
                                placeholder="Write your message here..."
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={sending}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-indigo-700 transition shadow-md disabled:opacity-50 flex items-center gap-2"
                            >
                                {sending ? 'Sending...' : <><Send size={18} /> Send Mail</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ActionPopup;
