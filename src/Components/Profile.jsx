import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { addUser } from '../Utils/userSlice'; 
import { 
    Mail, User, Github, Linkedin, Link as LinkIcon, 
    Briefcase, Edit2, Save, Camera, Code, Activity, Plus, 
    Loader2, XCircle, CheckCircle, AlertCircle
} from 'lucide-react';
import api from '../utils/axiosClient';


const ensureProtocol = (url) => {
    if (!url) return "";
    return url.startsWith('http') ? url : `https://${url}`;
};

// Component: Card Container
const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] ${className}`}>
        {children}
    </div>
);

// Component: Section Label
const Label = ({ children }) => (
    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5 ml-1">
        {children}
    </span>
);

// Component: Empty State Placeholder
const EmptyState = ({ icon: Icon, text, onClick }) => (
    <div 
        onClick={onClick}
        className="flex flex-col items-center justify-center py-10 px-6 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-all group text-center"
    >
        <div className="p-3 bg-gray-50 rounded-full mb-3 group-hover:bg-purple-100 transition-colors">
            <Icon size={20} className="text-gray-400 group-hover:text-purple-600" />
        </div>
        <p className="text-sm font-medium text-gray-500 group-hover:text-purple-700">{text}</p>
        <span className="text-xs text-gray-400 mt-1">Click to add details</span>
    </div>
);

// Component: Toast Notification (Success/Error)
const Toast = ({ message, type, onClose }) => {
    if (!message) return null;
    const isError = type === 'error';
    
    return (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-full shadow-xl animate-bounce-in border ${
            isError ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
        }`}>
            {isError ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            <span className="text-sm font-bold">{message}</span>
            <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100"><XCircle size={16}/></button>
        </div>
    );
};


export default function UserProfilePage() {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    
    // UI States
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Notification State
    const [toast, setToast] = useState({ message: null, type: '' });

    // Form Data State
    const [formData, setFormData] = useState(null);
    const fileInputRef = useRef(null);

    // Sync Redux -> Local State
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                title: user.title || "",
                age: user.age || "",
                gender: user.gender || "male",
                about: user.about || "",
                skills: user.skills || [],
                externalLinks: {
                    github: user.externalLinks?.github || "",
                    linkedin: user.externalLinks?.linkedin || "",
                    portfolio: user.externalLinks?.portfolio || ""
                },
                photoUrl: user.photoUrl || "https://i.pravatar.cc/300",
                status: user.status || "open"
            });
        }
    }, [user, isEditing]);

    // Toast Timer
    useEffect(() => {
        if (toast.message) {
            const timer = setTimeout(() => setToast({ message: null, type: '' }), 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    // --- HANDLERS ---

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSocialChange = (e) => setFormData({ 
        ...formData, externalLinks: { ...formData.externalLinks, [e.target.name]: e.target.value } 
    });

    const handleSkillsChange = (e) => setFormData({ 
        ...formData, skills: e.target.value.split(',').map(s => s.trim()) 
    });

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setFormData({ ...formData, photoUrl: url });
        }
    };

    // --- SAVE LOGIC ---
    const handleSave = async () => {
        // 1. Client-Side Validation
        if(!formData.firstName.trim() || !formData.lastName.trim()) {
            setToast({ message: "First and Last Name are required", type: "error" });
            return;
        }
        if(formData.age && (formData.age < 1 || formData.age > 100)) {
            setToast({ message: "Please enter a valid age", type: "error" });
            return;
        }

        try {
            setIsSaving(true);
            
            // 2. API Request
            const res = await api.patch(
                "/profile/edit", 
                formData,
            );

            // 3. Success
            dispatch(addUser(res.data?.data || res.data)); 
            setToast({ message: "Profile updated successfully!", type: "success" });
            setIsEditing(false);
            
        } catch (err) {
            console.error("Save failed:", err);
            const errorMsg = err.response?.data?.message || "Something went wrong. Try again.";
            setToast({ message: errorMsg, type: "error" });
        } finally {
            setIsSaving(false);
        }
    };

    if (!user || !formData) return (
        <div className="flex justify-center items-center h-screen text-gray-500 gap-2">
            <Loader2 className="animate-spin text-purple-600" /> Loading...
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-12 font-inter flex justify-center text-gray-800">
            
            {/* Toast Notification */}
            <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: null, type: '' })} />

            <div className="max-w-6xl w-full space-y-6">

                {/* --- 1. HEADER CARD --- */}
                <Card className="p-8 relative overflow-hidden group">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 pointer-events-none transition-opacity group-hover:opacity-70" />
                    
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                        {/* Avatar */}
                        <div className="relative group/avatar shrink-0">
                            <div className="w-36 h-36 rounded-full overflow-hidden shadow-lg border-4 border-white ring-1 ring-gray-100 bg-gray-50">
                                <img 
                                    src={isEditing ? formData.photoUrl : user.photoUrl} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-105"
                                    onError={(e) => { e.target.src = "https://i.pravatar.cc/300?u=error"; }}
                                />
                            </div>
                            {isEditing && (
                                <div onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-all backdrop-blur-[2px]">
                                    <Camera className="text-white mb-1" size={24} />
                                    <span className="text-white text-[9px] font-bold tracking-wide">CHANGE</span>
                                </div>
                            )}
                            <input ref={fileInputRef} type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
                        </div>

                        {/* Identity Info */}
                        <div className="flex-1 text-center md:text-left w-full flex flex-col justify-between gap-6">
                            <div className="space-y-3">
                                {isEditing ? (
                                    <div className="space-y-3 animate-fade-in-up">
                                        <div className="flex flex-col md:flex-row gap-3">
                                            <input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="text-2xl font-bold bg-white border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-xl px-4 py-2 outline-none w-full transition-all"/>
                                            <input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="text-2xl font-bold bg-white border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 rounded-xl px-4 py-2 outline-none w-full transition-all"/>
                                        </div>
                                        <input name="title" value={formData.title} onChange={handleChange} className="text-purple-600 font-medium bg-white border border-gray-300 focus:border-purple-500 rounded-xl px-4 py-2 w-full md:max-w-md" placeholder="e.g. Full Stack Developer"/>
                                    </div>
                                ) : (
                                    <>
                                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{user.firstName} {user.lastName}</h1>
                                        <p className="text-lg text-purple-600 font-medium">{user.title || <span className="text-gray-400 italic font-normal text-base">No title added</span>}</p>
                                    </>
                                )}
                            </div>

                            {/* Actions & Status */}
                            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4">
                                <div className="flex flex-col items-center md:items-start gap-1">
                                    <Label>Current Status</Label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <select 
                                                name="status" 
                                                value={formData.status} 
                                                onChange={handleChange}
                                                className="appearance-none bg-white border border-gray-300 text-sm font-bold rounded-lg pl-3 pr-8 py-2 outline-none focus:border-purple-500 cursor-pointer hover:bg-gray-50"
                                            >
                                                <option value="open">Open to Team</option>
                                                <option value="in_team">In a Team</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                <div className={`w-2 h-2 rounded-full ${formData.status === 'open' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 ${user.status === 'open' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                            <span className={`w-2 h-2 rounded-full ${user.status === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                            {user.status === 'open' ? 'OPEN TO TEAM' : 'IN A TEAM'}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    {isEditing ? (
                                        <>
                                            <button onClick={() => setIsEditing(false)} disabled={isSaving} className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50">Cancel</button>
                                            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-sm text-white bg-gray-900 hover:bg-black transition-all shadow-lg hover:shadow-xl disabled:opacity-70">
                                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} 
                                                {isSaving ? "Saving..." : "Save Changes"}
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
                                            <Edit2 size={16} /> Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* --- 2. GRID CONTENT --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT SIDEBAR */}
                    <div className="space-y-6">
                        {/* Personal Details */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-6 text-gray-900">
                                <Activity size={20} className="text-purple-600"/>
                                <h3 className="font-bold text-lg">Personal Details</h3>
                            </div>
                            <div className="space-y-5">
                                <div>
                                    <Label>Email Address</Label>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                                        <Mail size={16} className="text-gray-400 shrink-0"/>
                                        <span className="truncate select-all">{user.emailId}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Age</Label>
                                        {isEditing ? <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm font-bold focus:border-purple-500 outline-none" placeholder="-" /> : <div className="p-2.5 bg-gray-50 rounded-lg text-sm font-bold border border-gray-100 text-center">{user.age || "-"}</div>}
                                    </div>
                                    <div>
                                        <Label>Gender</Label>
                                        {isEditing ? (
                                            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white border border-gray-300 rounded-lg p-2 text-sm font-bold focus:border-purple-500 outline-none">
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        ) : (
                                            <div className="p-2.5 bg-gray-50 rounded-lg text-sm font-bold border border-gray-100 capitalize text-center">{user.gender}</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Social Links */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-6 text-gray-900">
                                <LinkIcon size={20} className="text-blue-500"/>
                                <h3 className="font-bold text-lg">Connect</h3>
                            </div>
                            <div className="space-y-3">
                                {['github', 'linkedin', 'portfolio'].map(platform => {
                                    const Icons = { github: Github, linkedin: Linkedin, portfolio: Briefcase };
                                    const Icon = Icons[platform];
                                    const rawValue = formData.externalLinks?.[platform] || "";
                                    const safeUrl = ensureProtocol(rawValue);

                                    return (
                                        <div key={platform} className="group flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                            <div className="p-2.5 bg-gray-100 rounded-lg text-gray-600 group-hover:text-purple-600 group-hover:bg-purple-50 transition-colors">
                                                <Icon size={18} />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                {isEditing ? (
                                                    <input 
                                                        name={platform} 
                                                        value={rawValue} 
                                                        onChange={handleSocialChange} 
                                                        placeholder={`Paste ${platform} URL`} 
                                                        className="w-full text-xs font-medium border-b border-gray-300 py-1 outline-none focus:border-purple-500 bg-transparent transition-all placeholder-gray-400"
                                                    />
                                                ) : (
                                                    <>
                                                        {rawValue ? (
                                                            <a href={safeUrl} target="_blank" rel="noreferrer" className="block text-sm font-medium truncate text-gray-700 hover:text-purple-700 capitalize cursor-pointer transition-colors">
                                                                {platform}
                                                            </a>
                                                        ) : (
                                                            <span className="block text-sm font-medium text-gray-300 italic cursor-not-allowed capitalize">
                                                                Not Connected
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    </div>

                    {/* MAIN CONTENT AREA */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* About Me */}
                        <Card className="p-8">
                            <div className="flex items-center gap-2 mb-4 text-gray-900">
                                <User size={20}/>
                                <h3 className="font-bold text-lg">About Me</h3>
                            </div>
                            
                            {isEditing ? (
                                <textarea 
                                    name="about" value={formData.about} onChange={handleChange} rows={6}
                                    className="w-full p-4 bg-gray-50 border border-gray-300 rounded-xl focus:bg-white focus:ring-4 focus:ring-purple-50 focus:border-purple-500 outline-none resize-none text-gray-700 leading-relaxed transition-all"
                                    placeholder="Write a short bio about your experience, interests, and what you are looking for..."
                                />
                            ) : (
                                <>
                                    {user.about ? (
                                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">{user.about}</p>
                                    ) : (
                                        <EmptyState icon={Edit2} text="Write a bio to introduce yourself" onClick={() => setIsEditing(true)} />
                                    )}
                                </>
                            )}
                        </Card>

                        {/* Tech Stack */}
                        <section className="bg-gradient-to-br from-purple-700 to-indigo-700 rounded-3xl p-8 shadow-[0_20px_40px_rgba(109,40,217,0.25)] text-white relative overflow-hidden min-h-[280px] flex flex-col justify-center">
                            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-8 -translate-y-8 pointer-events-none">
                                <Code size={180} />
                            </div>
                            
                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">Tech Arsenal</h2>
                                
                                {isEditing ? (
                                    <div className="space-y-3">
                                        <textarea 
                                            value={formData.skills?.join(', ')} 
                                            onChange={handleSkillsChange}
                                            className="w-full h-32 bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-white/50 focus:outline-none focus:border-white resize-none backdrop-blur-sm"
                                            placeholder="React, Node.js, Python, AWS..."
                                        />
                                        <p className="text-white/70 text-xs pl-1 flex items-center gap-1">
                                            <span className="bg-white/20 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">i</span> Separate skills with commas
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {user.skills && user.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2.5">
                                                {user.skills.map((skill, i) => (
                                                    <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/10 hover:bg-white/20 hover:scale-105 transition-all cursor-default shadow-sm">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div 
                                                onClick={() => setIsEditing(true)}
                                                className="flex flex-col items-center justify-center py-8 border-2 border-dashed border-white/20 rounded-2xl bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                                            >
                                                <Plus size={32} className="mb-3 opacity-60" />
                                                <p className="font-bold opacity-90 text-lg">Add your skills</p>
                                                <p className="text-sm opacity-60">List your stack to match with teams</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </section>

                    </div>
                </div>
            </div>
        </div>
    );
}