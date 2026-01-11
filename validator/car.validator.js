const Joi = require("joi");

const carValidator = Joi.object({
  brand: Joi.string().trim().required().messages({
    "string.empty": "Marka (brand) nomini yozish shart",
    "any.required": "Marka (brand) maydoni majburiy",
  }),
  name: Joi.string().trim().min(2).max(50).required(),
  tint: Joi.string().valid("bor", "yo'q").required(),
  engine: Joi.number().precision(1).positive().required(),
  year: Joi.number().integer().min(1800).max(new Date().getFullYear()).required(),
  color: Joi.string().trim().required(),
  distance: Joi.number().min(0).required(),
  gearbook: Joi.string().trim().required(),
  price: Joi.number().positive().required(),
  description: Joi.string().min(3).max(1000).allow("", null),

  interiorImage360: Joi.any().optional(),
  exteriorImage360: Joi.any().optional(),
  carTypeImage: Joi.any().optional(),
});

module.exports = { carValidator };