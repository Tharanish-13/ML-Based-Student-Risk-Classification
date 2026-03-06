import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Video, Users, HelpCircle, ExternalLink, Activity } from 'lucide-react';

const StudentResources = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:8000/students/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
        } catch (err) {
            console.error('Failed to fetch profile for resources', err);
        } finally {
            setLoading(false);
        }
    };

    const getRecommendations = () => {
        const risk = profile?.risk_level || 'Unknown';

        const generalResources = [
            { title: "Library Database Access", desc: "Access thousands of journals and books.", icon: <BookOpen className="text-blue-500" />, link: "#" },
            { title: "Writing Center", desc: "Get help with formatting and essays.", icon: <FileText className="text-green-500" />, link: "#" },
        ];

        const highRiskResources = [
            { title: "Priority Advising Appointment", desc: "Schedule a 1-on-1 session immediately.", icon: <Users className="text-red-500" />, link: "#", urgent: true },
            { title: "Tutoring Center (Math & Science)", desc: "Free peer tutoring available daily.", icon: <HelpCircle className="text-orange-500" />, link: "#", urgent: true },
            { title: "Time Management Workshop", desc: "Learn how to effectively balance study hours.", icon: <Activity className="text-purple-500" />, link: "#" },
        ];

        const moderateRiskResources = [
            { title: "Study Group Matcher", desc: "Find peers in your courses to study with.", icon: <Users className="text-indigo-500" />, link: "#" },
            { title: "Lecture Recording Archive", desc: "Review past lectures you might have missed.", icon: <Video className="text-blue-500" />, link: "#" },
        ];

        if (risk === 'High') {
            return [...highRiskResources, ...generalResources];
        } else if (risk === 'Moderate') {
            return [...moderateRiskResources, ...generalResources];
        }
        return generalResources;
    };

    if (loading) return <div className="text-center py-20 text-gray-500">Loading resources...</div>;

    const resources = getRecommendations();

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 mb-2">
                        Help Center & Resources
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Curated materials and support links just for you.
                    </p>
                </div>
                {profile && (
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm text-gray-500 mb-1">Current Status:</span>
                        <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm 
                             ${profile.risk_level === 'High' ? 'bg-red-100 text-red-700 border border-red-200' :
                                profile.risk_level === 'Moderate' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                    'bg-green-100 text-green-700 border border-green-200'}`}>
                            {profile.risk_level} Risk
                        </span>
                    </div>
                )}
            </div>

            {profile?.risk_level === 'High' && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-5 rounded-r-xl mb-8 shadow-sm">
                    <h3 className="text-red-800 font-bold text-lg mb-1 flex items-center gap-2">
                        <AlertCircle size={20} /> Urgent Action Recommended
                    </h3>
                    <p className="text-red-700/80">
                        We've noticed your academic performance needs attention. Please utilize the priority resources below, especially scheduling an advising appointment.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((res, idx) => (
                    <a key={idx} href={res.link} className="group block relative h-full">
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${res.urgent ? 'from-red-400 to-orange-500' : 'from-indigo-400 to-blue-500'} rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300`}></div>
                        <div className="relative h-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${res.urgent ? 'bg-red-50' : 'bg-blue-50'}`}>
                                    {res.icon}
                                </div>
                                <ExternalLink size={18} className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-700 transition-colors">
                                {res.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed flex-1">
                                {res.desc}
                            </p>
                            {res.urgent && (
                                <div className="mt-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    Priority
                                </div>
                            )}
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

// Need to import FileText in the file, doing it quickly here
import { FileText, AlertCircle } from 'lucide-react';

export default StudentResources;
