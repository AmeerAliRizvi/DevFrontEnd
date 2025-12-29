import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { createSocketConnection } from "../Utils/socket";
import { useParams } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
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
  const user = useSelector((store) => store.user);
  const userId = user?._id;

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ✅ Fetch existing chat messages
  const fetchChat = async () => {
    if (!userId || !toUserId) return; // Prevent early fetch
    try {
      const chat = await api.get(`/chat/${toUserId}`, {
        withCredentials: true,
      });

      const chatMessages = chat?.data?.messages?.map((msg) => {
        const { senderId, text, timestamp, createdAt } = msg;
        return {
          sender: senderId?._id === userId ? "user" : "other",
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          time: formatTime(timestamp || createdAt),
        };
      });

      setMessages(chatMessages || []);
    } catch (err) {
      console.error("Error fetching chat:", err);
    }
  };

  // ✅ Wait for userId before fetching
  useEffect(() => {
    if (userId && toUserId) {
      fetchChat();
    }
  }, [userId, toUserId]);

  // ✅ Handle socket connection and incoming messages
  useEffect(() => {
    if (!userId || !toUserId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { userId, toUserId });

    socket.on("messageReceived", (msg) => {
      if (msg.senderId === userId) return; // Avoid duplicates

      const formattedMessage = {
        sender: "other",
        firstName: msg.firstName,
        lastName: msg.lastName,
        text: msg.text,
        time: formatTime(msg.timestamp),
      };

      setMessages((prev) => [...prev, formattedMessage]);
    });

    return () => socket.disconnect();
  }, [userId, toUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send a message
  const handleSendMessage = () => {
    if (!socketRef.current || !newMessage.trim()) return;

    const messageToSend = {
      userId,
      toUserId,
      text: newMessage,
      firstName: user?.firstName,
      lastName: user?.lastName,
    };

    socketRef.current.emit("sendMessage", messageToSend);

    // Optimistic UI update
    const optimisticMessage = {
      sender: "user",
      text: newMessage,
      time: formatTime(new Date().toISOString()),
    };
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  return (
    <div
      className="h-screen w-full flex flex-col bg-[#E5DDD5]"
      style={{
        backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
      }}
    >
      <header className="flex items-center p-3 bg-[#075E54] text-white shadow-md z-10">
        <FaArrowLeft className="text-xl cursor-pointer mr-4" />
        <img
          src={user?.avatar}
          alt="Recipient"
          className="w-10 h-10 rounded-full mr-3"
        />
        <h1 className="text-lg font-semibold">{user?.name}</h1>
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-lg shadow-sm relative ${
                  msg.sender === "user"
                    ? "bg-[#DCF8C6] rounded-br-none"
                    : "bg-white rounded-bl-none"
                }`}
              >
                {msg.sender === "other" && (
                  <p className="text-xs font-bold text-teal-700 mb-1">
                    {msg.firstName} {msg.lastName}
                  </p>
                )}
                <p className="text-sm text-slate-800 break-words">{msg.text}</p>
                <span className="text-xs text-slate-400 float-right mt-1 ml-2">
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <footer className="p-3 bg-transparent flex items-center gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message"
          className="flex-1 bg-white border border-slate-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <button
          onClick={handleSendMessage}
          className="bg-[#128C7E] hover:bg-[#075E54] transition-colors text-white w-12 h-12 rounded-full flex items-center justify-center"
        >
          <IoSend size={20} />
        </button>
      </footer>
    </div>
  );
};

export default Chat;
