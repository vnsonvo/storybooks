const express = require("express")
const dotenv = require("dotenv")
const morgan = require("morgan")
const path = require("path")
const { engine } = require("express-handlebars")
const passport = require("passport")
const session = require("express-session")
const connectDB = require("./config/db")
const methodOverride = require("method-override")
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

// Method Override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Handlebars Helpers
const {
  formatDate,
  stripTags,
  truncate,
  editIcon,
  select,
} = require("./helpers/hbs")

// Handlebars
app.engine(
  ".hbs",
  engine({
    helpers: { formatDate, stripTags, truncate, editIcon, select },
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

// Set global var
app.use(function (req, res, next) {
  res.locals.user = req.user || null
  next()
})

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
