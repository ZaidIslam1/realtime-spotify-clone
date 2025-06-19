import type { Message, User } from "@/types";
import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { io } from "socket.io-client";

interface ChatStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  socket: any;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, string>;
  messagesByUser: Record<string, Message[]>;
  unreadByUser: Record<string, number>;
  selectedUser: User | null;

  fetchUsers: () => Promise<void>;
  initSocket: (userId: string) => void;
  disconnectSocket: () => void;
  sendMessage: (senderId: string, receiverId: string, content: string) => void;
  fetchMessages: (userId: string) => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  getMessagesForUser: (userId: string) => Message[];
}

const baseURL =  import.meta.env.MODE === "development" ? ("http://localhost:5001") : ("/");

const socket = io(baseURL, {
  autoConnect: false,
  withCredentials: true,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  users: [],
  isLoading: false,
  error: null,
  socket: socket,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  messagesByUser: {},
  unreadByUser: {},
  selectedUser: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get("/users");
      set({ users: response.data });
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  initSocket: (userId: string) => {
    if (!get().isConnected) {
      socket.auth = { userId };

      socket.connect();
      socket.emit("user_connected", userId);

      socket.on("users_online", (users: string[]) => {
        set({ onlineUsers: new Set(users) });
      });

      socket.on("activities", (activities: [string, string][]) => {
        set({ userActivities: new Map(activities) });
      });

      socket.on("user_connected", (userId: string) => {
        set((state) => ({
          onlineUsers: new Set([...state.onlineUsers, userId]),
        }));
      });

      socket.on("user_disconnected", (userId: string) => {
        set((state) => {
          const newOnlineUsers = new Set(state.onlineUsers);
          newOnlineUsers.delete(userId);
          return { onlineUsers: newOnlineUsers };
        })
      });

      const appendMessage = (message: Message) => {
        const state = get();
        const currentUserId = userId; // current logged-in user
        const selected = state.selectedUser;

        // Determine the other user in this message conversation
        const otherUserId =
            message.senderId === currentUserId ? message.receiverId : message.senderId;

        const prevMessages = state.messagesByUser[otherUserId] || [];
        const prevUnread = state.unreadByUser[otherUserId] || 0;

        // Is chat open with the other user?
        const isChatOpen = selected?.clerkId === otherUserId;

        // If message is sent by me (currentUserId), do not increase unread count
        // Only increment if message is received by me and chat not open
        const shouldIncrementUnread =
            message.receiverId === currentUserId && !isChatOpen;

        set({
            messagesByUser: {
            ...state.messagesByUser,
            [otherUserId]: [...prevMessages, message],
            },
            unreadByUser: {
            ...state.unreadByUser,
            [otherUserId]: shouldIncrementUnread ? prevUnread + 1 : prevUnread,
            },
        });
        };


        socket.on("receive_message", appendMessage);
      socket.on("message_sent", appendMessage);

      socket.on("activity_updated", ({ userId, activity }) => {
        set((state) => {
          const newActivities = new Map(state.userActivities);
          newActivities.set(userId, activity);
          return { userActivities: newActivities };
        });
      });

      set({ isConnected: true });
    }
  },

  disconnectSocket: () => {
    if (get().isConnected) {
      socket.disconnect();
      set({ isConnected: false });
    }
  },

  sendMessage: (senderId: string, receiverId: string, content: string) => {
    const socket = get().socket;
    if (!socket) return;
    socket.emit("send_message", { receiverId, senderId, content });
  },

  fetchMessages: async (userId: string) => {
    const alreadyLoaded = get().messagesByUser[userId];
    if (alreadyLoaded) return;

    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/users/messages/${userId}`);
      set((state) => ({
        messagesByUser: {
          ...state.messagesByUser,
          [userId]: response.data,
        },
      }));
    } catch (error: any) {
      set({ error: error.response.data.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedUser: (user) => {
    if (!user) return set({ selectedUser: null });
    set((state) => ({
      selectedUser: user,
      unreadByUser: {
        ...state.unreadByUser,
        [user.clerkId]: 0,
      },
    }));
  },

  getMessagesForUser: (userId: string) => {
    return get().messagesByUser[userId] || [];
  },
}));
