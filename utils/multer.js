const multer = require("multer");
const { extname } = require("path");

const storage = multer.diskStorage({
    destination: "./uploads",
    filename: (req, file, cb) => {
        const uniqueName = file.fieldname + "-" + Date.now();
        const ext = extname(file.originalname);
        cb(null, `${uniqueName}${ext}`);
    }
});

const uploads = multer({ storage });
module.exports = uploads;