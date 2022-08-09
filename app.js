const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const { engine } = require("express-handlebars");
const connectDB = require("./config/db");
const indexRoutes = require("./routes/index");

// Load config
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Handlebars
app.engine(".hbs", engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", ".hbs");

// app.engine("handlebars", engine());
// app.set("view engine", "handlebars");

// Static folder
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
