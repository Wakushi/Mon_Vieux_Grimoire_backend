const Book = require("../models/Book")

module.exports = (req, res, next) => {
	Book.findOne({ _id: req.params.id })
		.then((book) => {
			if (book.userId !== req.auth.userId) {
				res.status(401).json({
					message: "Not authorized to modify or delete this book"
				})
			} else {
				next()
			}
		})
		.catch((error) => res.status(400).json(error))
}
