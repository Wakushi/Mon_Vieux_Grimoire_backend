const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const path = require("path")
require("dotenv").config()

// ROUTES
const userRoutes = require("./routes/user")
const bookRoutes = require("./routes/books")

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
app.use("/api/books", bookRoutes)
app.use("/images", express.static(path.join(__dirname, "images")))

module.exports = app
