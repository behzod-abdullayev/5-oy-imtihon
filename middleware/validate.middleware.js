const CustomErrorHandler = require("../utils/custom-error-handler");

const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      const message = error.details[0].message;
      return next(CustomErrorHandler.BadRequest(message));
    }

    req.body = value;
    next();
  };
};

module.exports = validate;
