const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const passport = require("passport");
const users = require("./routes/api/users");

// middleware
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// CORS
app.use(cors());

// DB Config
const db = require("./keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB successfully connected 🏢"))
  .catch((err) => console.log(err));

// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/users", users);

// process.env.port is Heroku's port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
