import { Video } from '../models/Video.js';
import { Comment } from '../models/Comments.js';
import { ApiError } from '../utils/ApiError.js';

export const addComment = async (req, res, next) => {
    const newComment = new Comment({ ...req.body, userId: req.user.id });
    try {
        const savedComment = await newComment.save();
        await Video.findByIdAndUpdate(req.body.videoId, { $push: { comments: savedComment._id } });
        res.status(200).send(savedComment);
    } catch (error) {
        next(error);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.id);
        const video = await Video.findById(comment.videoId);
        if (req.user.id === comment.userId.toString() || req.user.id === video.userId.toString()) {
            await Comment.findByIdAndDelete(req.params.id);
            await Video.findByIdAndUpdate(comment.videoId, { $pull: { comments: req.params.id } });
            res.status(200).json("The comment has been deleted.");
        } else {
            throw new ApiError(403, "You can delete only your comment.");
        }
    } catch (error) {
        next(error);
    }
};

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ videoId: req.params.videoId });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
};
