const nodemailer = require("nodemailer");
const CustomErrorHandler = require("./custom-error-handler");
const sendMessage = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "behzod2366@gmail.com",
        pass: process.env.APP_KEY,
      },
    });
    return await transporter.sendMail({
      from: "bekzod2366@gamil.com",
      to: email,
      subject: "verification code",
      text: "tasdiqlash uchun",
      html: `<b style="font-size: 30px;"><b style="color: blue;">${code}</b></b>`,
    });
  } catch (error) {
    throw CustomErrorHandler.BadRequest(error.message);
  }
};
module.exports = sendMessage