const express = require("express");
const { registerUser, authUser} = require("../controllers/userControllers");

const router = express.Router();


//in this.route method we can chain on the same routte with get or post jo bhi ho
router.route("/").post(registerUser)
 router.post("/login",authUser)


module.exports = router;