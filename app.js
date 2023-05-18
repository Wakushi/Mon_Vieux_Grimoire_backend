const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
require("dotenv").config()

// ROUTES
const userRoutes = require("./routes/user")

// ENVIRONMENT
const MONGO_DATABASE_URL = process.env.MONGO_DATABASE_URL
const AUTHORIZED_URL = process.env.AUTHORIZED_URL

const app = express()

mongoose
	.connect(MONGO_DATABASE_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"))

app.use(express.json())
app.use(
	cors({
		origin: AUTHORIZED_URL
	})
)

app.use("/api/auth", userRoutes)

// app.post("/api/books", (req, res) => {
// 	console.log(req.body)
// 	res.status(201).json({ message: "Object created !" })
// })

module.exports = app
