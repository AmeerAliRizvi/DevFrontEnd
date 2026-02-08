import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, X, Briefcase, Users, Sparkles, Hash } from 'lucide-react';

const UserCard = ({ user, onAction, onClick }) => {
  if (!user) return null;

  const {
    firstName = 'Developer',
    lastName = '',
    photoUrl = 'https://i.pravatar.cc/300',
    title, 
    about,
    skills = [],
    status = 'open',
    _id
  } = user;

  const normalizedStatus = status ? status.toLowerCase() : 'open';
  const isInTeam = normalizedStatus.includes('in_team') || normalizedStatus.includes('in-team');

  const displayTitle = title || 'Software Engineer';

  const displayAbout = about && about.trim().length > 0 ? about : "No bio available.";

  const safeSkills = Array.isArray(skills) ? skills : [];
  const displaySkills = safeSkills.slice(0, 3);
  const remainingSkills = safeSkills.length - 3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      onClick={onClick}
      className="group relative w-full max-w-[320px] mx-auto bg-white rounded-[24px] overflow-hidden shadow-lg shadow-gray-100 border border-gray-100 flex flex-col h-full"
    >
      
      <div className={`h-24 w-full relative transition-colors duration-300 ${isInTeam ? 'bg-amber-50' : 'bg-purple-50'}`}>
       
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(${isInTeam ? '#10b981' : '#a855f7'} 0.5px, transparent 0)`, backgroundSize: '10px 10px' }}></div>

        <div className={`
          absolute top-3 right-3 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider 
          flex items-center gap-1.5 border shadow-sm bg-white
          ${isInTeam 
            ? 'text-amber-600 border-amber-100' 
            : 'text-purple-600 border-purple-100'}
        `}>
          {isInTeam ? (
            <> <Users size={12} /> In a Team </>
          ) : (
            <> <Sparkles size={12} /> Open to Team </>
          )}
        </div>
      </div>

      <div className="px-5 relative flex flex-col items-center -mt-12 flex-1">
        
        <div className="mb-3">
          <div className="p-1.5 bg-white rounded-2xl shadow-sm">
            <img 
              src={photoUrl} 
              alt={firstName}
              className="w-24 h-24 rounded-xl object-cover border border-gray-100 bg-gray-50"
              onError={(e) => { e.target.src = 'https://i.pravatar.cc/300'; }} 
            />
          </div>
        </div>
        <div className="text-center w-full">
          <h2 className="text-xl font-bold text-gray-900 truncate px-1">
            {firstName} {lastName}
          </h2>
          
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <Briefcase size={12} className={isInTeam ? "text-amber-400" : "text-gray-400"} />
            <p className={`text-xs font-bold uppercase tracking-wide truncate max-w-[200px] ${isInTeam ? 'text-amber-600' : 'text-purple-600'}`}>
               {displayTitle}
            </p>
          </div>

          {/* ABOUT SECTION */}
          <p className="text-sm text-gray-500 mt-3 leading-relaxed line-clamp-2 min-h-[2.5rem] px-1" title={displayAbout}>
            {displayAbout}
          </p>
        </div>

        {/* Skills */}
        <div className="w-full flex flex-wrap justify-center gap-2 mt-5 mb-6">
          {safeSkills.length > 0 ? (
            <>
              {displaySkills.map((skill, i) => (
                <span key={i} className={`
                  px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide rounded-lg border 
                  ${isInTeam 
                    ? 'bg-amber-50 text-amber-600 border-amber-100' 
                    : 'bg-gray-50 text-gray-600 border-gray-100'}
                `}>
                  {skill}
                </span>
              ))}
              {remainingSkills > 0 && (
                <span className={`
                  px-2 py-1 text-[10px] font-bold rounded-lg border
                  ${isInTeam 
                    ? 'bg-amber-50 text-amber-500 border-amber-100' 
                    : 'bg-purple-50 text-purple-500 border-purple-100'}
                `}>
                  +{remainingSkills}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-gray-300 italic py-1 flex items-center gap-1">
               <Hash size={12} /> No skills listed
            </span>
          )}
        </div>
      </div>

      {/* --- ACTIONS --- */}
      <div className="p-4 pt-0 mt-auto flex gap-3">
        
        {/* Pass Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onAction('ignored', _id); }}
          className="w-12 h-12 rounded-xl flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-colors bg-white shadow-sm"
        >
          <X size={20} />
        </button>

        {/* Connect Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onAction('interested', _id); }}
          className={`
            flex-1 h-12 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 text-white
            ${isInTeam 
              ? 'bg-amber-500 hover:bg-amber-600 hover:shadow-amber-200' 
              : 'bg-purple-600 hover:bg-purple-700 hover:shadow-purple-200 hover:-translate-y-0.5'}
          `}
        >
           <UserPlus size={18} /> Connect
        </button>

      </div>

    </motion.div>
  );
};

export default UserCard;