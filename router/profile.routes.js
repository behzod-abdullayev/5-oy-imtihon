const { Router } = require("express");
const { verifyToken } = require("../middleware/authorization");
const { getMe, updateProfile, changePassword, deleteAccaunt } = require("../controller/profile.controller");
const upload = require("../utils/multer");

const profileRouter = Router();

profileRouter.get("/get_me", verifyToken, getMe);
profileRouter.put("/update_account", verifyToken, upload.single("image"), updateProfile);
profileRouter.post("/change_password", verifyToken, changePassword);
profileRouter.delete("/delete_account", verifyToken, deleteAccaunt);

module.exports = profileRouter;