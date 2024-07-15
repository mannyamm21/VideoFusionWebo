import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/User.js'

export const verifyToken = asyncHandler(async (req, res, next) => {
    // const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "")

    // const token = req.cookies.access_token;
    // console.log('Cookies:', req.cookies);
    // console.log("Token:", token);

    try {
        const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) throw new ApiError(401, "Unauthorized request")

        const decodedToken = jwt.verify(token, process.env.JWT)
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
});
