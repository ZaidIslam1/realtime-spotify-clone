import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { getToken, userId, isLoaded: isAuthLoaded } = useAuth();
    const [loading, setLoading] = useState(true);
    const { checkAdminStatus } = useAuthStore();
    const { initSocket, disconnectSocket } = useChatStore();

    useEffect(() => {
        const initAuth = async () => {
            // ✅ Wait until Clerk is fully loaded
            if (!isAuthLoaded) return;

            try {
                const token = await getToken();

                if (token) {
                    // ✅ Set token early and only once
                    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                    await checkAdminStatus();

                    if (userId) {
                        initSocket(userId);
                    }
                } else {
                    delete axiosInstance.defaults.headers.common["Authorization"];
                }
            } catch (error) {
                console.error("AuthProvider error:", error);
                delete axiosInstance.defaults.headers.common["Authorization"];
            } finally {
                setLoading(false);
            }
        };

        initAuth();
        return () => disconnectSocket();
    }, [getToken, userId, isAuthLoaded, checkAdminStatus, initSocket, disconnectSocket]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center">
                <Loader className="size-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthProvider;
