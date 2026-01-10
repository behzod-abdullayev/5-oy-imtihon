const Joi = require("joi");

const mongoIdValidator = Joi.object({
  id: Joi.string().length(24).hex().required().messages({
    "string.length": "ID formati noto'g'ri (24 ta belgi bo'lishi kerak)",
    "string.hex": "ID faqat 16-lik (hex) formatda bo'lishi kerak",
    "any.required": "ID yuborilishi shart"
  })
});

module.exports = { mongoIdValidator };