const Joi = require("joi");

// 1. Register -
const registerValidator = Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .alphanum()
    .required()
    .messages({
      "string.empty": "username bo'sh bo'lishi mumkin emas",
      "string.alphanum": "username faqat harf va raqamlardan iborat bo'lishi kerak",
      "any.required": "username kiritilishi shart",
    }),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .min(10)
    .max(50)
    .required()
    .messages({
      "string.email": "Noto'g'ri email formati kiritildi",
      "string.empty": "Email bo'sh bo'lishi mumkin emas",
    }),

  password: Joi.string()
    .trim()
    .min(8)
    .max(100)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .required()
    .messages({
      "string.min": "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
      "string.pattern.base": "Parolda kamida bitta katta harf, bitta kichik harf va raqam bo'lishi shart",
    }),

  role: Joi.string().valid("user", "admin").default("user"),
});

// 2. Verify OTP 
const verifyValidator = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Iltimos, tasdiqlash uchun to'g'ri email kiriting",
    "any.required": "Email kiritilishi shart",
  }),
  otp: Joi.string().length(6).required().messages({
    "string.length": "Tasdiqlash kodi 6 ta raqamdan iborat bo'lishi kerak",
    "any.required": "Tasdiqlash kodini (OTP) kiritish shart",
  }),
});

// 3. Login
const loginValidator = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Email noto'g'ri formatda",
    "any.required": "Email kiritilishi shart",
  }),
  password: Joi.string().trim().required().messages({
    "any.required": "Parol kiritilishi shart",
  }),
});

// 4. Forgot Password
const forgotPasswordValidator = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.email": "Noto'g'ri email formati",
    "any.required": "Email kiritilishi shart",
  }),
});

// 5. Reset Password
const resetPasswordValidator = Joi.object({
  email: Joi.string().trim().lowercase().email().required().messages({
    "string.empty": "Email maydoni bo'sh bo'lishi mumkin emas",
    "string.email": "Iltimos, haqiqiy email manzilingizni kiriting",
    "any.required": "Parolni tiklash uchun 'email' kiritishingiz shart"
  }),
  otp: Joi.string().length(6).required().messages({
    "string.empty": "OTP kodini kiritish shart",
    "string.length": "Tasdiqlash kodi (OTP) 6 ta raqamdan iborat bo'lishi kerak",
    "any.required": "Parolni tiklash uchun 'otp' (kod) kiritishingiz shart"
  }),
  newPassword: Joi.string()
    .trim()
    .min(8)
    .max(100)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])"))
    .required()
    .messages({
      "string.empty": "Yangi parol maydoni bo'sh bo'lishi mumkin emas",
      "string.min": "Yangi parol kamida 8 ta belgidan iborat bo'lishi shart",
      "string.pattern.base": "Yangi parolda kamida bitta katta harf, bitta kichik harf va bitta raqam bo'lishi shart",
      "any.required": "Parolni tiklash uchun 'newPassword' (yangi parol) kiritishingiz shart"
    }),
  confirmPassword: Joi.any().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Tasdiqlash paroli yangi parol bilan mos kelmadi",
    "any.required": "Parolni tasdiqlash uchun 'confirmPassword' kiritishingiz shart"
  }),
});

const resendOtpValidator = Joi.object({
  email: Joi.string()
  .email()
  .trim()
  .lowercase()
  .required()
  .messages({
    "string.email": "noto'g'ri email formati",
    "any.required": "email kiritilihi shart"
  })
})

module.exports = {
  registerValidator,
  verifyValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  resendOtpValidator
};