import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="mt-auto border-t border-white/20 bg-white/40 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-4 group cursor-pointer">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30 transition-transform group-hover:scale-110">
                                SR
                            </div>
                            <span className="font-bold text-xl text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">StudentRisk</span>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">
                            Empowering educators with AI-driven insights to support student success and prevent dropout.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link to="#" className="hover:text-indigo-600 transition-colors">Features</Link></li>
                            <li><Link to="#" className="hover:text-indigo-600 transition-colors">Security</Link></li>
                            <li><Link to="#" className="hover:text-indigo-600 transition-colors">Pricing</Link></li>
                            <li><Link to="#" className="hover:text-indigo-600 transition-colors">Updates</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-slate-500">
                            <li><Link to="#" className="hover:text-indigo-600 transition-colors">About</Link></li>
                            <li><Link to="#" className="hover:text-indigo-600 transition-colors">Careers</Link></li>
                            <li><Link to="#" className="hover:text-indigo-600 transition-colors">Blog</Link></li>
                            <li><Link to="#" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-800 mb-4">Developer</h4>
                        <p className="text-sm text-slate-500 mb-2">Developed by Tharanish</p>
                        <p className="text-sm text-slate-500 mb-4">ML-Based Student Risk System</p>
                        <div className="flex gap-4">
                            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors transform hover:scale-110"><Github size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors transform hover:scale-110"><Twitter size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-blue-700 transition-colors transform hover:scale-110"><Linkedin size={20} /></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-200/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-400">© 2026 StudentRisk. All rights reserved.</p>
                    <p className="text-sm text-slate-400 flex items-center gap-1">
                        Made with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> for Education
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
