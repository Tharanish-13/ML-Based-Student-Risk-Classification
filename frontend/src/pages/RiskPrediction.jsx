import { useState } from 'react';
import api from '../api';
import { Activity, AlertTriangle, CheckCircle, HelpCircle, Brain, Target, Clock, BookOpen } from 'lucide-react';

const RiskPrediction = () => {
    const [formData, setFormData] = useState({
        attendance: 75,
        marks: 60,
        assignments: 5,
        study_hours: 2
    });
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate a slight delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const res = await api.post('/predict-risk', formData);
            setPrediction(res.data.risk);
        } catch (err) {
            console.error("Prediction failed");
        } finally {
            setLoading(false);
        }
    };

    const getRiskInfo = (risk) => {
        switch (risk) {
            case "High":
                return {
                    color: "text-red-600",
                    bg: "bg-red-50",
                    gradient: "from-red-500 to-orange-600",
                    border: "border-red-500",
                    icon: <AlertTriangle className="w-16 h-16 text-white mb-4 animate-bounce" />,
                    title: "High Risk Detected",
                    msg: "Immediate intervention required. Student shows multiple warning signs."
                };
            case "Medium":
            case "Moderate":
                return {
                    color: "text-amber-600",
                    bg: "bg-amber-50",
                    gradient: "from-amber-400 to-orange-500",
                    border: "border-amber-500",
                    icon: <Activity className="w-16 h-16 text-white mb-4 animate-pulse" />,
                    title: "Moderate Risk",
                    msg: "Monitor closely. Student may need additional support mechanisms."
                };
            case "Low":
                return {
                    color: "text-emerald-600",
                    bg: "bg-emerald-50",
                    gradient: "from-emerald-400 to-teal-500",
                    border: "border-emerald-500",
                    icon: <CheckCircle className="w-16 h-16 text-white mb-4 animate-float" />,
                    title: "On Track",
                    msg: "Student is performing well and is currently in the safe zone."
                };
            default:
                return {
                    color: "text-slate-600",
                    bg: "bg-slate-50",
                    gradient: "from-slate-400 to-slate-500",
                    border: "border-slate-300",
                    icon: <HelpCircle className="w-16 h-16 text-white mb-4" />,
                    title: "Unknown Status",
                    msg: "Unable to determine risk level."
                };
        }
    };

    const riskInfo = prediction ? getRiskInfo(prediction) : null;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
            <div className="text-center space-y-2 mb-10">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                    AI Risk Analysis
                </h1>
                <p className="text-slate-500 text-lg">Predict student performance outcomes using machine learning</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 glass-panel p-8 rounded-3xl shadow-xl shadow-indigo-500/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />

                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                        <Brain className="w-6 h-6 text-indigo-600" /> Assessment Parameters
                    </h2>

                    <form onSubmit={handlePredict} className="space-y-8 relative z-10">
                        <div className="space-y-4">
                            <label className="flex justify-between text-sm font-medium text-slate-700">
                                <span className="flex items-center gap-2"><Clock size={16} className="text-indigo-500" /> Attendance</span>
                                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">{formData.attendance}%</span>
                            </label>
                            <input
                                type="range"
                                name="attendance"
                                min="0"
                                max="100"
                                value={formData.attendance}
                                onChange={handleChange}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                            <div className="flex justify-between text-xs text-slate-400 px-1">
                                <span>0%</span>
                                <span>Critical</span>
                                <span>50%</span>
                                <span>Good</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="flex justify-between text-sm font-medium text-slate-700">
                                <span className="flex items-center gap-2"><Target size={16} className="text-indigo-500" /> Academic Performance</span>
                                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">{formData.marks}%</span>
                            </label>
                            <input
                                type="range"
                                name="marks"
                                min="0"
                                max="100"
                                value={formData.marks}
                                onChange={handleChange}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                            />
                            <div className="flex justify-between text-xs text-slate-400 px-1">
                                <span>0</span>
                                <span>Passing</span>
                                <span>50</span>
                                <span>Distinction</span>
                                <span>100</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <BookOpen size={16} className="text-indigo-500" /> Assignments
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="assignments"
                                        min="0"
                                        max="10"
                                        value={formData.assignments}
                                        onChange={handleChange}
                                        className="w-full pl-4 pr-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                                    />
                                    <span className="absolute right-4 top-3 text-xs text-slate-400 uppercase font-medium tracking-wider pointer-events-none">/ 10</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Clock size={16} className="text-indigo-500" /> Study Hours
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="study_hours"
                                        min="0"
                                        step="0.5"
                                        value={formData.study_hours}
                                        onChange={handleChange}
                                        className="w-full pl-4 pr-12 py-3 bg-white/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-semibold text-slate-700"
                                    />
                                    <span className="absolute right-4 top-3 text-xs text-slate-400 uppercase font-medium tracking-wider pointer-events-none">Daily</span>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 rounded-xl font-bold text-lg shadow-xl shadow-indigo-500/30 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Running Model...
                                </>
                            ) : (
                                <>
                                    <Brain className="group-hover:rotate-12 transition-transform" /> Predict Risk Level
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="lg:col-span-5 h-full">
                    {prediction ? (
                        <div className={`h-full glass-panel p-8 rounded-3xl shadow-xl flex flex-col items-center justify-center text-center animate-fade-in-up border-0 relative overflow-hidden`}>
                            <div className={`absolute inset-0 bg-gradient-to-br ${riskInfo.gradient} opacity-90 z-0`} />

                            {/* Decorative Circles */}
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16 z-0" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-3xl -ml-16 -mb-16 z-0" />

                            <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
                                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-6 shadow-inner ring-4 ring-white/10">
                                    {riskInfo.icon}
                                </div>
                                <h3 className="text-white text-lg font-medium opacity-90 mb-1 tracking-wider uppercase">Risk Assessment</h3>
                                <h2 className="text-5xl font-black text-white mb-6 tracking-tight drop-shadow-sm">{riskInfo.title}</h2>
                                <p className="text-white/90 text-lg leading-relaxed max-w-xs backdrop-blur-sm bg-white/10 p-4 rounded-xl border border-white/10">
                                    {riskInfo.msg}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] glass-panel p-8 rounded-3xl shadow-lg border border-dashed border-slate-300 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 animate-float">
                                <Brain className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Analyze</h3>
                            <p className="text-slate-500 max-w-xs mx-auto">
                                Adjust the parameters on the left and click "Predict Risk Level" to see AI-generated insights.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RiskPrediction;
