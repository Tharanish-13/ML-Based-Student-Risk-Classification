import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Brain, Mail, Lock, ArrowRight, User } from 'lucide-react';

const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const data = await login(email, password);
            if (data.role === 'staff' || data.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/student-dashboard');
            }
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full bg-slate-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 rounded-full blur-3xl animate-float delay-1000" />
            </div>

            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10 animate-fade-in-right">
                <div className="w-full max-w-md bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/50">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-500/30">
                            <Brain size={24} />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
                        <p className="text-slate-500 mt-2">Sign in to access your student risk analytics dashboard.</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2 animate-shake">
                            <div className="w-1 h-4 bg-red-500 rounded-full" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    placeholder="name@university.edu"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-slate-700">Password</label>
                                <Link to="/change-password" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">Change Password</Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/25 mt-2 flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        Don't have an account? <Link to="/register" className="text-indigo-600 font-bold hover:underline">Create Account</Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Decorative Panel */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?q=80&w=2070&auto=format&fit=crop"
                        alt="Analytics Dashboard"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90 mix-blend-multiply" />
                </div>

                <div className="relative z-10 max-w-lg p-12 text-white animate-fade-in-up delay-300">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                        <Brain className="text-white w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-bold mb-6 leading-tight">Empowering Educators with AI-Driven Insights</h2>
                    <p className="text-indigo-100 text-lg leading-relaxed mb-8">
                        Our platform helps you identify at-risk students early, allowing for timely intervention and improved academic outcomes.
                    </p>

                </div>
            </div>
        </div>
    );
};

export default Login;
