import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/stores/useChatStore";
import { useUser } from "@clerk/clerk-react"
import { Send } from "lucide-react";
import { useState } from "react";

const MessageInput = () => {

    const [newMessage, setNewMessage] = useState("");
    const { user } = useUser();
    const { selectedUser, sendMessage } = useChatStore();

    const handleSend = () => {
        if (!selectedUser || !user || !newMessage) return;
        sendMessage(user.id, selectedUser.clerkId, newMessage.trim());
        setNewMessage("")
    };
    return (
        <div className="p-4 mt-auto border-t border-zinc-800">
            <div className="flex gap-2">
                <Input className="border-none bg-zinc-800"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()} />

                <Button size={"icon"}
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="bg-green-500"
                >
                    <Send className="size-4"></Send>
                </Button>
            </div>

        </div>
    )
}

export default MessageInput