import type { Song } from "@/types"
import {create} from "zustand"
import { useChatStore } from "./useChatStore";

interface PlayerStore {
    currentSong: Song | null;
    isPlaying: boolean;
    queue: Song[];
    currentIndex: number;
    endOfQueue: boolean;

    initializeQueue: (songs: Song[]) => void;
    playAlbum: (songs: Song[], startIndex?: number) => void;
    setCurrentSong: (song: Song | null) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({

    currentSong: null,
    isPlaying: false,
    queue: [],
    currentIndex: -1,
    endOfQueue: false,

    initializeQueue: (songs: Song[]) => {
        set({
            queue: songs,
            currentSong: get().currentSong || songs[0],
            currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
        })
    },

    playAlbum: (songs: Song[], startIndex=0) => {
        if (songs.length === 0) return;
        const currentSong = songs[startIndex];
        const socket = useChatStore.getState().socket;
        if (socket.auth){
            socket.emit("update_activity", {userId: socket.auth.userId, activity: `Playing ${currentSong.title} by ${currentSong.artist}`})
        }

        set({
            queue: songs,
            currentSong: currentSong,
            isPlaying: true,
            currentIndex: startIndex
        })
    },

    setCurrentSong: (song: Song | null) => {
        if (!song) return;

        const songIndex = get().queue.findIndex(s => s._id === song._id);
        set({
            currentSong: song,
            isPlaying: true,
            currentIndex: songIndex !== -1 ? songIndex: get().currentIndex,
        })

        const socket = useChatStore.getState().socket;
        if (socket.auth){
            socket.emit("update_activity", {userId: socket.auth.userId, 
            activity: `Playing ${song.title} by ${song.artist}`})
        }
    },

    togglePlay: () => {
        const willStartPlaying = !get().isPlaying;
        const currentSong = get().currentSong;
        const socket = useChatStore.getState().socket;
        if (socket.auth){
            socket.emit("update_activity", {userId: socket.auth.userId, 
        activity: currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : 'Idle'})
        }

        set({ isPlaying: willStartPlaying});
    },
    
    playNext: () => {
        const {queue, currentIndex} = get();
        const nextIndex = currentIndex + 1

        if (nextIndex < queue.length) {
            const nextSong = queue[nextIndex];
            set({
                currentSong: nextSong,
                currentIndex: nextIndex,
                isPlaying: true,
            })
            const socket = useChatStore.getState().socket;
            if (socket.auth){
                socket.emit("update_activity", {userId: socket.auth.userId, 
                activity: `Playing ${nextSong.title} by ${nextSong.artist}`})
            }
        } else {
            set({isPlaying: false, currentSong: queue[0], currentIndex: 0, endOfQueue: true, })
            const socket = useChatStore.getState().socket;
            if (socket.auth){
                socket.emit("update_activity", {userId: socket.auth.userId, 
                activity: "Idle"})
            }
        }
    },

    playPrevious: () => {
        const {queue, currentIndex} = get();
        const previousIndex = currentIndex - 1
        if (previousIndex > -1) {
            const previousSong = queue[previousIndex]
            set({
                currentSong: previousSong,
                currentIndex: previousIndex,
                isPlaying: true,
            })
            const socket = useChatStore.getState().socket;
            if (socket.auth){
                socket.emit("update_activity", {userId: socket.auth.userId, 
                activity: `Playing ${previousSong.title} by ${previousSong.artist}`})
            }
        } else {
            set({isPlaying: false, currentSong: queue[0], currentIndex: 0, endOfQueue: true, })
            const socket = useChatStore.getState().socket;
            if (socket.auth){
                socket.emit("update_activity", {userId: socket.auth.userId, 
                activity: "Idle"})
            }
        }
    },
}))