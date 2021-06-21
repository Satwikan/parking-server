const express = require("express");
const router = express.Router();
const User = require("../../models/user");
const Slot = require("../../models/slot");
const cors = require("cors");

router.post("/recharge", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(400).json({ amount: "User does not exist" });
    } else if (user && user.status === "Pending") {
      return res.status(400).json({ amount: "Verify your account first" });
    }
    user.Balance = parseInt(user.Balance) + parseInt(req.body.amount);
    console.log("user", user);
    await user.save();
    return res.status(200).json({ message: "recharge success" });
  } catch (e) {
    console.log("error /recharge", e);
  }
});

router.post("/book", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(400).json({ vName: "User does not exist" });
    } else if (user && user.status === "Pending") {
      return res.status(400).json({ vName: "Verify your account first" });
    }
    const slot = await Slot.findOne({ name: "Parking" });
    if (!slot)
      return res
        .status(500)
        .json({ vName: "There is some Server Problem, Please wait" });

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
    return res.status(200).json({ History: user.History });
  } catch (e) {
    console.log("error /book", e);
  }
});

router.get("/history", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(400).json({ History: "User does not exist" });
    } else if (user && user.status === "Pending") {
      return res.status(400).json({ History: "Verify your account first" });
    }
    return res.status(200).send({ History: user.History });
  } catch (e) {
    console.log("error /history", e);
  }
});

router.get("/balance", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(400).json({ Balance: "User does not exist" });
    } else if (user && user.status === "Pending") {
      return res.status(400).json({ Balance: "Verify your account first" });
    }
    return res.status(200).json({ Balance: user.Balance });
  } catch (e) {
    console.log("error /balance", e);
  }
});

router.get("/endbooking", async (req, res) => {
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    } else if (user && user.status === "Pending") {
      return res.status(400).json({ error: "Verify your account first" });
    }
    const billIndex = user.History.findIndex((item) => {
      item._id === req.body.billId;
    });
    user.History[billIndex].status = "Completed";
    await user.save();
    return res.status(200).json({ Bill: user.History[billIndex] });
  } catch (e) {
    console.log("error /endbooking", e);
  }
});

router.get("/vacancy", async (req, res) => {
  try {
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
