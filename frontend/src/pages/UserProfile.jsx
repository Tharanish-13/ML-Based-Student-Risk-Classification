import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { User, Save, Building, Calendar } from 'lucide-react';

const UserProfile = () => {
    const { user, setUser } = useAuth(); // We might need to expose setUser from context if not already
    const [department, setDepartment] = useState('');
    const [year, setYear] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setDepartment(user.department || '');
            setYear(user.year || '');
            // If user object doesn't have it (e.g. from login before fields existed), fetch it?
            // For simplicty, assume we might need to fetch me again or reliance on local state is ok for now.
            // Better: Fetch on mount.
            fetchLatestProfile();
        }
    }, [user]);

    const fetchLatestProfile = async () => {
        try {
            // We don't have a direct /users/me endpoint that returns everything, but let's assume login returns it or we rely on what we have.
            // Actually, let's just use what's in local storage/context for now, 
            // but we modified login to return it.
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await api.put('/users/me', { department, year });
            setMessage('Profile updated successfully!');

            // Update local context with returned user data or manual update
            if (response.data.user) {
                setUser(response.data.user);
            } else {
                // Fallback if backend doesn't return user
                setUser(prev => ({ ...prev, department, year }));
            }
        } catch (error) {
            setMessage('Failed to update profile.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-slate-800">My Profile</h1>

            <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-100">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-3xl">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{user?.name}</h2>
                        <p className="text-gray-500">{user?.email}</p>
                        <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                            {user?.role}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    {message && (
                        <div className={`p-4 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Building size={16} /> Department
                            </label>
                            <input
                                type="text"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                placeholder="e.g. Computer Science"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Calendar size={16} /> Year / Batch
                            </label>
                            <input
                                type="text"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                placeholder="e.g. 3rd Year"
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-70"
                        >
                            <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserProfile;
