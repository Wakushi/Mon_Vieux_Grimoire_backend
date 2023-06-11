const fsp = require("fs").promises
const Book = require("../models/Book")

exports.getBooks = () => {
	return Book.find()
}

exports.getBookById = (id) => {
	return Book.findOne({ _id: id })
}

exports.getBestBooks = (bookLimit = 3) => {
	return Book.find()
		.sort({ averageRating: "desc" })
		.then((books) => {
			return books.slice(0, bookLimit)
		})
}

exports.createBook = ({ book, userId, imageUrl }) => {
	const bookObject = JSON.parse(book)
	delete bookObject.userId
	const newBook = new Book({
		...bookObject,
		userId: userId,
		imageUrl: imageUrl,
		averageRating: 0,
		ratings: []
	})
	return newBook.save()
}

exports.modifyBook = ({ book, imageUrl, id }) => {
	const bookObject = imageUrl
		? {
				...JSON.parse(book.book),
				imageUrl: imageUrl
		  }
		: { ...book }

	delete bookObject.userId
	return Book.updateOne({ _id: id }, { ...bookObject, _id: id })
}

exports.deleteBook = (id) => {
	return Book.findOne({ _id: id }).then((book) => {
		const filename = book.imageUrl.split("/images/")[1]
		return fsp.unlink(`images/${filename}`).then(() => {
			return Book.deleteOne({ _id: id })
		})
	})
}

exports.rateBook = ({ bookId, userId, rating }) => {
	return Book.findOne({ _id: bookId }).then((book) => {
		if (book.ratings.find((rating) => rating.userId === userId)) {
			throw new Error("Book already rated")
		} else {
			const ratings = [
				...book.ratings,
				{
					userId: userId,
					grade: rating
				}
			]

			return Book.findOneAndUpdate(
				{ _id: bookId },
				{
					ratings: ratings,
					averageRating: getAverageRating(ratings, rating)
				},
				{ new: true }
			)
		}
	})
}

function getAverageRating(ratings, newRating) {
	return ratings.length
		? ratings
				.map((rating) => rating.grade)
				.reduce((total, num) => total + num) / ratings.length
		: newRating
}
