const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.config");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error-handler");


const authRouter = require("./router/auth.routes");
const profileRouter = require("./router/profile.routes");
const categoryRouter = require("./router/category.routes");
const logger = require("./utils/logger");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


connectDB();
// logger.warn("warning logger")
// logger.info("info logger")
// logger.debug("debug logger")
// logger.error


//router
app.use(authRouter);
app.use(profileRouter);
app.use(categoryRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
