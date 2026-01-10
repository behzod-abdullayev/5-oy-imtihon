const Profile = require("../schema/profile.schema");
const CustomErrorHandler = require("../utils/custom-error-handler");
const sendMessage = require("../utils/email.sender");
const bcrypt = require("bcryptjs");
const {
  registerValidator,
  verifyValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  resendOtpValidator,
} = require("../validator/auth.validator");

const { tokenGenerator, refreshToken } = require("../utils/token-generator");

// 1. Register
const register = async (req, res, next) => {
  try {
    const { error, value } = registerValidator.validate(req.body);
    if (error) {
      return next(CustomErrorHandler.BadRequest(error.details[0].message));
    }
    const { username, email, password, role } = value;

    const usernameExist = await Profile.findOne({ username });
    if (usernameExist)
      return next(CustomErrorHandler.conflict(`bu foydalanuvchi nomi band`));

    const emailExist = await Profile.findOne({ email });
    if (emailExist) return next(CustomErrorHandler.conflict(`bu email band`));

    const hash = await bcrypt.hash(password, 12);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expireTime = Date.now() + 1000 * 60 * 5;

    await Profile.create({
      username,
      email,
      password: hash,
      role,
      otp: code,
      otpTime: expireTime,
      isVerified: false,
    });

    await sendMessage(email, `Emailni tasdiqlash kodi: ${code}`);
    res.status(201).json({
      success: true,
      message: "Tasdiqlash kodi emailingizga yuborildi",
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const { error, value } = verifyValidator.validate(req.body);
    if (error)
      return next(CustomErrorHandler.BadRequest(error.details[0].message));

    const { email, otp } = value;

    const user = await Profile.findOne({
      $or: [{ email: email }, { tempEmail: email }],
    });

    if (!user)
      return next(CustomErrorHandler.NotFound("Foydalanuvchi topilmadi"));

    if (user.otp !== otp)
      return next(CustomErrorHandler.BadRequest("Noto'g'ri kod kiritildi"));
    if (Date.now() > user.otpTime)
      return next(
        CustomErrorHandler.BadRequest("Kodning amal qilish muddati tugagan")
      );

    if (user.tempEmail === email) {
      user.email = user.tempEmail;
      user.tempEmail = null;
    }

    user.isVerified = true;
    user.otp = null;
    user.otpTime = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Email muvaffaqiyatli tasdiqlandi",
    });
  } catch (error) {
    next(error);
  }
};

// 3. Login
const login = async (req, res, next) => {
  try {
    const { error, value } = loginValidator.validate(req.body);
    if (error)
      return next(CustomErrorHandler.BadRequest(error.details[0].message));

    const { email, password } = value;
    const user = await Profile.findOne({ email });

    if (!user)
      return next(CustomErrorHandler.UnAuthorized("Email yoki parol xato"));
    if (!user.isVerified)
      return next(
        CustomErrorHandler.UnAuthorized("Avval emailingizni tasdiqlang")
      );

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return next(CustomErrorHandler.UnAuthorized("Email yoki parol xato"));

    const accessToken = tokenGenerator({ id: user._id, role: user.role });
    const refresh_token = refreshToken({ id: user._id, role: user.role });

    res.status(200).json({
      success: true,
      accessToken,
      refreshToken: refresh_token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 4. Forgot Password
const forgotPassword = async (req, res, next) => {
  try {
    const { error, value } = forgotPasswordValidator.validate(req.body);
    if (error)
      return next(CustomErrorHandler.BadRequest(error.details[0].message));

    const user = await Profile.findOne({ email: value.email });
    if (!user)
      return next(CustomErrorHandler.NotFound("Foydalanuvchi topilmadi"));

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = code;
    user.otpTime = Date.now() + 1000 * 60 * 5;
    await user.save();

    await sendMessage(value.email, `Parolni tiklash uchun kod: ${code}`);

    res.status(200).json({
      success: true,
      message: "Tiklash kodi yuborildi",
    });
  } catch (error) {
    next(error);
  }
};

// 5. Reset Password
const resetPassword = async (req, res, next) => {
  try {
    const { error, value } = resetPasswordValidator.validate(req.body);
    if (error)
      return next(CustomErrorHandler.BadRequest(error.details[0].message));

    const { email, otp, newPassword } = value;
    const user = await Profile.findOne({ email });

    if (!user)
      return next(
        CustomErrorHandler.NotFound(
          "Bunday emailga ega foydalanuvchi topilmadi"
        )
      );
    if (user.otp !== otp)
      return next(CustomErrorHandler.BadRequest("Tasdiqlash kodi noto'g'ri"));
    if (Date.now() > user.otpTime)
      return next(CustomErrorHandler.BadRequest("Kodning vaqti o'tgan"));

    user.password = await bcrypt.hash(newPassword, 12);
    user.otp = null;
    user.otpTime = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Parol muvaffaqiyatli yangilandi",
    });
  } catch (error) {
    next(error);
  }
};


//6. resend otp
const resendOtp = async (req, res, next) => {
  try {
   const {error, value} = resendOtpValidator.validate(req.body)
   if(error) {
    return next(CustomErrorHandler.BadRequest(error.details[0].message))
   }
   const {email} = value
   
    const user = await Profile.findOne({ email });

    if (!user) {
      return next(CustomErrorHandler.NotFound("foydalanuvchi topilmadi"));
    }

    if (user.isVerified) {
      return next(
        CustomErrorHandler.BadRequest("bu foydalanuvchi ro'yxatdan o'tgan")
      );
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = code;
    user.otpTime = Date.now() + 1000 * 60 * 5;
    await user.save();
    await sendMessage(email, `tasdiqlash kodi: ${code}`);

    res.status(200).json({
      succes: true,
      message: "tasdiqlash kodi emailingizga yuborildi",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  verify,
  login,
  forgotPassword,
  resetPassword,
  resendOtp,
};
