import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, "./public/file")
    },
    filename: function (req, file, cd) {
        cd(null, file.originalname)
    }
})

export const upload = multer({
    storage,
})