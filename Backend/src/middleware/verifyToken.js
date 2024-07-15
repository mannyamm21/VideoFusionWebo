import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/User.js';

export const verifyToken = asyncHandler(async (req, res, next) => {
    try {
        // const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        // console.log('Token:', token); // Check the extracted token
        // // console.log(token);
        // if (!token) {
        //     throw new ApiError(401, "Unauthorized request")
        // }

        const decodedToken = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2Njk0ZTU0MzQ5MjlkNmU4NGRiYzY4ZjgiLCJlbWFpbCI6Im1haW51c2VyQGdtYWlsLmNvbSIsInVzZXJuYW1lIjoibWFpbnVzZXIxIiwibmFtZSI6Ik1haW5Vc2VyIiwiaWF0IjoxNzIxMDQxMDc1LCJleHAiOjE3MjEyMTM4NzV9.727F4S305HkDzqee28XBdaGOB__RCxvGVjH2mrHXre8", process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {

            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
});
