const {Router} = require("express")
const { register, verify, login, forgotPassword, resetPassword, resendOtp } = require("../controller/auth.controller")

const authRouter = Router()

authRouter.post("/register", register)
authRouter.post("/verify", verify)
authRouter.post("/login", login)
authRouter.post("/forgot_password", forgotPassword)
authRouter.post("/reset_password", resetPassword)
authRouter.post("/resend_otp", resendOtp)

module.exports = authRouter