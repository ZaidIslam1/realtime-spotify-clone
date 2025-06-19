import { axiosInstance } from "@/lib/axios";
import {create} from "zustand"

interface AuthStore {
    isLoading: boolean;
    isAdmin: boolean;
    error: string | null;

    checkAdminStatus: () => Promise<void>;
    reset: () => void;

}

export const useAuthStore = create<AuthStore>((set) => ({
    isLoading: false,
    error: null,
    isAdmin: false,

    checkAdminStatus: async() => {
        set({isLoading:true, error:null})
        try {
            const response = await axiosInstance.get("/admin/check")
            set({isAdmin: response.data.admin})
        } catch (error: any) {
            set({isAdmin:false, error: error.response.data.message})
        } finally {
            set({isLoading:false})
        }
    },

    reset: () => {set({isLoading:true, error:null, isAdmin: false})}
}))