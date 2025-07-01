const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");
const cookieParser = require("cookie-parser");
dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());
require("./middlewares/passport");

const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

app.listen(5000, () => console.log("This Server running on port 5000"));
