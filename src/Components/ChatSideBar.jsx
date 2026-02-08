import { useEffect, useState, useRef } from "react";
import api from "../utils/axiosClient";
import { useNavigate, useParams } from "react-router-dom"; // Added useParams
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";

const ChatSideBar = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { toUserId } = useParams(); // Get active chat ID
  const user = useSelector((store) => store.user);
  const socketRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/chat/users", { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchUsers();

    const socket = createSocketConnection();
    socketRef.current = socket;
    socket.emit("joinChat", { userId: user._id, toUserId: null });

    const handleSidebarUpdate = (newData) => {
      setUsers((prevUsers) => {
        const index = prevUsers.findIndex((u) => u._id === newData._id);

        if (index !== -1) {
        
          const updatedUsers = [...prevUsers];
          const userToUpdate = { ...updatedUsers[index] };
          
          userToUpdate.lastMessage = newData.lastMessage;
          userToUpdate.lastMessageTime = newData.lastMessageTime;
          
          if (newData.type === "received") {
             userToUpdate.unreadCount = (userToUpdate.unreadCount || 0) + 1;
          } else {
             userToUpdate.unreadCount = 0;
          }

          updatedUsers.splice(index, 1);
          return [userToUpdate, ...updatedUsers];
        } else {
         
          const newUser = {
            _id: newData._id,
            firstName: newData.firstName,
            lastName: newData.lastName,
            photoUrl: newData.photoUrl, 
            lastMessage: newData.lastMessage,
            lastMessageTime: newData.lastMessageTime,
            unreadCount: newData.unreadCount,
          };
          return [newUser, ...prevUsers];
        }
      });
    };

    socket.on("updateSidebar", handleSidebarUpdate);

    return () => {
      socket.off("updateSidebar", handleSidebarUpdate);
    };
  }, [user]);

  const handleUserClick = (chatUser) => {
    setUsers(prev => prev.map(u => 
        u._id === chatUser._id ? { ...u, unreadCount: 0 } : u
    ));
    navigate(`/chat/${chatUser._id}`);
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const isToday = new Date().toDateString() === date.toDateString();
    return isToday
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : date.toLocaleDateString();
  };

  if (!user) return <div className="p-4">Loading...</div>;

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="p-4 bg-slate-100 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-700">Chats</h2>
      </div>

      <div className="overflow-y-auto flex-1">
        {users.length === 0 ? (
           <div className="p-4 text-center text-slate-500 text-sm">No conversations yet</div>
        ) : (
          users.map((chatUser) => (
            <div
              key={chatUser._id}
              onClick={() => handleUserClick(chatUser)}
             
              className={`flex items-center gap-3 p-4 cursor-pointer border-b border-slate-100 ${
                  toUserId === chatUser._id ? "bg-slate-200" : "hover:bg-slate-50"
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center">
                {chatUser.photoUrl ? (
                  <img
                    src={chatUser.photoUrl}
                    alt={`${chatUser.firstName} avatar`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold bg-teal-500 w-full h-full flex items-center justify-center">
                    {chatUser.firstName?.[0]}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-slate-800 truncate">
                    {chatUser.firstName} {chatUser.lastName}
                  </h3>
                  <span className="text-xs text-slate-400 whitespace-nowrap ml-2">
                    {formatTime(chatUser.lastMessageTime)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-1">
                  <p className={`text-sm truncate pr-2 ${chatUser.unreadCount > 0 ? "text-slate-900 font-bold" : "text-slate-500"}`}>
                    {chatUser.lastMessage}
                  </p>
                  
                  {chatUser.unreadCount > 0 && (
                    <div className="min-w-[20px] h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5">
                      {chatUser.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatSideBar;