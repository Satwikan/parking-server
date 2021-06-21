const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Slot = require("../../models/slot");
const cors = require("cors");

router
  .options("/recharge", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  })
  .post("/recharge", async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      const user = await User.findById(req.body.id);
      if (!user) {
        return res.status(400).json({ amount: "User does not exist" });
      } else if (user && user.status === "Pending") {
        return res.status(400).json({ amount: "Verify your account first" });
      }
      user.balance += req.body.amount;
      await user.save();
    } catch (e) {
      console.log("error /recharge", e);
    }
  });

router
  .options("/book", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  })
  .post("/book", async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      const user = await User.findById(req.body.id);
      if (!user) {
        return res.status(400).json({ amount: "User does not exist" });
      } else if (user && user.status === "Pending") {
        return res.status(400).json({ amount: "Verify your account first" });
      }
      const slot = await Slot.findOne({ name: "Parking" });
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
      console.log(user);
      user.History.push(booking);
      await user.save();
      await slot.save();
      return res.status(200).send({ bill: user.history[-1] });
    } catch (e) {
      console.log("error /book", e);
    }
  });

router
  .options("/history", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  })
  .get("/history", async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      const user = await User.findById(req.body.id);
      if (!user) {
        return res.status(400).json({ amount: "User does not exist" });
      } else if (user && user.status === "Pending") {
        return res.status(400).json({ amount: "Verify your account first" });
      }
      return res.status(200).send({ history: user.history });
    } catch (e) {
      console.log("error /history", e);
    }
  });

router
  .options("/balance", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  })
  .get("/balance", async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      const user = await User.findById(req.body.id);
      if (!user) {
        return res.status(400).json({ amount: "User does not exist" });
      } else if (user && user.status === "Pending") {
        return res.status(400).json({ amount: "Verify your account first" });
      }
      return res.status(200).json({ balance: user.balance });
    } catch (e) {
      console.log("error /balance", e);
    }
  });

router
  .options("/endbooking", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  })
  .get("/endbooking", async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      const user = await User.findById(req.body.id);
      if (!user) {
        return res.status(400).json({ amount: "User does not exist" });
      } else if (user && user.status === "Pending") {
        return res.status(400).json({ amount: "Verify your account first" });
      }
      // user.history.map
    } catch (e) {
      console.log("error /endbooking", e);
    }
  });

router
  .options("/vacancy", function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.end();
  })
  .get("/vacancy", async (req, res) => {
    try {
      res.setHeader("Access-Control-Allow-Origin", "*");
      const slot = await Slot.findOne({ name: "Parking" });
      if (!slot)
        return res
          .status(500)
          .json({ message: "There is some Server Problem, Please wait" });

      if (slot.occupied >= 60)
        return res
          .status(400)
          .json({ message: "All Slots are booked, Please wait" });
      return res.status(200).json({ message: "Slots are available book Now!" });
    } catch (e) {
      console.log("error /vacancy", e);
    }
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
