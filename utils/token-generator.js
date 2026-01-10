const jwt = require("jsonwebtoken");
const CustomErrorHandler = require("./custom-error-handler");

const tokenGenerator = (payload) => {
    try {
        return jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
    } catch (error) {
        throw CustomErrorHandler.BadRequest("Token generatsiya qilishda xato");
    }
};

const refreshToken = (payload) => {
    try {
        return jwt.sign(payload, process.env.REFRESH_KEY, { expiresIn: "15d" });
    } catch (error) {
        throw CustomErrorHandler.BadRequest("Refresh token generatsiya qilishda xato");
    }
};

module.exports = { tokenGenerator, refreshToken };