import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        let token = req.cookies?.access_token || req.headers("Authorization");

        // Check if the token is from the Authorization header
        if (token && token.startsWith("Bearer ")) {
            token = token.split(' ')[1]; // Extract the token part after "Bearer "
        }

        console.log("Token:", token); // Log the token to check its format
        if (!token) throw new ApiError(401, "Unauthorized request");

        const secretKey = process.env.JWT;
        console.log("Secret Key:", secretKey); // Log the secret key to ensure it's set correctly

        const decodedToken = jwt.verify(token, secretKey);
        console.log("Decoded Token:", decodedToken); // Log the decoded token

        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Verification Error:", error.message); // Log the error message
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});
