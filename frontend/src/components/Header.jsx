import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, ChevronDown, LayoutDashboard, Users, BookOpen, Settings, User, AlertCircle, Upload, Bell, HelpCircle, PieChart } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef(null);

    const getNavLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isActive
                ? 'bg-white text-indigo-700 shadow-md shadow-indigo-100/50 ring-1 ring-indigo-50 transform scale-105'
                : 'text-slate-500 hover:text-indigo-600 hover:bg-white/80 hover:shadow-sm hover:-translate-y-0.5'
            }`;
    };

    // Close profile dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'U';
    };

    return (
        <header className="sticky top-0 z-50 w-full transition-all duration-500 border-b border-white/50 bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo and Desktop Nav */}
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="w-9 h-9 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20 transition-all duration-300 group-hover:scale-105 group-hover:rotate-3">
                                SR
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-800">StudentRisk</span>
                        </Link>

                        {/* Desktop Navigation */}
                        {user && (
                            <nav className="hidden md:flex space-x-1.5 items-center bg-slate-100/60 p-1.5 rounded-full border border-slate-200/60 backdrop-blur-md shadow-inner">
                                {user.role !== 'admin' && (
                                    <Link to={user.role === 'student' ? '/student-dashboard' : '/dashboard'}
                                        className={getNavLinkClass(user.role === 'student' ? '/student-dashboard' : '/dashboard')}>
                                        <LayoutDashboard size={16} /> Dashboard
                                    </Link>
                                )}
                                {user.role === 'staff' && (
                                    <>
                                        <Link to="/students" className={getNavLinkClass('/students')}>
                                            <Users size={16} /> Students
                                        </Link>
                                        <Link to="/staff/alerts" className={getNavLinkClass('/staff/alerts')}>
                                            <AlertCircle size={16} /> Alerts
                                        </Link>
                                        <Link to="/staff/batch-upload" className={getNavLinkClass('/staff/batch-upload')}>
                                            <Upload size={16} /> Upload CSV
                                        </Link>
                                        <Link to="/add-student" className={getNavLinkClass('/add-student')}>
                                            <Users size={16} /> Add Student
                                        </Link>
                                        <Link to="/analytics" className={getNavLinkClass('/analytics')}>
                                            <PieChart size={16} /> Analytics
                                        </Link>
                                    </>
                                )}
                                {user.role === 'admin' && (
                                    <>
                                        <Link to="/admin/dashboard" className={getNavLinkClass('/admin/dashboard')}>
                                            <PieChart size={16} /> Analytics
                                        </Link>
                                        <Link to="/admin/users" className={getNavLinkClass('/admin/users')}>
                                            <Users size={16} /> Users
                                        </Link>
                                    </>
                                )}
                                {user.role !== 'admin' && (
                                    <Link to="/predict" className={getNavLinkClass('/predict')}>
                                        <BookOpen size={16} /> Predict Risk
                                    </Link>
                                )}
                                {user.role === 'student' && (
                                    <>
                                        <Link to="/student/notifications" className={getNavLinkClass('/student/notifications')}>
                                            <Bell size={16} /> Notifications
                                        </Link>
                                        <Link to="/student/resources" className={getNavLinkClass('/student/resources')}>
                                            <HelpCircle size={16} /> Resources
                                        </Link>
                                    </>
                                )}
                            </nav>
                        )}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-3 focus:outline-none p-1.5 pr-4 hover:bg-slate-100/80 rounded-full transition-all duration-300 border border-transparent hover:border-slate-200/60 shadow-sm hover:shadow group"
                                >
                                    <div className="hidden text-right md:block transition-transform group-hover:-translate-x-1">
                                        <p className="text-sm font-bold text-slate-700 leading-tight">{user.name}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{user.role}</p>
                                    </div>
                                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 shadow-sm">
                                        {getInitials(user.name)}
                                    </div>
                                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown */}
                                {isProfileOpen && (
                                    <div className="absolute right-0 mt-2 w-72 glass-panel rounded-2xl shadow-xl py-2 animate-fade-in-up origin-top-right z-50">
                                        <div className="px-5 py-4 border-b border-slate-100/50">
                                            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                                        </div>

                                        <div className="p-2">
                                            <Link
                                                to="/profile"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                    <User size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">My Profile</p>
                                                    <p className="text-xs text-slate-400">Account settings</p>
                                                </div>
                                            </Link>
                                            <Link
                                                to="/settings"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors group mt-1"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                    <Settings size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Settings</p>
                                                    <p className="text-xs text-slate-400">App preferences</p>
                                                </div>
                                            </Link>
                                            <Link
                                                to="/support"
                                                onClick={() => setIsProfileOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors group mt-1"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                    <HelpCircle size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Support</p>
                                                    <p className="text-xs text-slate-400">Get Help</p>
                                                </div>
                                            </Link>
                                        </div>

                                        <div className="px-5 py-3 border-t border-b border-slate-100/50 bg-slate-50/50">
                                            <div className="space-y-2">
                                                {user.department && (
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Department</span>
                                                        <span className="font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">{user.department}</span>
                                                    </div>
                                                )}
                                                {user.year && (
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-slate-500">Year</span>
                                                        <span className="font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">{user.year}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Role</span>
                                                    <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 capitalize">{user.role}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 transition-colors">
                                                    <LogOut size={16} />
                                                </div>
                                                <span className="font-medium">Sign out</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-slate-500 hover:text-indigo-600 font-medium text-sm transition-colors">Login</Link>
                                <Link to="/register" className="btn-primary px-5 py-2 rounded-full text-sm font-medium shadow-lg shadow-indigo-500/20">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
