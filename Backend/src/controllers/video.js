import { Video } from '../models/Video.js';
import { User } from '../models/User.js';

export const addVideo = async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body });
    try {
        const savedVideo = await newVideo.save();
        // Update user's videos array
        await User.findByIdAndUpdate(req.user.id, {
            $addToSet: { videos: savedVideo._id }
        });
        res.status(200).json(savedVideo);
    } catch (error) {
        next(error);
    }
};

export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) throw new ApiError(404, "Video not found!");
        if (req.user.id === video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(
                req.body.id,
                {
                    $set: req.body,
                }, {
                new: true
            }
            );
            res.status(200).json(updatedVideo)
        }
        else {
            throw new ApiError(403, "You can update only your video!")
        }
    } catch (error) {
        next(error)
    }
}

export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) throw new ApiError(404, "Video not found!");
        if (req.user.id === video.userId) {
            await Video.findByIdAndDelete(
                req.body.id
            );
            res.status(200).json("The video has been delete")
        }
        else {
            throw new ApiError(403, "You can update only your video!")
        }
    } catch (error) {
        next(error)
    }
}

export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id)
        res.status(200).json(video)
    } catch (error) {
        next(error)
    }
}

export const addView = async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id,
            { $inc: { views: 1 } }
        )
        res.status(200).json("The view has been increased")
    } catch (error) {
        next(error)
    }
}

export const random = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: 1 })
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}

export const trend = async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: -1 })
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}

export const sub = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannels = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannels.map(async (channelId) => {
                return await Video.find({ userId: channelId });
            })
        );

        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
        next(err);
    }
};

export const getBytag = async (req, res, next) => {
    const tags = req.query.tags.split(",");
    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        res.status(200).json(videos)
    } catch (error) {
        next(error)
    }
}

// Function to get videos by multiple tags
export const getByMultipleTags = async (req, res, next) => {
    const tags = req.query.tags.split(','); // Assuming tags are passed as comma-separated values
    try {
        const videos = await Video.find({ tags: { $all: tags } }).limit(20); // Using $all for multiple tags
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};

export const search = async (req, res, next) => {
    const query = req.query.q;
    try {
        const videos = await Video.find({
            title: { $regex: query, $options: "i" },
        }).limit(40);
        res.status(200).json(videos);
    } catch (error) {
        next(error)
    }
}

// Function to get videos by category
export const getByCategory = async (req, res, next) => {
    const category = req.params.category;
    try {
        const videos = await Video.find({ category: category }).limit(20);
        res.status(200).json(videos);
    } catch (error) {
        next(error);
    }
};