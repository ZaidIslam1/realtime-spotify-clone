import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const currentUserId = req.auth().userId;
        const users = await User.find({ clerkId: { $ne: currentUserId } });
        res.status(200).json(users);
    } catch (error) {
        console.log("Error in getAllUsers", error);
        next(error);
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const currentUserId = req.auth().userId;
        const { otherUserId } = req.params; // this matches route param now

        const messages = await Message.find({
            $or: [
                { senderId: otherUserId, receiverId: currentUserId },
                { senderId: currentUserId, receiverId: otherUserId },
            ],
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages", error);
        next(error);
    }
};
