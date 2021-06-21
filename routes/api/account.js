const express = require("express");
const router = express.Router();
const User = require("../../models/user");

router.post("/recharge", (req, res) => {
  User.findById(req.body.id)
    .then((user) => {
      if (!user) {
        return res.status(400).json({ amount: "User does not exist" });
      }
      if (user && user.status === "Pending") {
        return res.status(400).json({ amount: "Verify your account first" });
      }
      user.balance += req.body.amount;
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
});
