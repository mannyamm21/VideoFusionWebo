import mongoose, { Schema } from 'mongoose'

const tiwtteSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    desc: {
        type: String,
        required: true,
    },
    postImage: {
        type: String,
        default: '',
    },
    likes: {
        type: [String],
        default: [],
    },
    dislikes: {
        type: [String],
        default: [],
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TiwtteComment' }]
}, { timestamps: true })

export const Tiwtte = mongoose.model("Tiwtte", tiwtteSchema)