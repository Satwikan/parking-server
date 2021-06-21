const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Slot = require("../../models/slot");

router.post("/recharge", (req, res) => {
  User.findById(req.body.id)
    .then((user) => {
      if (!user) {
        return res.status(400).json({ amount: "User does not exist" });
      } else if (user && user.status === "Pending") {
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

router.post("/book", (req, res) => {
  User.findById(req.body.id)
    .then((user) => {
      if (!user) {
        return res.status(400).json({ amount: "User does not exist" });
      } else if (user && user.status === "Pending") {
        return res.status(400).json({ amount: "Verify your account first" });
      }
      Slot.findOne({ name: "Parking" }).then((slot) => {
        if (!slot)
          return res
            .status(500)
            .send({ message: "There is some Server Problem, Please wait" });

        if (slot.occupied >= 60) {
          return res
            .status(400)
            .send({ vName: "All Slots are booked, Please wait" });
        }
        let slotNumber = "";
        slot.occupied += 1;
        if (slot.occupied < 11) slotNumber = slot.occupied + "A";
        else if (slot.occupied < 31) slotNumber = slot.occupied + "B";
        else if (slot.occupied < 61) slotNumber = slot.occupied + "C";

        const booking = {
          vName: req.body.vName,
          vNumber: req.body.vNumber,
          slotNumber: slotNumber,
        };
        user.history.push(booking);
        user.save.then(
          (user) => {
            res.status(200).send({ bill: user.history[-1] });
          },
          (err) => {
            console.log("Error user save book/:", err);
            return res.status(500).send({ message: err });
          }
        );
        slot.save().then((err) => console.log(err));
      });
    })
    .catch((e) => console.log("error", e));
});

router.get("/history", (req, res) => {
  User.findById(req.body.id).then((user) => {
    if (!user) {
      return res.status(400).json({ amount: "User does not exist" });
    } else if (user && user.status === "Pending") {
      return res.status(400).json({ amount: "Verify your account first" });
    }
    res.send({ history: user.history });
  });
});

router.get("/endbooking", (req, res) => {
  User.findById(req.body.id).then((user) => {
    if (!user) {
      return res.status(400).json({ amount: "User does not exist" });
    } else if (user && user.status === "Pending") {
      return res.status(400).json({ amount: "Verify your account first" });
    }
    // user.history.map
  });
});

router.get("vacancy", (req, res) => {
  Slot.findOne({ name: "Parking" }).then(
    (slot) => {
      if (!slot)
        return res
          .status(500)
          .send({ message: "There is some Server Problem, Please wait" });

      if (slot.occupied >= 60)
        return res
          .status(400)
          .send({ message: "All Slots are booked, Please wait" });
      return res.status(200).send({ message: "Slots are available book Now!" });
    },
    (err) => console.log(err)
  );
});

router.get("/slot", (req, res) => {
  const newSlot = new Slot({
    name: "Parking",
    occupied: 0,
  });
  newSlot.save().then((slot) => {
    res.json({
      message: "New Slot Made",
    });
  });
});

module.exports = router;
