import {Server} from "socket.io"
import {Message} from "../models/message.model.js"

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
            credentials: true,
        }
    });

    const userSockets = new Map(); // {userId: socketId}
    const userActivities = new Map(); // {userId: activity}

    io.on("connection", (socket) => { // user as params
        socket.on("user_connected", (userId) => {
            userSockets.set(userId, socket.id);
            userActivities.set(userId, "Idle")

            io.emit("user_connected", userId) // broadcast to all connected sockets that this user just logged in

            socket.emit("users_online", Array.from(userSockets.keys()))

            io.emit("activities", Array.from(userActivities.entries())) // broadcast to all connected the activites
        })

        socket.on("update_activity", ({userId, activity}) => {
            userActivities.set(userId, activity)
            io.emit("activity_updated", {userId, activity})
        })
        
        socket.on("send_message", async (data) => {
            try {
                const {senderId, receiverId, content} = data;
                const message = await Message.create({senderId, receiverId, content})

                // send to receiver in realtime, if receiver is online
                const receiverSocketId = userSockets.get(receiverId)
                if (receiverSocketId){
                    io.to(receiverSocketId).emit("receive_message", message)
                }

                socket.emit("message_sent", message) // acknowledgement that message was sent

            } catch (error) {
                console.error("Message error", error);
                socket.emit("message_error", error.message)
                
            }
        })

        socket.on("disconnect", () => {
            let disconnectedUserId;
            for (const [userId, socketId] of userSockets.entries()){
                if (socketId == socket.id){
                    disconnectedUserId = userId
                    userSockets.delete(disconnectedUserId)
                    userActivities.delete(disconnectedUserId)
                    break;
                }
            }

            if (disconnectedUserId){
                io.emit("user_disconnected", disconnectedUserId)
            }
        })
    })
}