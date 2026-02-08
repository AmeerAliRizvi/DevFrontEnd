import { useEffect, useState, useRef, useLayoutEffect } from "react"; 
import { useSelector } from "react-redux";
import { createSocketConnection } from "../utils/socket";
import { useParams, useLocation } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import api from "../utils/axiosClient";

const formatTime = (isoString) => {
  if (!isoString) return "";
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const Chat = () => {
  const { toUserId } = useParams();
  const location = useLocation();
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  
  //PAGINATION STATE
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null); 

  
  const passedUser = location.state?.chatUser;
  const messageUser = messages.find(m => m.sender === "other");
  const chatName = passedUser?.firstName || messageUser?.firstName || "Chat";
  const chatAvatar = passedUser?.photoUrl || messageUser?.photoUrl;

  const fetchChat = async (pageNum = 1) => {
    if (loading) return;
    setLoading(true);

    try {
      const currentScrollHeight = containerRef.current ? containerRef.current.scrollHeight : 0;

      const res = await api.get(`/chat/${toUserId}?page=${pageNum}&limit=20`, { withCredentials: true });
      
      const formatted = res.data.sortedMessages.map((msg) => ({
        _id: msg._id,
        sender: msg.senderId?._id === userId ? "user" : "other",
        firstName: msg.senderId?.firstName,
        text: msg.text,
        photoUrl: msg.senderId?.photoUrl,
        time: formatTime(msg.createdAt),
      }));

      // Update Pagination State
      setHasMore(res.data.hasMore);
      setPage(pageNum);

      setMessages((prev) => {
        if (pageNum === 1) return formatted; // Initial load: Replace all
        return [...formatted, ...prev];      // Pagination: Prepend older messages
      });

      //SCROLL POSITION RESTORATION 
      if (pageNum > 1 && containerRef.current) {
        setTimeout(() => {
            const newScrollHeight = containerRef.current.scrollHeight;
            containerRef.current.scrollTop = newScrollHeight - currentScrollHeight;
        }, 0);
      } else if (pageNum === 1) {
        // Initial load: Scroll to bottom
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "auto" }), 100);
      }

    } catch (err) { 
        console.error(err); 
    } finally {
        setLoading(false);
    }
  };

  //INITIAL LOAD
  useEffect(() => {
    if (!userId || !toUserId) return;

    setMessages([]);
    setPage(1);
    setHasMore(true);
    fetchChat(1); // Fetch Page 1

    // Socket Connection
    const socket = createSocketConnection();
    socketRef.current = socket;
    socket.emit("joinChat", { userId, toUserId });

    const handleMessageReceived = (msg) => {
      if (msg.senderId._id === userId) return; 

      setMessages((prev) => [...prev, {
        _id: msg._id,
        sender: "other",
        firstName: msg.senderId.firstName,
        text: msg.text,
        photoUrl: msg.senderId.photoUrl,
        time: formatTime(msg.createdAt),
      }]);
      // Smooth scroll only for new incoming messages
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    socket.on("messageReceived", handleMessageReceived);
    socket.on("error", (data) => alert(data.message));

    return () => {
      socket.off("messageReceived", handleMessageReceived);
      socket.off("error");
    };
  }, [userId, toUserId]);



  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    if (container.scrollTop === 0 && hasMore && !loading) {
        fetchChat(page + 1); // Load next page
    }
  };

  const handleSendMessage = () => {
    if (!socketRef.current || !newMessage.trim()) return;

    const text = newMessage;
    setNewMessage("");

    setMessages((prev) => [...prev, {
        _id: Date.now().toString(),
        sender: "user",
        text: text,
        time: formatTime(new Date()),
        firstName: user?.firstName,
        photoUrl: user?.photoUrl
    }]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    socketRef.current.emit("sendMessage", {
      userId,
      toUserId,
      text,
      firstName: user?.firstName,
      lastName: user?.lastName,
    });
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#E5DDD5]">
      {/* Header */}
      <header className="flex items-center p-3 bg-[#075E54] text-white shadow-md gap-3">
        <FaArrowLeft className="md:hidden text-xl cursor-pointer" onClick={() => window.history.back()} />
        <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
          {chatAvatar ? (
            <img src={chatAvatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-white text-lg">{chatName !== "Chat" ? chatName[0] : "?"}</span>
          )}
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold leading-tight">{chatName} {passedUser?.lastName}</h1>
        </div>
      </header>

      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 p-4 overflow-y-auto"
      >
        {/* Loading Spinner for Pagination */}
        {loading && page > 1 && (
            <div className="text-center text-xs text-gray-500 py-2">Loading previous messages...</div>
        )}

        <div className="flex flex-col gap-3">
          {messages.map((msg, idx) => (
            <div key={msg._id || idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] p-3 rounded-lg shadow-sm ${msg.sender === "user" ? "bg-[#DCF8C6]" : "bg-white"}`}>
                {msg.sender === "other" && <p className="text-xs font-bold text-teal-700 mb-1">{msg.firstName}</p>}
                <p className="text-sm text-slate-800 break-words">{msg.text}</p>
                <span className="text-xs text-slate-400 float-right mt-1 ml-2">{msg.time}</span>
              </div>
            </div>
          ))}
          {/* Invisible div to scroll to bottom */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer Input */}
      <footer className="p-3 bg-transparent flex items-center gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message"
          className="flex-1 bg-white border border-slate-300 rounded-full px-5 py-3 text-sm focus:outline-none"
        />
        <button onClick={handleSendMessage} className="bg-[#128C7E] text-white w-12 h-12 rounded-full flex items-center justify-center">
          <IoSend size={20} />
        </button>
      </footer>
    </div>
  );
};

export default Chat;