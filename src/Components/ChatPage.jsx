import { useParams } from "react-router-dom";
import Chat from "./Chat";
import ChatSideBar from "./ChatSideBar";

const ChatPage = () => {
  const { toUserId } = useParams();

  return (
    <div className="flex h-screen w-full bg-slate-50 overflow-hidden">
    
      <div className={`
        ${toUserId ? "hidden" : "flex"} 
        md:flex w-full md:w-1/3 lg:w-1/4 h-full border-r border-slate-300 bg-white z-10
      `}>
        <ChatSideBar />
      </div>

      <div className={`
        ${!toUserId ? "hidden" : "flex"} 
        md:flex w-full md:w-2/3 lg:w-3/4 h-full bg-[#E5DDD5]
      `}>
        {toUserId ? (
          <Chat />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-500 bg-[#F0F2F5] w-full">
            <h2 className="text-2xl font-light mb-2">Welcome to Your Chat App</h2>
            <p>Select a user to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;