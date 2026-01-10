const { Router } = require("express");
const { verifyToken } = require("../middleware/authorization");
const { getMe, updateProfile, changePassword, deleteAccaunt } = require("../controller/profile.controller");

const profileRouter = Router();

profileRouter.get("/getMe", verifyToken, getMe);
profileRouter.put("/update_accaunt", verifyToken, updateProfile);
profileRouter.post("/change_password", verifyToken, changePassword);
profileRouter.delete("/delete_accaunt", verifyToken, deleteAccaunt);

module.exports = profileRouter; 