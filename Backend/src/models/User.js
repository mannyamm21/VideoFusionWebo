import mongoose, { Schema } from 'mongoose'
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto";
import { type } from 'os';

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    username: {
        type: String,
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
        unique: true,
    },
    tiwttes: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Tiwtte' }]
    },
    fromGoogle: {
        type: Boolean,
        default: false,
    },
    refreshToken: {
        type: String,
    },
    resetPasswordToken: { type: String }, // Add this field
    resetPasswordExpires: { type: Date } // Add this field
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

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: '2d'
        }
    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: '10d'
        }
    )
}

userSchema.methods.generatePasswordReset = function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; // 1 hour
};

export const User = mongoose.model("User", userSchema)