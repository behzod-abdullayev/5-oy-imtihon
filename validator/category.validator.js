const joi = require("joi");

const categoryValidator = joi.object({
  name: joi.string().trim().min(2).max(50).required().messages({
    "string.empty": "Kategoriya nomi bo'sh bo'lishi mumkin emas",
    "string.min": "Kategoriya nomi kamida 2 ta harf bo'lishi kerak",
    "any.required": "Kategoriya nomini kiritish shart",
  }),
  foundedYear: joi.number()
    .integer()
    .min(1700)
    .max(new Date().getFullYear())
    .messages({
      "number.max": "Tashkil etilgan yil hozirgi yildan katta bo'lishi mumkin emas"
    }),
  founder: joi.string().trim().required().messages({
    "any.required": "Asoschi ismini kiritish shart"
  }),
  description: joi.string().min(3).max(200).trim()
});

module.exports = categoryValidator;