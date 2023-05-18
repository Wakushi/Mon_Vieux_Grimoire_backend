const express = require("express")
const booksController = require("../controllers/books")
const auth = require("../middleware/auth")
const router = express.Router()

router.get("/", auth, booksController.getAllBooks)
router.get("/:id", auth, booksController.getOneBook)
router.get("/bestrating", auth, booksController.getBestBooks)

router.post("/", auth, booksController.createBook)
router.put("/:id", auth, booksController.modifyBook)
router.delete("/:id", auth, booksController.deleteBook)

router.post("/:id/rating", auth, booksController.rateBook)

module.exports = router
