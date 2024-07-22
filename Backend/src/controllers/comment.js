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
        console.log(req.params.id)
        if (!comment) {
            return next(new ApiError(404, "Comment not found"));
        }

        const video = await Video.findById(comment.videoId);
        if (!video) {
            return next(new ApiError(404, "Video not found"));
        }

        if (req.user._id.equals(comment.userId) || req.user._id.equals(video.userId)) {
            await Comment.findByIdAndDelete(req.params.id);
            await Video.findByIdAndUpdate(comment.videoId, { $pull: { comments: req.params.id } });
            res.status(200).json("The comment has been deleted.");
        } else {
            return next(new ApiError(403, "You are not authorized to delete this comment"));
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
