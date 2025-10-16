"use client";

import { Button } from "@/components/ui/button";
import useSession from "@/hooks/useSession";
import useSocket from "@/hooks/useSocket";
import { useChatStore } from "@/store/useChatStore";
import { ChatMessage, ChatUser } from "@/types/types";
import { timeStamp } from "console";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { HTTP_URL } from "@/config";
import toast from "react-hot-toast";
import { getExistingChat } from "@/api/room";

export function ChatPanel() {
  const { roomId, mode } = useSession();
  const { chatMessages } = useChatStore();
  const setChatMessages = useChatStore((s) => s.setChatMessages);
  const { sendChat, sendTyping } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const restoredChats = async () => {
      if (mode === "collaboration" && roomId) {
        try {
          const initialChats = await getExistingChat(roomId);
          //@ts-ignore
          setChatMessages(initialChats);
        } catch (error) {
          toast.error("Failed to load existed chats.");
        }
      }
    };
    restoredChats();
  }, [mode, roomId, setChatMessages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSend = () => {
    if (!input.trim() || !socket) return;
    const messageData = {
      type: "chat",
      chat: input,
      roomId,
      timestamp: new Date().toISOString(),
    };
    socket.send(JSON.stringify(messageData));
    setInput("");
  };

  const handleTyping = () => {
    if (socket && currentUser) {
      socket.send(
        JSON.stringify({ type: "typing", sender: currentUser, roomId })
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/10 rounded-2xl p-4 shadow">
      // online Users
      <div className="flex-shrink-0 p-3 border-b border-zinc-800 bg-zinc-900">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="font-semibold text-gray-400">Online:</span>
          {[...new Set(onlineUsers)].map((userId, idx) => (
            <span
              key={idx}
              className={`px-2 py-1 rounded-full text-xs font-medium shadow-sm transition-colors
                ${
                  userId === currentUser?.id
                    ? "bg-white text-black"
                    : "bg-[#262626] text-gray-200"
                }`}
            >
              {userId === currentUser?.id ? "You" : userId}
            </span>
          ))}
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-0">
        <div className="space-y-3 custom-scrollbar">
          {messages.map((msg, index) => {
            const isSelf = msg.sender.toString() === currentUser?.id;

            return (
              <div
                key={index}
                className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-xl px-3 py-2 max-w-[85%] break-words shadow-md ${
                    isSelf
                      ? "bg-zinc-200 text-black rounded-br-none"
                      : "bg-[#262626] text-gray-100 rounded-bl-none"
                  }`}
                >
                  <div className="text-xs text-gray-500 mb-1 font-medium">
                    {isSelf ? "You" : msg.sender}
                  </div>
                  <div className="text-sm">{msg.message}</div>
                  <div className="text-[10px] text-gray-500 mt-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>
      </div>
      // typing users
      {typingUsers.length > 0 && (
        <div className="flex-shrink-0 px-3 py-1 text-sm italic text-gray-400 bg-zinc-900 border-t border-zinc-800">
          {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"}{" "}
          typing...
        </div>
      )}
      // input section
      <div className="flex-shrink-0 p-3 border-t border-zinc-800 bg-zinc-900">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
              else handleTyping();
            }}
            placeholder="Type your message..."
            className="flex-1 p-2 text-sm bg-zinc-800 rounded border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-[#828282] px-3 py-2 rounded hover:bg-zinc-300 transition-colors text-zinc-700 text-sm font-medium"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
