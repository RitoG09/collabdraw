import { ChatStore } from "types/types";
import { create } from "zustand";

export const useChatStore = create<ChatStore>((set) => ({
  chatMessages: [],
  typingUser: null,
  setChatMessages: (messages) => set({ chatMessages: messages }),
  addChatMessage: (message) =>
    set((state) => ({ chatMessages: [...state.chatMessages, message] })),
  setTypingUser: (user) => set({ typingUser: user }),
  clearChat: () => set({ chatMessages: [], typingUser: null }),
}));

//{ chatOpen,sumOpen,toggleChat,toggleSum }
