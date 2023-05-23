const express = require("express");
const booksController = require("../controllers/books");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const isBookOwner = require("../middleware/isBookOwner");
const router = express.Router();

router.get("/", booksController.getAllBooks);
router.get("/bestrating", booksController.getBestBooks);
router.get("/:id", booksController.getOneBook);

router.post(
  "/",
  auth,
  multer.uploadSingleImage,
  multer.convertToWebP,
  booksController.createBook
);
router.put(
  "/:id",
  auth,
  isBookOwner,
  multer.uploadSingleImage,
  multer.convertToWebP,
  booksController.modifyBook
);
router.delete("/:id", auth, isBookOwner, booksController.deleteBook);
router.post("/:id/rating", auth, booksController.rateBook);

module.exports = router;
