const logger = require("../utils/logger");
const CustomErrorHandler = require("../utils/custom-error-handler");

const errorHandler = (err, req, res, next) => {

    let status = err.status || 500;
    let message = err.message || "Internal Server Error";
    let errors = err.errors || [];


    logger.error({
        message: message,
        status: status,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        stack: err.stack,
    });


    if (err instanceof CustomErrorHandler) {
        return res.status(status).json({
            success: false,
            message: message,
            errors: errors,
        });
    }


    return res.status(status).json({
        success: false,
        message: message,

        ...(process.env.NODE_ENV !== "production" && { stack: err.stack })
    });
};

module.exports = errorHandler;