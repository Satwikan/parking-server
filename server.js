const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const passport = require("passport");
const users = require("./routes/api/users");
const account = require("./routes/api/account");

// middleware
app.use(cors());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// CORS
app.options("*", cors());
app.options("*", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.end();
});

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
app.use("/api/account", account);

// process.env.port is Heroku's port
const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up and running on port ${port} !`));
