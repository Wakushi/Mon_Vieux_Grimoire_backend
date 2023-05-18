const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
require("dotenv").config()

const JWT_SECRET = process.env.JWT_SECRET

exports.signup = (req, res) => {
	bcrypt
		.hash(req.body.password, 10)
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash
			})
			user.save()
				.then(() => res.status(201).json({ message: "User created" }))
				.catch((error) => res.status(400).json(error))
		})
		.catch((error) => res.status(500).json({ error }))
}
exports.login = (req, res) => {
	User.findOne({ email: req.body.email })
		.then((user) => {
			if (user === null) {
				res.status(401).json({ message: "Incorrect email or password" })
			} else {
				bcrypt
					.compare(req.body.password, user.password)
					.then((valid) => {
						if (!valid) {
							res.status(401).json({
								message: "Incorrect email or password"
							})
						} else {
							res.status(200).json({
								userId: user._id,
								token: jwt.sign(
									{ userId: user._id },
									JWT_SECRET,
									{ expiresIn: "24h" }
								)
							})
						}
					})
					.catch((error) => res.status(500).json({ error }))
			}
		})
		.catch((error) => res.status(500).json({ error }))
}
