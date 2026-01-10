
const CustomErrorHandler = require("../utils/custom-error-handler");
const fs = require("fs");
const { carValidator } = require("../validator/car.validator");

module.exports = (req, res, next) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }

  const { error } = carValidator.validate(req.body);

  if (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    return next(CustomErrorHandler.BadRequest(error.message));
  }

  next();
};
