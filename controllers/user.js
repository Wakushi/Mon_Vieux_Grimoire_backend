const userService = require("../services/user.service.js")

exports.signup = (req, res) => {
	userService
		.createUser({ email: req.body.email, password: req.body.password })
		.then(() => res.status(201).json({ message: "User created" }))
		.catch((error) => res.status(400).json(error))
}

exports.login = (req, res) => {
	userService
		.logUser({ email: req.body.email, password: req.body.password })
		.then((authToken) => res.status(200).json(authToken))
		.catch((error) => res.status(400).json({ error: error.message }))
}
