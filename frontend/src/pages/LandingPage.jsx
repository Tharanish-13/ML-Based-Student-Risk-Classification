import { Link } from 'react-router-dom';
import { Shield, Activity, Users, ArrowRight, CheckCircle, BarChart2, Zap, Award } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col overflow-x-hidden">
            <Header />

            {/* Hero Section */}
            <header className="relative pt-10 pb-20 lg:pt-15 lg:pb-32 overflow-hidden bg-slate-50">
                {/* Advanced Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none mix-blend-multiply">
                    <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/20 rounded-full blur-[100px] animate-blob" />
                    <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-violet-500/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                    <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] bg-fuchsia-400/20 rounded-full blur-[100px] animate-blob animation-delay-4000" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        <div className="w-full lg:w-1/2 text-center lg:text-left animate-fade-in-up">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-indigo-100/50 text-indigo-700 text-sm font-bold mb-8 shadow-sm hover:shadow-md transition-all">
                                <span className="relative flex h-2.5 w-5.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                                </span>
                                AI-Powered Student Success Platform
                            </div>
                            <h1 className="text-6xl lg:text-8xl font-black leading-[1.1] mb-8 tracking-tighter text-slate-900 drop-shadow-sm">
                                Predict Success. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 animate-gradient-x">
                                    Prevent Failure.
                                </span>
                            </h1>
                            <p className="text-xl lg:text-2xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                                Harness the power of Machine Learning to identify at-risk students early, intervene effectively, and drastically improve institutional outcomes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Link to="/register" className="btn-primary py-4 px-10 rounded-full text-lg font-bold shadow-2xl shadow-indigo-500/30 flex items-center justify-center gap-2 hover:-translate-y-1.5 transition-all duration-300">
                                    Get Started Now <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <a href="#features" className="py-4 px-10 rounded-full bg-white/50 backdrop-blur-md text-slate-800 border-2 border-slate-200/50 font-bold hover:bg-white hover:border-indigo-200 hover:text-indigo-700 transition-all duration-300 flex items-center justify-center group hover:shadow-lg">
                                    Learn More
                                </a>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/2 relative animate-fade-in-right delay-200 hidden md:block">
                            <div className="relative z-10 glass-panel p-6 rounded-3xl shadow-2xl border border-white/50 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center animate-bounce delay-1000 z-20">
                                    <div className="text-center">
                                        <div className="text-emerald-500 font-bold text-xl">98%</div>
                                        <div className="text-xs text-slate-500">Accuracy</div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            <Activity size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">Risk Analysis</div>
                                            <div className="text-xs text-slate-500">Real-time monitoring</div>
                                        </div>
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold">Alert</div>
                                </div>

                                <div className="space-y-3">
                                    <div className="h-24 bg-slate-100 rounded-xl w-full flex items-end justify-between p-2 pb-0 gap-2">
                                        <div className="w-1/6 bg-indigo-200 rounded-t-lg h-[40%]"></div>
                                        <div className="w-1/6 bg-indigo-300 rounded-t-lg h-[60%]"></div>
                                        <div className="w-1/6 bg-indigo-500 rounded-t-lg h-[80%]"></div>
                                        <div className="w-1/6 bg-indigo-400 rounded-t-lg h-[50%]"></div>
                                        <div className="w-1/6 bg-indigo-600 rounded-t-lg h-[90%]"></div>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-400 px-1">
                                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">Intervention Success</div>
                                            <div className="text-xs text-slate-500">+24% vs last semester</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative elements behind card */}
                            <div className="absolute top-10 right-10 w-full h-full bg-indigo-600/5 rounded-3xl -z-10 transform rotate-6"></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="py-32 bg-white relative z-10 overflow-hidden">
                <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20 animate-fade-in-up">
                        <h2 className="text-sm font-black text-indigo-600 tracking-widest uppercase mb-4 flex items-center justify-center gap-2">
                            <Zap size={16} className="text-indigo-500 fill-indigo-500" /> Key Features
                        </h2>
                        <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Designed for Modern Education</h3>
                        <p className="text-slate-500 text-xl font-medium">Everything you need to move from reactive to proactive student support, beautifully crafted.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
                        {/* Decorative background for grid */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-50/30 rounded-full blur-3xl -z-10"></div>

                        {/* Feature 1 */}
                        <div className="group p-10 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-500"></div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <BarChart2 size={32} />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Predictive Analytics</h4>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Our advanced ML models analyze patterns in attendance and grades to forecast student outcomes with unprecedented accuracy.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group p-10 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-fuchsia-500/10 transition-all duration-500 hover:-translate-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-500"></div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-fuchsia-700 text-white flex items-center justify-center mb-8 shadow-lg shadow-fuchsia-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <Shield size={32} />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Secure & Compliant</h4>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Enterprise-grade security ensures student data privacy with strict role-based access controls for seamless staff and student experiences.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group p-10 rounded-[2rem] bg-white/60 backdrop-blur-xl border border-white shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:-translate-y-3 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full -z-10 transition-transform group-hover:scale-150 duration-500"></div>
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white flex items-center justify-center mb-8 shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                <Zap size={32} />
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Real-time Actions</h4>
                            <p className="text-slate-500 leading-relaxed font-medium">
                                Get instant alerts and actionable insights. Intervene exactly at the right moment to make a profound difference in a student's journey.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-32 bg-slate-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50/50 to-transparent -z-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2">
                            <h3 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-8 tracking-tight">Why Educational Leaders <span className="text-indigo-600">Choose Us</span></h3>
                            <div className="space-y-8">
                                <div className="flex gap-6 group hover:-translate-y-1 transition-transform">
                                    <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 text-xl font-bold shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">1</div>
                                    <div>
                                        <h5 className="text-xl font-bold text-slate-900 mb-2">Early Detection System</h5>
                                        <p className="text-slate-600 font-medium leading-relaxed">Identify at-risk students weeks before traditional methods, allowing for timely, decisive support.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group hover:-translate-y-1 transition-transform">
                                    <div className="w-14 h-14 rounded-2xl bg-fuchsia-100 flex-shrink-0 flex items-center justify-center text-fuchsia-600 text-xl font-bold shadow-sm group-hover:bg-fuchsia-600 group-hover:text-white transition-colors duration-300">2</div>
                                    <div>
                                        <h5 className="text-xl font-bold text-slate-900 mb-2">Data-Driven Decisions</h5>
                                        <p className="text-slate-600 font-medium leading-relaxed">Move beyond intuition. Base your crucial academic strategies on concrete data and actionable trends.</p>
                                    </div>
                                </div>
                                <div className="flex gap-6 group hover:-translate-y-1 transition-transform">
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 text-xl font-bold shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">3</div>
                                    <div>
                                        <h5 className="text-xl font-bold text-slate-900 mb-2">Student Empowerment</h5>
                                        <p className="text-slate-600 font-medium leading-relaxed">Give students secure visibility into their own risk factors, encouraging active self-correction.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 relative">
                            {/* Decorative frame elements */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-3xl opacity-20 blur-2xl -z-10 animate-pulse"></div>
                            <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-200 rounded-full blur-3xl -z-10"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-fuchsia-200 rounded-full blur-3xl -z-10"></div>

                            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-[8px] border-white/80 bg-white">
                                <img
                                    src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=2070&auto=format&fit=crop"
                                    alt="Team working"
                                    className="w-full h-auto transform hover:scale-110 transition-transform duration-[2s] ease-in-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-8">
                                    <div className="text-white transform translate-y-4 hover:translate-y-0 transition-transform duration-300">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-yellow-400/20 rounded-lg backdrop-blur-md">
                                                <Award size={24} className="text-yellow-400 fill-yellow-400" />
                                            </div>
                                            <span className="font-bold tracking-wider text-sm text-yellow-50 uppercase">Award Winning Platform</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 bg-slate-900 relative overflow-hidden">
                <div className="absolute inset-0 z-0 mix-blend-color-dodge">
                    <div className="absolute top-0 right-[-20%] w-[70%] h-[120%] bg-gradient-to-bl from-indigo-600/40 to-transparent rotate-12 blur-3xl"></div>
                    <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[120%] bg-gradient-to-tr from-fuchsia-600/30 to-transparent -rotate-12 blur-3xl"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 text-white">
                    <h2 className="text-5xl lg:text-7xl font-black mb-8 tracking-tight leading-tight">
                        Ready to Transform <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Your Institution?</span>
                    </h2>
                    <p className="text-2xl text-indigo-100 max-w-2xl mx-auto mb-12 font-medium leading-relaxed opacity-90">
                        Join hundreds of forward-thinking educators using advanced AI to ensure no student ever falls through the cracks again.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link to="/register" className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-bold py-5 px-12 rounded-full text-xl shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 hover:bg-indigo-50 transition-all duration-300">
                            Create Free Account <ArrowRight size={24} className="text-indigo-600" />
                        </Link>
                    </div>
                    <p className="mt-8 text-sm font-medium text-indigo-200/60 uppercase tracking-widest">No credit card required • Instant Implementation</p>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
