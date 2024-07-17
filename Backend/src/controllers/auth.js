import { User } from '../models/User.js'; // Adjust the path according to your project structure
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

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
