import { User } from '../models/User.js'; // Adjust the path according to your project structure
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        console.log(user); // Check if the user is fetched correctly
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error in generateAccessAndRefereshTokens:", error);
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
    }
};

export const signUp = asyncHandler(async (req, res, next) => {
    const { name, email, username, password } = req.body;

    if ([name, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
        name,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name);

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export const signIn = asyncHandler(async (req, res, next) => {
    const { email, username, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }

    let user;
    if (email) {
        user = await User.findOne({ email });
    } else {
        user = await User.findOne({ username });
    }
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }
    console.log(user._id);

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user?._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200).json(new ApiResponse(200, {
        user: loggedInUser,
        accessToken,
        refreshToken,
    }, "User logged in Successfully"));
});

export const signOut = asyncHandler(async (req, res, next) => {
    return res.status(200).json(new ApiResponse(200, {}, "User logged Out"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);

        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

        return res.status(200).json(
            new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed")
        );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});


const generateRandomSuffix = () => {
    return Math.floor(1000 + Math.random() * 9000); // Generates a random number between 1000 and 9999
};

const isUsernameUnique = async (username) => {
    const user = await User.findOne({ username });
    return !user;
};

const generateUniqueUsername = async (name) => {
    let username = name.toLowerCase().replace(/\s+/g, '') + generateRandomSuffix();
    while (!(await isUsernameUnique(username))) {
        username = name.toLowerCase().replace(/\s+/g, '') + generateRandomSuffix();
    }
    return username;
};


export const googleAuth = asyncHandler(async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user?._id);
            console.log("user:", user)
            return res.status(200).json(new ApiResponse(200, {
                user: user._doc,
                accessToken,
                refreshToken,
            }, "User logged in Successfully"));
        } else {
            const username = await generateUniqueUsername(req.body.name);
            const newUser = new User({
                ...req.body,
                username,
                avatar: "https://t3.ftcdn.net/jpg/01/77/54/02/360_F_177540231_SkxuDjyo8ECrPumqf0aeMbean2Ai1aOK.jpg",
                fromGoogle: true,
            });
            const savedUser = await newUser.save();
            console.log("savedUser:", savedUser);
            const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(savedUser?._id);
            const loggedInUser = await User.findById(savedUser._id).select("-refreshToken");
            return res.status(200).json(new ApiResponse(200, {
                user: loggedInUser,
                accessToken,
                refreshToken,
            }, "User logged in Successfully"));
        }
    } catch (err) {
        next(err);
    }
});


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendWelcomeEmail = async (email, name) => {
    const mailOptions = {
        from: {
            name: "Welcome to Video Fusion",
            address: process.env.EMAIL_USERNAME,
        },
        to: email,
        subject: 'Welcome to VideoFusion!',
        text: `Hi ${name},
    
    Welcome to VideoFusion! We're thrilled to have you as a part of our community.
    
    At VideoFusion, we believe in the power of sharing and discovering amazing content. Whether you're here to watch, upload, or engage with our vibrant community, we have something for everyone.
    
    Here's how you can get started:
    1. **Upload Your Videos**: Share your unique videos with the world. Click the "Upload" button on our homepage to start sharing your creativity.
    2. **Explore Content**: Dive into a vast library of videos across various categories. From tutorials to entertainment, there's always something new to discover.
    3. **Make Tiwtte Posts**: Engage with the community by creating Tiwtte posts. Share your thoughts, start discussions, and connect with like-minded individuals.
    
    We can't wait to see the incredible content you'll bring to VideoFusion. If you have any questions or need assistance, our support team is always here to help.
    
    Enjoy your time on VideoFusion, and happy sharing!
    
    Best regards,
    The VideoFusion Team
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Welcome email sent successfully');
    } catch (error) {
        console.error('Error sending welcome email:', error);
    }
};

export const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "No user found with that email address");
    }

    user.generatePasswordReset();
    await user.save();

    const resetURL = `http://${process.env.CORS_ORIGIN}/reset-password/${user.resetPasswordToken}`;

    const mailOptions = {
        to: user.email,
        from: {
            name: "Video Fusion",
            address: process.env.EMAIL_USERNAME,
        },
        subject: 'Password Reset',
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${resetURL}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    transporter.sendMail(mailOptions, (err) => {
        if (err) {
            console.error("Error sending email:", err);
            throw new ApiError(500, "Error sending the email");
        }
        res.status(200).json(new ApiResponse(200, {}, "Password reset email sent successfully"));
    });
});


export const resetPassword = asyncHandler(async (req, res, next) => {
    const { token, password } = req.body;

    if (!token || !password) {
        throw new ApiError(400, "Token and new password are required");
    }

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
        throw new ApiError(400, "Password reset token is invalid or has expired");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json(new ApiResponse(200, {}, "Password has been reset"));
});