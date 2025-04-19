import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequest, removeRequest } from "../Utils/requestSlice";
import { FaMars, FaVenus } from "react-icons/fa"; // Dynamic gender icons
import { BaseUrl } from "../Utils/constants";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.request);

  // Toast state
  const [showReqToast, setShowReqToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const reviewRequest = async (status, req) => {
    try {
      

      await axios.post(`${BaseUrl}/request/review/${status}/${req._id}`, {}, {
        withCredentials: true,
      });

      dispatch(removeRequest(req._id)); // Remove request from Redux state

      // Set the message dynamically
      const message = status === "accepted" 
        ? `${req.fromUserId.firstName} ${req.fromUserId.lastName} added to your connections.` 
        : `${req.fromUserId.firstName} ${req.fromUserId.lastName} was rejected.`;

      setToastMessage(message);
      setShowReqToast(true);
     

      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowReqToast(false);
      }, 9000);
      
    } catch (err) {
      console.error("Error in reviewing request:", err);
    }
  };

  const getRequest = async () => {
    try {
      
      const res = await axios.get(BaseUrl + "/user/request/recieved", {
        withCredentials: true,
      });

      
      dispatch(addRequest(res?.data?.data));
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    
    getRequest();
  }, []);

  if (!requests || requests.length === 0) {
    return <p className="text-white text-center text-xl">No Pending Requests</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-[var(--BGBase300)]">
      <h1 className="text-white text-center text-4xl font-extrabold mb-8 tracking-wide">Pending Requests</h1>
      <div className="flex flex-col gap-6">
        {requests.map((req) => {
          
          const { firstName, lastName, age, gender, About, _id, photoUrl } = req.fromUserId;
          return (
            <div
              key={_id}
              className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl text-white flex items-center w-[650px] hover:shadow-2xl transition-all duration-300 border border-gray-700"
            >
              {/* Profile Image */}
              <img
                src={photoUrl}
                alt={firstName}
                className="w-24 h-24 rounded-full border-4 border-purple-500 shadow-xl mr-6"
              />

              {/* User Details */}
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{firstName} {lastName}</h2>
                <p className="text-gray-400 flex items-center gap-2 text-lg mt-1">
                  {gender.toLowerCase() === "male" ? <FaMars className="text-blue-400" /> : <FaVenus className="text-pink-400" />} {age}
                </p>
                <p className="text-md mt-3 text-gray-300 italic">{About || "No bio available"}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button 
                  className="bg-green-500 hover:bg-green-600 px-6 py-2 text-lg rounded-full shadow-lg transition-all"
                  onClick={() => reviewRequest("accepted", req)}
                >
                  Accept
                </button>
                <button 
                  className="bg-red-500 hover:bg-red-600 px-5 py-2 text-lg rounded-full shadow-lg transition-all"
                  onClick={() => reviewRequest("rejected", req)}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
        
      {/* Toast Notification */}
      {showReqToast && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fadeIn">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default Requests;
