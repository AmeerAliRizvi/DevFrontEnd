import axios from "axios";
import { BaseUrl } from "../Utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../Utils/connectionSlice";
import { useEffect } from "react";
import { FaMars, FaVenus } from "react-icons/fa"; // Dynamic gender icons

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connection);
 

  const getConnections = async () => {
    try {
      const res = await axios.get(BaseUrl + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addConnections(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getConnections();
  }, []);

  if (!connections || connections.length === 0)
    return <p className="text-white text-center text-xl">No Connection Found!</p>;

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-[var(--BGBase300)]">
      <h1 className="text-white text-center text-4xl font-extrabold mb-8 tracking-wide">Connections</h1>
      <div className="flex flex-col gap-6">
        {connections.map((conn) => (
          <div
            key={conn._id}
            className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl text-white flex items-center w-[650px] hover:shadow-2xl transition-all duration-300 border border-gray-700"
          >
            {/* Profile Image */}
            <img
              src={conn.photoUrl}
              alt={conn.firstName}
              className="w-24 h-24 rounded-full border-4 border-purple-500 shadow-xl mr-6"
            />

            {/* User Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{conn.firstName} {conn.lastName}</h2>
              <p className="text-gray-400 flex items-center gap-2 text-lg mt-1">
                {conn.gender.toLowerCase() === "male" ? <FaMars className="text-blue-400" /> : <FaVenus className="text-pink-400" />} {conn.age}
              </p>
              <p className="text-md mt-3 text-gray-300 italic">{conn.About || "No bio available"}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="bg-purple-500 hover:bg-purple-600 px-6 py-2 text-lg rounded-full shadow-lg transition-all">Message</button>
              <button className="bg-red-500 hover:bg-red-600 px-5 py-2 text-lg rounded-full shadow-lg transition-all">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;