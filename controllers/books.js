const fs = require("fs")
const Book = require("../models/Book")

exports.getAllBooks = (req, res) => {
	Book.find()
		.then((books) => res.status(200).json(books))
		.catch((error) => res.status(400).json({ error }))
}

exports.getOneBook = (req, res) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => res.status(200).json(book))
		.catch((error) => res.status(400).json({ error }))
}

exports.getBestBooks = (req, res) => {
	Book.find()
		.sort({ averageRating: "desc" })
		.then((books) => {
			res.status(200).json(books.slice(0, 3))
		})
		.catch((error) => res.status(400).json({ error }))
}

exports.createBook = (req, res) => {
	const bookObject = JSON.parse(req.body.book)
	delete bookObject.userId
	const book = new Book({
		...bookObject,
		userId: req.auth.userId,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
		averageRating: 0,
		ratings: []
	})
	book.save()
		.then(() => res.status(201).json({ message: "Book created" }))
		.catch((error) => res.status(400).json({ error }))
}

exports.modifyBook = (req, res) => {
	const bookObject = req.file
		? {
				...JSON.parse(req.body.book),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`
		  }
		: { ...req.body }

	delete bookObject.userId

	Book.updateOne(
		{ _id: req.params.id },
		{ ...bookObject, _id: req.params.id }
	)
		.then(() => {
			res.status(200).json({ message: "Book updated" })
		})
		.catch((error) => res.status(400).json({ error }))
}

exports.deleteBook = (req, res) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			const filename = book.imageUrl.split("/images/")[1]
			fs.unlink(`images/${filename}`, () => {
				Book.deleteOne({ _id: req.params.id })
					.then(() => {
						res.status(200).json({ message: "Book deleted" })
					})
					.catch((error) => res.status(400).json({ error }))
			})
		})
		.catch((error) => res.status(400).json({ error }))
}

exports.rateBook = (req, res) => {
	if (req.auth.userId !== req.body.userId) {
		res.status(401).json({ message: "Not authorized" })
	} else {
		Book.findOne({ _id: req.params.id })
			.then((book) => {
				if (
					book.ratings.find(
						(rating) => rating.userId === req.auth.userId
					)
				) {
					res.status(401).json({ message: "Book already rated" })
				} else {
					const ratings = [
						...book.ratings,
						{
							userId: req.auth.userId,
							grade: req.body.rating
						}
					]

					const newAverageRating =
						book.ratings
							.map((rating) => rating.grade)
							.reduce((total, num) => total + num) /
						book.ratings.length

					Book.findOneAndUpdate(
						{ _id: req.params.id },
						{
							ratings: ratings,
							averageRating: newAverageRating
						},
						{ new: true }
					)
						.then((ratedBook) => {
							res.status(200).json(ratedBook)
						})
						.catch((error) => res.status(400).json({ error }))
				}
			})
			.catch((error) => res.status(400).json({ error }))
	}
}
