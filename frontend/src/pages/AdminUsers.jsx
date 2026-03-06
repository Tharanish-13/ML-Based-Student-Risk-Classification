import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    // Edit state
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', role: '', department: '', year: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/admin/users/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setError('');
        } catch (err) {
            console.error('Failed to fetch users:', err);
            setError('Failed to fetch users. Ensure you have admin privileges.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        // Prevent deleting oneself
        const userToDelete = users.find(u => u.id === userId);
        if (userToDelete && userToDelete.email === user.email) {
            alert("You cannot delete your own admin account.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            console.error('Failed to delete user:', err);
            alert(err.response?.data?.detail || 'Failed to delete user');
        }
    };

    const handleToggleBan = async (userToToggle) => {
        if (!window.confirm(`Are you sure you want to ${userToToggle.banned ? 'unban' : 'ban'} this user?`)) return;

        if (userToToggle.email === user.email) {
            alert("You cannot ban your own admin account.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:8000/admin/users/${userToToggle.id}`, {
                banned: !userToToggle.banned
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update successful
            setUsers(users.map(u => u.id === userToToggle.id ? response.data : u));
        } catch (err) {
            console.error('Failed to update ban status:', err);
            alert(err.response?.data?.detail || 'Failed to update ban status');
        }
    };

    const handleEditClick = (user) => {
        setEditingUser(user.id);
        setEditForm({
            name: user.name,
            role: user.role,
            department: user.department || '',
            year: user.year || ''
        });
    };

    const handleEditSave = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const dataToUpdate = { ...editForm };
            // Optional fields handling
            if (!dataToUpdate.department) dataToUpdate.department = null;
            if (!dataToUpdate.year) dataToUpdate.year = null;

            const response = await axios.put(`http://localhost:8000/admin/users/${userId}`, dataToUpdate, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Update successful
            setUsers(users.map(u => u.id === userId ? response.data : u));
            setEditingUser(null);
        } catch (err) {
            console.error('Failed to update user:', err);
            alert(err.response?.data?.detail || 'Failed to update user');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;

    return (
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden p-6 md:p-8 border border-white/50 relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>

            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700">
                User Management
            </h1>
            <p className="text-gray-500 mb-8 max-w-2xl bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50">
                Manage all registered users (Admins, Staff, and Students) in the system.
            </p>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}

            <div className="overflow-x-auto rounded-2xl border border-gray-100 bg-white/50 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Dept / Year</th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white/80 divide-y divide-gray-100">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingUser === u.id ? (
                                        <div className="space-y-2">
                                            <input
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full text-sm border-gray-300 rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <div className="text-sm text-gray-500">{u.email}</div>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                                                {u.name}
                                                {u.banned && (
                                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 uppercase">
                                                        Banned
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-gray-500">{u.email}</div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {editingUser === u.id ? (
                                        <select
                                            value={editForm.role}
                                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                            className="text-sm border-gray-300 rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="student">Student</option>
                                            <option value="staff">Staff</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    ) : (
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full items-center justify-center 
                                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-800 border bg-purple-200' :
                                                u.role === 'staff' ? 'bg-indigo-100 text-indigo-800' :
                                                    'bg-green-100 text-green-800'}`}>
                                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-48">
                                    {editingUser === u.id ? (
                                        <div className="space-y-2 flex flex-col w-32">
                                            <input
                                                placeholder="Dept"
                                                value={editForm.department}
                                                onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                                                className="text-sm border-gray-300 rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                placeholder="Year"
                                                value={editForm.year}
                                                onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                                                className="text-sm border-gray-300 rounded-md p-1 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col">
                                            {u.department && <span className="text-xs">{u.department}</span>}
                                            {u.year && <span className="text-xs bg-gray-100 rounded px-1 inline-block w-max mt-1">Year: {u.year}</span>}
                                            {!u.department && !u.year && <span className="text-gray-400 italic">N/A</span>}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {editingUser === u.id ? (
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEditSave(u.id)}
                                                className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md transition-colors"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingUser(null)}
                                                className="text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1 rounded-md transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => handleEditClick(u)}
                                                className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                                title="Edit User"
                                            >
                                                <svg xmlns="http://www.w3.org/.svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                                                    <path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleToggleBan(u)}
                                                className={`transition-colors opacity-75 hover:opacity-100 ${u.banned ? 'text-green-600 hover:text-green-900' : 'text-orange-600 hover:text-orange-900'}`}
                                                title={u.banned ? "Unban User" : "Ban User"}
                                                disabled={u.email === user?.email}
                                            >
                                                {u.banned ? (
                                                    // Unlock icon
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                                                ) : (
                                                    // Lock icon
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="text-red-600 hover:text-red-900 transition-colors opacity-75 hover:opacity-100"
                                                title="Delete User"
                                                disabled={u.email === user?.email}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {users.length === 0 && !loading && !error && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No users found.</p>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
