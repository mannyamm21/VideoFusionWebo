import mongoose, { Schema } from 'mongoose'

const commentSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tiwtteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tiwtte', required: true },
    desc: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export const TiwtteComment = mongoose.model("TiwtteComment", commentSchema)