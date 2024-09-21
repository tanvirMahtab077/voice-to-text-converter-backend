const express = require("express");
const authRouter = require("./authorisation");
const conversationRoute = require("./conversation");
const userRoute = require("./employees");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome",
    author: "Tanvir Mahtab (Software Engineer)",
  });
});

router.use("/auth", authRouter);
router.use("/conversation", conversationRoute);
router.use("/employees", userRoute);

module.exports = router;