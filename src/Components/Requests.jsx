import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../Utils/requestSlice"; 
import { addOneConnection } from "../Utils/connectionSlice";     
import api from "../utils/axiosClient";
import { Check, X, ShieldAlert, Cpu } from "lucide-react"; 
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);
  const navigate = useNavigate(); 

  const [showReqToast, setShowReqToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const getRequest = async () => {
    try {
      const res = await api.get("/user/request/recieved", { withCredentials: true });
      dispatch(addRequest(res?.data?.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    getRequest();
  }, []);

  const reviewRequest = async (status, req) => {
    try {
      await api.post(`/request/review/${status}/${req._id}`, {}, { withCredentials: true });

      dispatch(removeRequest(req._id));
      if (status === "accepted") {
        dispatch(addOneConnection(req.fromUserId));
      }

      const message = status === "accepted" 
        ? `You are now connected with ${req.fromUserId.firstName}.` 
        : `Request ignored.`;

      setToastMessage(message);
      setToastType(status === "accepted" ? "success" : "error");
      setShowReqToast(true);
      setTimeout(() => setShowReqToast(false), 4000);
      
    } catch (err) {
      console.error("Error in reviewing request:", err);
    }
  };

  if (!requests) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 relative">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-end justify-between border-b border-gray-200 pb-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Pending Requests</h1>
                <p className="text-gray-500 mt-1">
                    You have <span className="text-purple-600 font-bold">{requests.length}</span> new people waiting
                </p>
            </div>
        </div>

        <div className="flex flex-col gap-5">
          <AnimatePresence mode="popLayout">
            {requests.length > 0 ? (
              requests.map((req) => (
                <RequestCard 
                  key={req._id} 
                  req={req} 
                  onReview={reviewRequest} 
       
                  onClick={() => navigate(`/profile/view/${req.fromUserId._id}`)}
                />
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                  <ShieldAlert size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-500">No pending requests</h3>
                <p className="text-gray-400 mt-1">Go explore to find new connections.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showReqToast && (
          <div className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-xl z-50 font-medium text-white ${toastType === 'success' ? 'bg-gray-900' : 'bg-red-500'}`}>
            {toastMessage}
          </div>
      )}
    </div>
  );
};

const RequestCard = ({ req, onReview, onClick }) => {
  const { fromUserId } = req;
  if (!fromUserId) return null;

  const { firstName, lastName, photoUrl = "via.placeholder.com", title, skills } = fromUserId;
  const safeSkills = Array.isArray(skills) ? skills : [];
  const displayedSkills = safeSkills.slice(0, 3);
  const remainingSkillsCount = safeSkills.length - 3;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50, transition: { duration: 0.2 } }}

      onClick={onClick}
      className="cursor-pointer group bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6"
    >
      <div className="relative shrink-0">
        <img
          src={photoUrl}
          alt={firstName}
          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-[3px] border-purple-100"
          onError={(e) => { e.target.src = 'via.placeholder.com'; }}
        />
      </div>

      <div className="flex-1 text-center sm:text-left min-w-0 w-full">
        <h2 className="text-xl font-bold text-gray-900 truncate">{firstName} {lastName}</h2>
        <p className="text-purple-500 text-sm font-medium mb-3">{title || "Developer"}</p>

        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
            {safeSkills.length > 0 ? (
                <>
                    {displayedSkills.map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-semibold border border-gray-200">
                            {skill}
                        </span>
                    ))}
                    {remainingSkillsCount > 0 && (
                        <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-lg text-xs font-bold border border-purple-100 flex items-center">
                            +{remainingSkillsCount}
                        </span>
                    )}
                </>
            ) : (
                <span className="text-xs text-gray-400 italic flex items-center gap-1">
                    <Cpu size={12} /> No skills listed
                </span>
            )}
        </div>
      </div>

      <div className="flex sm:flex-col gap-3 w-full sm:w-auto mt-2 sm:mt-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReview("accepted", req);
          }}
          className="flex-1 sm:flex-none w-full sm:w-36 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md shadow-purple-100 transition-all"
        >
          <Check size={18} /> Accept
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation(); 
            onReview("rejected", req);
          }}
          className="flex-1 sm:flex-none w-full sm:w-36 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 py-2.5 px-4 rounded-xl font-medium transition-all"
        >
          <X size={18} /> Reject
        </button>
      </div>
    </motion.div>
  );
};

export default Requests;
