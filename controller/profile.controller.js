const Profile = require("../schema/profile.schema");
const CustomErrorHandler = require("../utils/custom-error-handler");
const sendMessage = require("../utils/email.sender");
const bcrypt = require("bcryptjs");
const {
  updateProfileValidator,
  changePasswordValidator,
} = require("../validator/profile.validator");

// 1. Get Me
const getMe = async (req, res, next) => {
  try {
    let userQuery = Profile.findById(req.user.id).select(
      "-password -otp -otpTime"
    );

    if (req.user.role === "admin") {
      userQuery = userQuery
        .populate({
          path: "myCars",
          select: "name",
        })
        .populate({
          path: "myCategories",
          select: "name",
        });
    }

    const user = await userQuery;

    if (!user) {
      return next(CustomErrorHandler.NotFound("Foydalanuvchi topilmadi"));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
// 2. Update Profile
const updateProfile = async (req, res, next) => {
  try {
    const { error, value } = updateProfileValidator.validate(req.body);
    if (error)
      return next(CustomErrorHandler.BadRequest(error.details[0].message));

    const { username, email, password } = value;
    const user = await Profile.findById(req.user.id);
    if (!user)
      return next(CustomErrorHandler.NotFound("Foydalanuvchi topilmadi"));

    if (req.file) {
      user.image = req.file.path.replace(/\\/g, "/");
    }

    let emailChanged = false;

    if (email && email !== user.email) {
      if (!password)
        return next(
          CustomErrorHandler.BadRequest(
            "Emailni o'zgartirish uchun parolni kiriting"
          )
        );

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return next(CustomErrorHandler.BadRequest("Noto'g'ri parol"));

      const emailExist = await Profile.findOne({ email });
      if (emailExist) return next(CustomErrorHandler.conflict("Bu email band"));

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await sendMessage(email, `Yangi emailni tasdiqlash uchun kod: ${code}`);

      user.tempEmail = email;
      user.otp = code;
      user.otpTime = Date.now() + 1000 * 60 * 5;
      user.isVerified = false;
      emailChanged = true;
    }

    if (username) {
      const usernameExist = await Profile.findOne({
        username,
        _id: { $ne: req.user.id },
      });
      if (usernameExist)
        return next(CustomErrorHandler.conflict("Bu username band"));
      user.username = username;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: emailChanged
        ? "Yangi emailingizga tasdiqlash kodi yuborildi"
        : "Profil muvaffaqiyatli yangilandi",
      data: {
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (error) {
    next(error);
  }
};

// 3. Change Password
const changePassword = async (req, res, next) => {
  try {
    const { error, value } = changePasswordValidator.validate(req.body);
    if (error)
      return next(CustomErrorHandler.BadRequest(error.details[0].message));

    const { currentPassword, newPassword } = value;
    const user = await Profile.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return next(
        CustomErrorHandler.BadRequest("Hozirgi parolingiz noto'g'ri")
      );

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Parol muvaffaqiyatli o'zgartirildi" });
  } catch (error) {
    next(error);
  }
};

// 4. Delete Account
const deleteAccaunt = async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password)
      return next(
        CustomErrorHandler.BadRequest(
          "Akkauntni o'chirish uchun parolni kiriting"
        )
      );

    const user = await Profile.findById(req.user.id);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(CustomErrorHandler.BadRequest("Parol noto'g'ri"));

    await Profile.findByIdAndDelete(req.user.id);
    res.status(200).json({ success: true, message: "Akkauntingiz o'chirildi" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe, updateProfile, changePassword, deleteAccaunt };
