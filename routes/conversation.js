const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const verifyRoles = require("../middleware/verifyRoles");
const verifyJWT = require("../middleware/verifyJWT");
const { auth } = require("../middleware/auth");

router.route("/").post(conversationController.createNewConversation);
router
  .route("/")
  .get(
    auth(["Admin","User"]),
    conversationController.getAllConversation
  );
router.route("/:id").get(verifyJWT,verifyRoles("Admin",'User'), conversationController.getOneConversation);
router
  .route("/:id")
  .patch(
    verifyJWT,
    verifyRoles("Admin", "User"),
    conversationController.updateConversation
  );
router.route("/:id").delete(
  verifyJWT,
  verifyRoles("Admin"),
  conversationController.deleteOneConversation
);

module.exports = router;
