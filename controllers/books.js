const bookService = require("../services/book.service.js")

exports.getAllBooks = (req, res) => {
	bookService
		.getBooks()
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }))
}

exports.getOneBook = (req, res) => {
	bookService
		.getBookById(req.params.id)
		.then((book) => res.status(200).json(book))
		.catch((error) => res.status(400).json({ error }))
}

exports.getBestBooks = (req, res) => {
	bookService
		.getBestBooks()
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }))
}

exports.createBook = (req, res) => {
	const imageUrl = getImageUrl(req)
	bookService
		.createBook({
			book: req.body.book,
			userId: req.auth.userId,
			imageUrl: imageUrl
		})
		.then(() => res.status(201).json({ message: "Book created" }))
		.catch((error) => res.status(400).json({ error }))
}

exports.modifyBook = (req, res) => {
	const imageUrl = req.file ? getImageUrl(req) : null

	bookService
		.modifyBook({ book: req.body, imageUrl: imageUrl, id: req.params.id })
		.then(() => {
			res.status(200).json({ message: "Book updated" })
		})
		.catch((error) => res.status(400).json({ error }))
}

exports.deleteBook = (req, res) => {
	bookService
		.deleteBook(req.params.id)
		.then(() => {
			res.status(200).json({ message: "Book deleted" })
		})
		.catch((error) => res.status(400).json({ error }))
}

exports.rateBook = (req, res) => {
	if (req.auth.userId !== req.body.userId) {
		return res.status(401).json({ message: "Not authorized" })
	}
	bookService
		.rateBook({
			bookId: req.params.id,
			userId: req.auth.userId,
			rating: req.body.rating
		})
		.then((ratedBook) => {
			res.status(200).json(ratedBook)
		})
		.catch((error) => res.status(400).json({ error: error.message }))
}

// UTILS

function getImageUrl(req) {
	return `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
}
