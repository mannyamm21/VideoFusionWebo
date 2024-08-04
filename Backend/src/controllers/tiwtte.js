import { Tiwtte } from "../models/Tiwttes.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const addTiwtte = async (req, res, next) => {
    try {
        const { desc } = req.body;
        let postImage = '';
        if (req.file) {
            const uploadedImage = await uploadOnCloudinary(req.file.path);
            postImage = uploadedImage.secure_url;
        }

        const tiwtte = new Tiwtte({
            userId: req.user.id,
            postImage,
            desc
        });

        const newTiwtte = await tiwtte.save();
        await User.findByIdAndUpdate(req.user.id, {
            $push: { tiwttes: newTiwtte._id }
        })
        res.status(200).json(newTiwtte);
    } catch (error) {
        next(error);
    }
};

export const updateTiwtte = async (req, res, next) => {
    try {
        const tiwtte = await Tiwtte.findById(req.params.id);
        if (!tiwtte) throw new ApiError(404, "Tiwtte not found");
        if (req.user.id === tiwtte.userId.toString()) {
            const updateTiwtte = await Tiwtte.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            res.status(200).json(updateTiwtte);
        } else {
            throw new ApiError(403, "You can update only your tiwtte");
        }
    } catch (error) {
        next(error);
    }
};

export const updateTiwtteImage = async (req, res) => {
    const tiwtteId = req.params.id;
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Image file is missing");
    }

    // TODO: delete old image - assignment

    const image = await uploadOnCloudinary(imageLocalPath);

    if (!image.url) {
        throw new ApiError(400, "Error while uploading image");
    }
    const tiwtte = await Tiwtte.findByIdAndUpdate(
        tiwtteId,
        {
            $set: {
                postImage: image.url
            }
        },
        { new: true }
    );
    return res.status(200).json(new ApiResponse(200, tiwtte, "Tiwtte image updated successfully"));
};

export const deleteTiwtte = async (req, res, next) => {
    try {
        const tiwtte = await Tiwtte.findById(req.params.id);
        if (!tiwtte) throw new ApiError(404, "Tiwtte not found");
        if (req.user.id === tiwtte.userId.toString()) {
            await Tiwtte.findByIdAndDelete(
                req.params.id
            );
            await User.findByIdAndUpdate(
                req.user.id, {
                $pull: { tiwttes: req.params.id }
            }
            )
            res.status(200).json("The tiwtte has been delete")
        } else {
            throw new ApiError(403, "You can update only your tiwtte")
        }
    } catch (error) {
        next(error)
    }
}

export const getTiwtte = async (req, res, next) => {
    try {
        const tiwtte = await Tiwtte.findById(req.params.id)
        res.status(200).json(tiwtte)
    } catch (error) {
        next(error)
    }
}

export const getAllTiwttes = async (req, res, next) => {
    try {
        const tiwtte = await Tiwtte.find().sort({ createdAt: -1 })
        res.status(200).json(tiwtte)
    } catch (error) {
        next(error)
    }
}