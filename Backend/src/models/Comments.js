import mongoose, { Schema } from 'mongoose'

const commentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    videoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Video', required: true },
    desc: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export const Comment = mongoose.model("Comment", commentSchema)