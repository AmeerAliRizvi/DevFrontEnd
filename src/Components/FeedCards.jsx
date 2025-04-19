import axios from "axios";
import { BaseUrl } from "../Utils/constants";
import { useDispatch } from "react-redux";
import { removeFeed } from "../Utils/feedSlice";

const FeedCards = ({ user , showButton = true}) => {

const dispatch = useDispatch();

  if (!user) {
    return <p className="text-center text-gray-500">No user found.</p>;
  }

  const { firstName, lastName, age, gender, About, photoUrl, Skills, _id} = user;

  const handleSendRequest = async(status,_id)=>{
    try{
      const res = await axios.post(BaseUrl + "/request/send/"+ status+"/"+ _id,{},{
        withCredentials: true,
      })
      dispatch(removeFeed(_id))
  
    }catch(err){
      console.error(err)
    }

  }

  // Function to limit about section text
  const truncateText = (text, wordLimit) => {
    if (!text) return "No about info provided.";
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  return (
    <div className="max-w-md mx-auto bg-[var(--BGBase300)] rounded-2xl shadow-xl overflow-hidden border border-[var(--BGBase400)] mb-16 mt-8 min-h-[600px]">
      {/* Profile Image Section with overlay */}
      <div className="relative h-96 w-full rounded-t-2xl overflow-hidden">
        <img 
          src={photoUrl || "https://via.placeholder.com/200"} 
          alt={`${firstName || "User"}'s profile`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-3xl font-bold">{firstName} {lastName}</h2>
          <div className="flex items-center gap-2">
            <span className="text-lg text-amber-400 font-semibold">• {age ?? "N/A"}</span>
            <span className="text-sm text-gray-300">{gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : "Not specified"}</span>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="p-6 text-gray-200 break-words">
        <p className="text-lg mb-4">{truncateText(About, 100)}</p>
      </div>

      {/* Skills Section */}
      {Skills?.length > 0 && (
        <div className="px-6 mb-6">
          <h1 className="text-base font-bold text-cyan-300 mb-3">Skills</h1>
          <div className="flex flex-wrap gap-3">
            {Skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg shadow-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {showButton && (
        <div className="flex justify-between gap-4 p-6">
          <button className="flex-1 py-3 text-lg bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition" onClick={()=> handleSendRequest("ignored",_id)}>
            Ignore
          </button>
          <button className="flex-1 py-3 text-lg bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white font-semibold rounded-xl transition" onClick={()=>handleSendRequest
            ("interested",_id)
          }>
            Interested
          </button>
        </div>
      )}
    </div>
  );
};

export default FeedCards;
