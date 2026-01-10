const categoryValidator = require("../validator/category.validator");
const fs = require("fs");

module.exports = (req, res, next) => {
    try {
        if (req.body.data) {
            req.body = JSON.parse(req.body.data);
        }

        const { error } = categoryValidator.validate(req.body);

        if (error) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ success: false, message: error.message });
        }
        next();
    } catch (err) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ success: false, message: "JSON format xato yozilgan" });
    }
};