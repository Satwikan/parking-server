const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const FRONT_URL = require("./frontUrl");
const passport = require("passport");
const users = require("./routes/api/users");
const account = require("./routes/api/account");
// middleware
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());

// CORS
app.use(cors());

// Add headers
// app.use(function (req, res, next) {
//   // Website you wish to allow to connect
//   res.setHeader("Access-Control-Allow-Origin", FRONT_URL);

//   // Request methods you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );

//   // Request headers you wish to allow
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,content-type"
//   );

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)

//   // Pass to next layer of middleware
//   next();
// });

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
