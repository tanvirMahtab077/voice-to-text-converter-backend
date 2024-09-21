require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const connectDB = require("./config/connectDB");
const corsOptions = require("./config/corsOptions");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const rootRoute = require("./routes/root");
const indexRoute = require("./routes/index");

// check express version
const fs = require("fs");
const package = fs.readFileSync("package.json");
const packageParse = JSON.parse(package);
const expressVersion = `v ${packageParse.dependencies.express.slice(1)}`;
console.info(`Using Express.js ${expressVersion}`);

// connect to Mongo DB
connectDB();

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

// Then pass them to cors:
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// routes
app.use("/api", indexRoute);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.use("*", rootRoute);
}

app.use(errorHandler);

// listening for request when successfully connected to the MongoDB
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});
