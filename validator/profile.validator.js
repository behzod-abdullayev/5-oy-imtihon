const Joi = require("joi");

const changePasswordValidator = Joi.object({
  currentPassword: Joi.string().trim().required().min(8).max(100).messages({
    "string.min": "parol eng kami 8 ta belgidan iborat",
    "any.required": "Hozirgi parolingizni kiritish shart",
  }),
  newPassword: Joi.string()
    .trim()
    .min(8)
    .max(100)
    .pattern(new RegExp(`^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)`))
    .required()
    .messages({
      "string.min": "Yangi parol kamida 8 ta belgidan iborat bo'lishi kerak",
      "string.pattern.base":
        "Yangi parolda kamida bitta katta, bitta kichik va bitta raqam bo'lishi kerak",
    }),
  confirmPassword: Joi.string()
    .required()
    .valid(Joi.ref(`newPassword`))
    .messages({
      "any.only": "Tasdiqlash paroli yangi parol bilan mos kelmadi",
      "any.required": "Parolni tasdiqlash shart",
    }),
});

const updateProfileValidator = Joi.object({
  username: Joi.string().trim().min(3).max(30).alphanum().optional(),
  email: Joi.string().trim().lowercase().email().optional(),
  password: Joi.string()
    .when("email", {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional(),
    })
    .messages({
      "any.required": "parolingizni kiritishingiz shart",
    }),
  image: Joi.string().optional().allow(null, ""), 
});

module.exports = {
  changePasswordValidator,
  updateProfileValidator,
};