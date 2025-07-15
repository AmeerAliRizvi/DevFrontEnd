import React, { useState } from 'react';

const Chat = () => {
  const [messages] = useState([
    { sender: 'user', text: 'Hey! Ready to code? 👩‍💻' },
    { sender: 'other', text: 'Absolutely! Let’s build something cool 🚀' },
    { sender: 'user', text: 'React + Tailwind = ❤️' },
    { sender: 'other', text: 'That’s the dream stack!' },
  ]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-2xl h-[85vh] rounded-xl shadow-lg border border-slate-800 bg-[#1e293b] text-white flex flex-col overflow-hidden">
        <div className="p-4 font-semibold text-lg border-b border-slate-700 bg-[#111827]">DevChat</div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-3 rounded-2xl shadow-md max-w-[70%] ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-white rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-700 flex items-center gap-3 bg-[#111827]">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-[#1f2937] border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
