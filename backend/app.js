require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const userRoutes = require("./routes/userRoute");

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());
app.use(userRoutes);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

mongoose.connect(
  `mongodb+srv://nisarg:${process.env.PASSWORD}@cluster0.x2a77.mongodb.net/placesDB`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

app.listen(process.env.PORT || 5000, function () {
  console.log("server is running on port 5000.");
});
