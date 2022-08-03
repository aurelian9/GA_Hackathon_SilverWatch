require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./db/db");
const volunteers = require("./router/volunteer");
const elderly = require("./router/elderly");
const admin = require("./router/admin");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
connectDB(process.env.MONGODB_URI);

app.use("/volunteer", volunteers);
app.use("/elder", elderly);
app.use("/admin", admin);

const PORT = process.env.PORT || 5001;
app.listen(PORT);
