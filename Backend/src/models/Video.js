import mongoose, { Schema } from 'mongoose';

const videoSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
        required: true,
    },
    videoUrl: {
        type: String,
    },
    views: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [String],
        default: [],
    },
    category: {
        type: String,
    },
    likes: {
        type: [String],
        default: [],
    },
    dislikes: {
        type: [String],
        default: [],
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // New field to store comments
}, { timestamps: true });

export const Video = mongoose.model("Video", videoSchema);
