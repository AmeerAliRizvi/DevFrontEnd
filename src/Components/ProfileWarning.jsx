import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight } from 'lucide-react';

const ProfileWarning = () => {
  const user = useSelector((store) => store.user);

  if (!user) return null;

  //Check if essential fields are missing
  const isProfileIncomplete = 
    !user.about || 
    !user.skills || 
    user.skills.length === 0 || 
    !user.externalLinks?.github || 
    !user.externalLinks?.linkedin;

  if (!isProfileIncomplete) return null;

  return (
    <div className="mx-6 mb-6 p-4 bg-orange-50 border border-orange-200 rounded-2xl animate-fade-in-up shadow-sm">
      <div className="flex items-center gap-2 mb-2 text-orange-800 font-bold text-sm">
        <AlertTriangle size={18} className="text-orange-600" /> 
        Profile Incomplete
      </div>
      
      <p className="text-xs text-orange-800/80 mb-3 leading-relaxed">
        Your profile is missing details (About, Skills, or Links). Complete it to get noticed!
      </p>
      
      <Link 
        to="/profile" 
        className="flex items-center justify-center gap-2 w-full py-2 bg-orange-200 hover:bg-orange-300 text-orange-900 text-xs font-bold rounded-lg transition-colors"
      >
        Complete Now <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default ProfileWarning;