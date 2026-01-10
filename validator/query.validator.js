const Joi = require("joi");

const queryValidator = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Sahifa raqami son bo'lishi kerak"
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.max": "Bitta sahifada ko'pi bilan 100 ta ma'lumot bo'lishi mumkin"
  }),
  search: Joi.string().trim().allow('', null)
});

module.exports = { queryValidator };