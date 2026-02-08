import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axiosClient'; // Your axios instance
import { 
    Mail, Github, Linkedin, Briefcase, Link as LinkIcon, 
    MapPin, Calendar, UserPlus, UserCheck, X, Check, 
    Code, Activity, Sparkles, MessageSquare
} from 'lucide-react';

const ensureProtocol = (url) => {
    if (!url) return "";
    return url.startsWith('http') ? url : `https://${url}`;
};

const Card = ({ children, className = "" }) => (
    <div className={`bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${className}`}>
        {children}
    </div>
);

// Loading Skeleton Component
const ProfileSkeleton = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="h-64 bg-gray-200 rounded-3xl w-full"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded-3xl"></div>
            <div className="lg:col-span-2 space-y-6">
                <div className="h-40 bg-gray-200 rounded-3xl"></div>
                <div className="h-64 bg-gray-200 rounded-3xl"></div>
            </div>
        </div>
    </div>
);

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [connectionStatus, setConnectionStatus] = useState("none"); // none | interested | accepted | ignored

    // Fetch User Data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/profile/view/" + userId);
                setUser(res.data.data);
                
            } catch (err) {
                console.error("Failed to fetch user", err);
                // navigate("/feed"); // Redirect if user not found
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId, navigate]);

    // Handle Connection Actions
    const handleConnect = async (status) => {
        try {
            
            setConnectionStatus(status);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="min-h-screen bg-gray-50 pt-10"><ProfileSkeleton /></div>;
    if (!user) return <div className="text-center pt-20">User not found</div>;

    return (
        <div className="min-h-screen bg-[#F8F9FB] font-inter text-gray-800 relative overflow-x-hidden">
            
           
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-100/50 to-transparent pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-12 space-y-8">
             
                <Card className="p-0 overflow-hidden group">
                    {/* Decorative Banner */}
                    <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-20 pattern-grid-lg"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12">
                            
                            {/* Avatar */}
                            <div className="relative">
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-[6px] border-white bg-white shadow-xl overflow-hidden">
                                    <img 
                                        src={user.photoUrl || "https://i.pravatar.cc/300"} 
                                        alt={user.firstName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { e.target.src = "https://i.pravatar.cc/300?u=error"; }}
                                    />
                                </div>
                                <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${user.status === 'open' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                            </div>

                            {/* Name & Headline */}
                            <div className="flex-1 pt-2 text-center md:text-left">
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight flex items-center justify-center md:justify-start gap-2">
                                    {user.firstName} {user.lastName}
                                    {/* Optional Verification Badge */}
                                    {/* <Sparkles size={20} className="text-yellow-500 fill-yellow-500" /> */}
                                </h1>
                                <p className="text-lg text-purple-600 font-semibold mt-1 mb-2">
                                    {user.title || "Developer"}
                                </p>
                                <div className={`w-fit shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${user.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                            <span className={`w-2 h-2 rounded-full ${user.status === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                            {user.status === 'open' ? 'OPEN TO TEAM' : 'IN A TEAM'}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* --- GRID CONTENT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* SIDEBAR */}
                    <div className="space-y-6">
                        {/* Socials */}
                        <Card className="p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <LinkIcon size={18} className="text-purple-600"/> Social Presence
                            </h3>
                            <div className="space-y-3">
                                {['github', 'linkedin', 'portfolio'].map(platform => {
                                    const link = user.externalLinks?.[platform];
                                    if(!link) return null;
                                    
                                    const Icons = { github: Github, linkedin: Linkedin, portfolio: Briefcase };
                                    const Icon = Icons[platform];

                                    return (
                                        <a 
                                            key={platform}
                                            href={ensureProtocol(link)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-purple-50 hover:text-purple-700 transition-all group border border-transparent hover:border-purple-100"
                                        >
                                            <Icon size={18} className="text-gray-500 group-hover:text-purple-600"/>
                                            <span className="font-semibold capitalize text-sm">{platform}</span>
                                        </a>
                                    )
                                })}
                                {/* Fallback if no links */}
                                {!user.externalLinks?.github && !user.externalLinks?.linkedin && !user.externalLinks?.portfolio && (
                                    <div className="text-center py-4 text-gray-400 text-sm italic">No links shared</div>
                                )}
                            </div>
                        </Card>
                        
                        {/* Contact (Only if connected or public) */}
                        <Card className="p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Mail size={18} className="text-purple-600"/> Contact
                            </h3>
                            <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900 font-medium text-sm break-all">
                                {user.emailId}
                            </div>
                        </Card>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* About */}
                        <Card className="p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Sparkles size={20} className="text-yellow-500 fill-yellow-500"/> About Me
                            </h3>
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                {user.about || <span className="italic text-gray-400">This user hasn't written a bio yet.</span>}
                            </p>
                        </Card>

                        {/* Tech Stack (Enhanced) */}
                        <div className="bg-gradient-to-br from-[#1A1A2E] to-[#16213E] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <Code size={200} />
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <Activity className="text-purple-400" /> Tech Arsenal
                                </h3>
                                
                                {user.skills && user.skills.length > 0 ? (
                                    <div className="flex flex-wrap gap-3">
                                        {user.skills.map((skill, index) => (
                                            <span 
                                                key={index} 
                                                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl backdrop-blur-md transition-all cursor-default select-none shadow-sm"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-white/50 italic">No skills listed yet.</div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;