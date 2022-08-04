const express = require("express");
const membersController = require("../controllers/membersController");

const router = express.Router();

router.get("/sign-up", membersController.sign_up_get);
router.post("/sign-up", membersController.sign_up_post);

router.get("/log-in", membersController.log_in_get);
router.post("/log-in", membersController.log_in_post);

router.get("/clubhouse", membersController.clubhouse_get);
router.post("/clubhouse", membersController.clubhouse_post);

router.get("/admin", membersController.admin_get);
router.post("/admin", membersController.admin_post);

router.get("/about", membersController.about_get);

router.get("/log-out", membersController.log_out_get);

router.get("/message/delete/:id", membersController.delete_message_get);

module.exports = router;