const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("../utils/custom-error-handler");

const isSelf = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(CustomErrorHandler.UnAuthorized("Token topilmadi"));
    }

    const token = authHeader.split(" ")[1];


    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return next(CustomErrorHandler.UnAuthorized("Token yaroqsiz yoki muddati o'tgan"));
      }
      req.user = decoded; 
      next();
    });
  } catch (error) {
    next(error);
  }
};

module.exports = isSelf;