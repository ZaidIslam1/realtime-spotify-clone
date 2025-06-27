import { axiosInstance, injectTokenGetter } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { getToken, userId } = useAuth();
    const [loading, setLoading] = useState(true);
    const { checkAdminStatus } = useAuthStore();
    const { initSocket, disconnectSocket } = useChatStore();

    useEffect(() => {
        // Inject the token getter into axios so it can fetch a fresh one on each request
        injectTokenGetter(getToken);

        const initAuth = async () => {
            try {
                const token = await getToken();
                if (token) {
                    await checkAdminStatus(); // verify if user is admin
                    if (userId) initSocket(userId); // connect socket with userId
                }
            } catch (error: any) {
                console.error("Error in AuthProvider:", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        return () => disconnectSocket(); // cleanup socket on unmount
    }, [getToken, userId, checkAdminStatus, initSocket, disconnectSocket]);

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
