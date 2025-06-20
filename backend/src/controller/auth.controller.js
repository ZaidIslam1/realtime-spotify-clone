import { User } from "../models/user.model.js"

export const authCallback = async (req, res, next) => {
    try {
        const { id, firstName, lastName, imageUrl} = req.body;

        // Try get user (logging in)
        const user = await User.findOne({clerkId: id});

        // Signup process
        if (!user){ 

            await User.create({
                fullName: `${firstName || ""} ${lastName || ""}`.trim(),
                imageUrl: imageUrl,
                clerkId: id,
            })
        }
        res.status(200).json({success: true});

    } catch (error){    
        console.log("Error in auth callback", error);
        next(error);
    }
};