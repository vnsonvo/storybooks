const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const path = require("path")
const { engine } = require("express-handlebars")
const passport = require("passport")
const session = require("express-session")
const connectDB = require("./config/db")
const indexRoutes = require("./routes/index")
const authRoutes = require("./routes/auth")
const storyRoutes = require("./routes/stories")
const mongoose = require("mongoose")
const MongoStore = require("connect-mongo")

// Load config
dotenv.config({ path: "./config/config.env" })

// Passport config
require("./config/passport")(passport)

connectDB()

const app = express()

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Handlebars Helpers
const { formatDate, stripTags, truncate } = require("./helpers/hbs")

// Handlebars
app.engine(
  ".hbs",
  engine({
    helpers: { formatDate, stripTags, truncate },
    defaultLayout: "main",
    extname: ".hbs",
  })
)
app.set("view engine", ".hbs")

// Sessions
app.use(
  session({
    secret: "haha checking secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Static folder
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use("/", indexRoutes)
app.use("/auth", authRoutes)
app.use("/stories", storyRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
