const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET

exports.createUser = ({ email, password }) => {
	return encryptPassword(password)
		.then((hash) => {
			const user = new User({
				email: email,
				password: hash
			})
			return user.save()
		})
}

exports.logUser = ({ email, password }) => {
	return getUserByEmail(email).then((user) => {
		if (user === null) {
			throw new Error("Incorrect email or password")
		} else {
			return checkPassword(password, user.password)
				.then((valid) => {
					if (!valid) {
						throw new Error("Incorrect email or password")
					} else {
						return {
							userId: user._id,
							token: generateAuthToken(user._id)
						}
					}
				})
		}
	})
}

function encryptPassword(password) {
	const CRYPT_SALT = 10
	return bcrypt.hash(password, CRYPT_SALT)
}

function getUserByEmail(email) {
	return User.findOne({ email: email })
}

function checkPassword(reqPassword, dbPassword) {
	return bcrypt.compare(reqPassword, dbPassword)
}

function generateAuthToken(userId) {
	return jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: "24h" })
}
