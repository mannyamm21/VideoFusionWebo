
import { Tiwtte } from "../models/Tiwttes.js";
import { User } from "../models/User.js"
import { Video } from "../models/Video.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from '../utils/asyncHandler.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js';

export const updateUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            }, {
                new: true
            });
            res.status(200).json(updatedUser)
        } catch (error) {
            next(error)
        }
    } else {
        throw new ApiError(403, "You can update only your account")
    }
}

export const deleteUser = async (req, res, next) => {
    if (req.params.id === req.user.id) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("User has been deleted")
        } catch (error) {
            next(error)
        }
    } else {
        throw new ApiError(403, "You can deleted only your account")
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

export const subscribe = async (req, res, next) => {
    try {
        console.log("Subscribe: req.user.id:", req.user.id, "req.params.id:", req.params.id);
        await User.findByIdAndUpdate(req.user.id, {
            $push: { subscribedUsers: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 },
        });
        res.status(200).json("Subscription Successful.");
    } catch (error) {
        console.error("Error in subscribe:", error);
        next(error);
    }
};

export const unsubscribe = async (req, res, next) => {
    try {
        console.log("Unsubscribe: req.user.id:", req.user.id, "req.params.id:", req.params.id);
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { subscribedUsers: req.params.id },
        });
        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 },
        });
        res.status(200).json("Unsubscription Successful.");
    } catch (error) {
        console.error("Error in unsubscribe:", error);
        next(error);
    }
};

export const like = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull: { dislikes: id }
        })
        res.status(200).json("The video has been liked.")
    } catch (error) {
        next(error);
    }
};

export const likeTiwtte = async (req, res, next) => {
    const userId = req.user.id;
    const tiwtteId = req.params.postId;
    try {
        await Tiwtte.findByIdAndUpdate(tiwtteId, {
            $addToSet: { likes: userId },
            $pull: { dislikes: userId }
        });
        res.status(200).json({ message: "The Tiwtte has been liked.", userId, tiwtteId });
    } catch (error) {
        next(error);
    }
};

export const dislikeTiwtte = async (req, res, next) => {
    const userId = req.user.id;
    const tiwtteId = req.params.postId;
    try {
        await Tiwtte.findByIdAndUpdate(tiwtteId, {
            $addToSet: { dislikes: userId },
            $pull: { likes: userId }
        });
        res.status(200).json({ message: "The Tiwtte has been disliked.", userId, tiwtteId });
    } catch (error) {
        next(error);
    }
};

export const dislike = async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull: { likes: id }
        })
        res.status(200).json("The video has been Disliked.")
    } catch (error) {
        next(error);
    }
}

export const updateUserAvatar = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing");
    }

    // TODO: delete old image - assignment

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading avatar");
    }

    const user = await User.findByIdAndUpdate(
        userId,  // Use the authenticated user's ID directly
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new: true }
    );
    return res.status(200).json(new ApiResponse(200, user, "Avatar image updated successfully"));
});



export const updateUserCoverImage = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const coverImageLocalPath = req.file?.path

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image file is missing")
    }

    //TODO: delete old image - assignment


    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploading on avatar")

    }

    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new: true }
    )
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "Cover image updated successfully")
        )
});

export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { username: { $regex: query, $options: "i" } }
            ]
        }).limit(40);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

// Save video method
export const saveVideo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const videoId = req.params.videoId;

        if (user.savedVideos.includes(videoId)) {
            return res.status(400).json({ message: "Video already saved" });
        }

        user.savedVideos.push(videoId);
        await user.save();

        res.status(200).json({ message: "Video saved successfully" });
    } catch (error) {
        next(error);
    }
};

export const unsaveVideo = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const videoId = req.params.videoId;

        user.savedVideos = user.savedVideos.filter(id => id.toString() !== videoId);
        await user.save();

        res.status(200).json({ message: "Video unsaved successfully" });
    } catch (error) {
        next(error);
    }
};


// Function to get saved videos
export const getSavedVideos = async (req, res) => {
    const userId = req.params.id; // Assuming user ID is passed as a URL parameter

    try {
        const user = await User.findById(userId).select('savedVideos').populate('savedVideos'); // Populate if you want video details
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.savedVideos);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const changeCurrentPassword = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id; // Ensure you get the user ID from the authenticated user
        const { oldPassword, newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword || !oldPassword) {
            throw new ApiError(400, "Please provide all required fields.");
        }

        if (newPassword !== confirmPassword) {
            throw new ApiError(400, "Passwords do not match.");
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new ApiError(404, "User not found.");
        }

        const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

        if (!isPasswordCorrect) {
            throw new ApiError(400, "Invalid old password.");
        }

        user.password = newPassword;
        await user.save({ validateBeforeSave: false });

        return res.status(200).json(new ApiResponse(200, { user }, "Password changed successfully."));
    } catch (error) {
        console.log(error);
        throw new ApiError(500, error.message);
    }
});
