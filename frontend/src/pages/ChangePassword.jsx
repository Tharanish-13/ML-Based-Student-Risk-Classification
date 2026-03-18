import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, KeyRound } from 'lucide-react';

const ChangePassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch('http://localhost:8000/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    old_password: oldPassword,
                    new_password: newPassword,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to change password');
            }

            setSuccess('Password changed successfully. You can now login with your new password.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full bg-slate-50 items-center justify-center relative overflow-hidden p-4">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-3xl animate-float delay-1000" />
            </div>

            <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/50 z-10">
                <div className="mb-6 flex justify-start">
                    <Link to="/login" className="text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-medium">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>

                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-500/30">
                        <KeyRound size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Change Password</h1>
                    <p className="text-slate-500 mt-2 text-sm">Update your account access credentials.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                        <div className="w-1 h-4 bg-red-500 rounded-full" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-xl text-sm font-medium border border-green-100 flex items-center gap-2">
                        <div className="w-1 h-4 bg-green-500 rounded-full" />
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-3 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                placeholder="name@university.edu"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-1">Old Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-1">New Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-3 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || success}
                        className="w-full btn-primary py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/25 mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            "Update Password"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
