const Joi = require("joi");

const carValidator = Joi.object({
  category: Joi.string().hex().length(24).required().messages({
    "string.length": "Kategoriya ID-si noto'g'ri formatda",
    "any.required": "Kategoriyani (Brendni) tanlash majburiy",
  }),
  brand: Joi.string().trim().required().messages({
    "string.empty": "Markani yozish shart",
  }),
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Mashina nomi kamida 2 ta harf bo'lsin",
  }),
  tint: Joi.string().valid("bor", "yo'q").required(),
  engine: Joi.number().precision(1).positive().required(),
  year: Joi.number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .required(),
  color: Joi.string().trim().required(),
  distance: Joi.number().min(0).required(),
  gearbook: Joi.string().trim().required(),
  cost: Joi.number().positive().required(),
  description: Joi.string().min(3).max(1000).allow("", null),

  interiorImage360: Joi.string().required().trim(),
  exteriorImage360: Joi.string().required().trim(),
  carTypeImage: Joi.string().required().trim(),
});

module.exports = { carValidator };
