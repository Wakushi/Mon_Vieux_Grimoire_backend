const express = require("express")
const booksController = require("../controllers/books")
const auth = require("../middleware/auth")
const multer = require("../middleware/multer-config")
const router = express.Router()

router.get("/", booksController.getAllBooks)
router.get("/bestrating", booksController.getBestBooks)
router.get("/:id", booksController.getOneBook)

router.post("/", auth, multer, booksController.createBook)
router.put("/:id", auth, multer, booksController.modifyBook)
router.delete("/:id", auth, booksController.deleteBook)
router.post("/:id/rating", auth, booksController.rateBook)

module.exports = router
