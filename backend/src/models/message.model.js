import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {             // Clerk ID
            type: String,
            required: true
        },

        receiverId: {           // Clerk ID
            type: String,
            required: true
        },

        content: {
            type: String,
            required: true
        }
    },
    { timestamps: true },
);

export const Message = mongoose.model("Message", messageSchema);