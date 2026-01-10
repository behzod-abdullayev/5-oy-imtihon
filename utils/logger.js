const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf, simple } = format;
require("winston-mongodb")

const logger = createLogger({
  level: 'debug',
   format: format.combine(
  format.simple()
),
   transports: [
    new transports.Console(),
    new transports.File({filename: "log/universal.log"}),
    new transports.MongoDB({db: process.env.MONGO_URI})
   ]
});
module.exports = logger;
