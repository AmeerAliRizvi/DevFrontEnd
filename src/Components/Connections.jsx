import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addConnections, removeConnection } from "../Utils/connectionSlice";
import api from "../utils/axiosClient";
import { Send, X, UserX, AlertTriangle } from "lucide-react";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
  
  // 🔥 New State for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Stores the user to be deleted

  const getConnections = async () => {
    try {
      const res = await api.get("/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  useEffect(() => {
    if (!connections || connections.length === 0) {
      getConnections();
    }
  }, []);

  // 1️⃣ Open Modal Logic
  const openConfirmModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // 2️⃣ Close Modal Logic
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // 3️⃣ Actual Delete Logic (Called only when user clicks "Yes")
  const confirmRemove = async () => {
    if (!selectedUser) return;

    const userId = selectedUser._id;
    
    // Optimistic Update
    dispatch(removeConnection(userId));
    closeModal(); // Close modal immediately

    try {
      await api.delete(`/remove-connection/${userId}`);
    } catch (err) {
      console.error("Remove failed:", err);
      getConnections(); // Revert on failure
    }
  };

  if (!connections || connections.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="bg-purple-100 p-6 rounded-full mb-6">
            <UserX className="w-12 h-12 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">No Connections Yet</h2>
        <p className="text-gray-500 mt-2">Start exploring to grow your network.</p>
        <Link to="/feed">
            <button className="mt-6 px-8 py-3 bg-purple-600 text-white rounded-full font-semibold shadow-lg hover:bg-purple-700 transition-all">
                Go to Feed
            </button>
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 flex items-end justify-between border-b border-gray-200 pb-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Your Connections
                </h1>
                <p className="text-gray-500 mt-1">
                    You have <span className="text-purple-600 font-bold">{connections.length}</span> active connections
                </p>
            </div>
        </div>

        {/* List Container */}
        <div className="flex flex-col gap-5">
          {connections.map((conn) => (
            <div
              key={conn._id}
              className="group bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <img
                  src={conn.photoUrl || "https://via.placeholder.com/150"}
                  alt={conn.firstName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-[3px] border-purple-100"
                />
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h2 className="text-xl font-bold text-gray-900 truncate">
                  {conn.firstName} {conn.lastName}
                </h2>
                <div className="flex justify-center sm:justify-start gap-2 text-sm text-gray-500 mt-1 mb-2">
                   <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded-md font-medium capitalize">
                     {conn.gender}
                   </span>
                </div>
                <p className="text-gray-500 text-sm line-clamp-2">
                  {conn.title || "No title available."}
                </p>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                <Link to={"/chat/" + conn._id} className="flex-1 sm:flex-none">
                    <button className="w-full sm:w-36 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-xl font-semibold shadow-md shadow-purple-100 transition-all">
                        <Send size={18} />
                        Message
                    </button>
                </Link>

                {/* Remove Button - Now opens Modal */}
                <button
                    onClick={() => openConfirmModal(conn)}
                    className="flex-1 sm:flex-none w-full sm:w-36 flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 py-2.5 px-4 rounded-xl font-medium transition-all"
                >
                    <UserX size={18} />
                    Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔥 THE MODAL POPUP */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            
            {/* Backdrop (Dark Overlay) */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                onClick={closeModal} // Click outside to close
            ></div>

            {/* Modal Box */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative z-10 animate-in fade-in zoom-in duration-200">
                
                {/* Close X Icon */}
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                        <AlertTriangle size={28} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Remove Connection?
                    </h3>
                    
                    <p className="text-gray-500 mb-6">
                        Are you sure you want to remove <span className="font-bold text-gray-800">{selectedUser.firstName}</span>? 
                        This action cannot be undone.
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3 w-full">
                        <button 
                            onClick={closeModal}
                            className="flex-1 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={confirmRemove}
                            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
                        >
                            Yes, Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default Connections;