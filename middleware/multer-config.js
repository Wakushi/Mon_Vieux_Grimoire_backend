const multer = require("multer");
const sharp = require("sharp");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.memoryStorage(); // Use memory storage instead of disk storage

const upload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    const isSupportedType = Object.values(MIME_TYPES).includes(extension);

    if (isSupportedType) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type."));
    }
  },
});

const uploadSingleImage = upload.single("image");

const convertToWebP = (req, res, next) => {
  if (req.file) {
    const name = req.file.originalname.split(" ").join("_");
    const webpFileName = name + Date.now() + "." + "webp";

    sharp(req.file.buffer)
      .webp()
      .toFile("images/" + webpFileName, (error) => {
        if (error) {
          next(error);
        } else {
          req.file.filename = webpFileName;
          next();
        }
      });
  } else {
    next();
  }
};

module.exports = { uploadSingleImage, convertToWebP };
