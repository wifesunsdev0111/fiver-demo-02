const childProcess = require('child_process');
const winston = require('winston');
const {format} = require('logform');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'logs/chrome.log',
    }),
    new winston.transports.Console(),
  ],
  format: format.simple(),
});

// opens the url in the default browser
// open('http://localhost:4000', {app: 'chrome-portable/chrome.exe'});
childProcess.exec(`start chrome-portable/chrome.exe --kiosk http://localhost:4000 --autoplay-policy=no-user-gesture-required --disable-pinch --enable-logging=stderr`, (error, stdout, stderr) => {
  logger.log({
    level: 'error',
    message: stderr,
  });
});
