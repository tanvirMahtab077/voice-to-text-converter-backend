const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const ROLES_LIST = require("../config/rolesList");
const verifyRoles = require("../middleware/verifyRoles");
const verifyJWT = require("../middleware/verifyJWT");

router.route("/").get(employeeController.getAllEmployees);

router.route("/:id").get(verifyJWT, employeeController.getOneEmployee);
router
  .route("/:id")
  .patch(
    verifyJWT,
    verifyRoles("Admin", "User"),
    employeeController.updateEmployee
  );
router.route("/:id").delete(
  verifyJWT,
  // verifyRoles("Admin"),
  employeeController.deleteOneEmployee
);

module.exports = router;
