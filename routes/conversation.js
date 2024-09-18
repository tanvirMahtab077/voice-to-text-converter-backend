const express = require("express");
const router = express.Router();
const conversationController = require("../controllers/conversationController");
const verifyRoles = require("../middleware/verifyRoles");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/").post(conversationController.createNewConversation);
router.route("/").get(conversationController.getAllConversation);
router.route("/:id").get(verifyJWT, conversationController.getOneConversation);
router
  .route("/:id")
  .patch(
    verifyJWT,
    verifyRoles("Admin", "User"),
    conversationController.updateConversation
  );
router.route("/:id").delete(
  verifyJWT,
  // verifyRoles("Admin"),
  conversationController.deleteOneConversation
);

module.exports = router;