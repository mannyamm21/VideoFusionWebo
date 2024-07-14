import mongoose, { Schema } from 'mongoose'
import bcryptjs from "bcryptjs"
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowetcase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    avatar: {
        type: String, //cloudinary
        default: '',
    },
    coverImage: {
        type: String, //cloudinary
        default: '',
    },
    subscribers: {
        type: Number,
        default: 0,
    },
    videos: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    },
    savedVideos: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
    },
    subscribedUsers: {
        type: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },
    fromGoogle: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true })

// Method to add video ID to user's videos array
userSchema.methods.addVideo = async function (videoId) {
    if (!this.videos.includes(videoId)) {
        this.videos.push(videoId);
        await this.save();
    }
};

// Add the saveVideo method to the user schema
userSchema.methods.saveVideo = async function (videoId) {
    if (!this.savedVidoes.includes(videoId)) {
        this.savedVidoes.push(videoId);
        await this.save();
    }
};


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcryptjs.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcryptjs.compare(password, this.password)
}


export const User = mongoose.model("User", userSchema)