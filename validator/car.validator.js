const Joi = require("joi");
const joi = require("joi");

const carValidator = joi.object({
  brand: joi.string().trim().required().messages({
    "string.empty": "Markani tanlash shart",
    "any.required": "Marka maydoni bo'sh bo'lishi mumkin emas",
  }),
  name: Joi.string().trim().min(2).max(50).required().messages({
    "any.required": "Mashina nomi majburiy",
    "string.min": "Mashina nomi kamida 2 ta belgidan iborat bo'lishi kerak"
  }),
  tint: joi.string().valid("bor", "yo'q").required().messages({
    "any.only": "Tanirovkaga faqat 'bor' yoki 'yo'q' kiritish mumkin",
  }),
  engine: joi.number().precision(1).positive().required().messages({
    "number.base": "Motor hajmi raqam bo'lishi kerak",
    "number.positive": "Motor hajmi musbat bo'lishi shart",
  }),
  year: joi
    .number()
    .integer()
    .min(1800)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.min": "Yil 1850 dan kichik bo'lmasligi kerak",
      "number.max": "Yil hozirgi yildan katta bo'lmasligi kerak",
    }),
  color: joi.string().trim().required().messages({
    "string.empty": "Rangni kiriting",
  }),
  distance: joi.number().min(0).required().messages({
    "number.min": "Mashina yurish masofasi kamida 0 km bo'lishi kerak",
  }),
  gearbook: joi.string().trim().required().messages({
    "string.empty": "Uzatmalar qutisini kiriting",
  }),
  cost: joi.number().positive().required().messages({
    "number.positive": "Mashina narxi musbat bo'lishi kerak",
  }),
  description: joi.string().min(3).max(1000).allow("", null).messages({
    "string.min": "Tavsif kamida 3 ta belgidan iborat bo'lsin",
  }),
  interiorImage360: joi
    .string()
    .required()
    .trim()
    .messages({ "any.required": "Ichki rasm linki shart" }),
  exteriorImage360: joi
    .string()
    .required()
    .trim()
    .messages({ "any.required": "Tashqi rasm linki shart" }),
  carTypeImage: joi
    .string()
    .required()
    .trim()
    .messages({ "any.required": "Model rasm linki shart" }),
});

module.exports = {
  carValidator
};
