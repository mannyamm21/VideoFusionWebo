import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js'

export const verifyToken = asyncHandler(async (req, res, next) => {
    // const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "")

    const token = req.cookies.access_token;
    console.log('Cookies:', req.cookies);
    console.log("Token:", token);
    if (!token) throw new ApiError(401, "Unauthorized request")

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) throw new ApiError(401, "Invalid Access Token")
        req.user = user;
        next()
    });
});
