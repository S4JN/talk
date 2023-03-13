const express = require("express");
const { registerUser, authUser, allUsers } = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware")

const router = express.Router();


//in this.route method we can chain on the same routte with get or post jo bhi ho
router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser)



module.exports = router;