require("dotenv").config();

const forever = require("forever-monitor");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const { exec } = require("node:child_process");

exec("taskkill /f /im explorer.exe");

console.log(`Launching Server`);
const server = forever.start("server.js", {});

let delay = 1000;

if (process.env.DELAY == "true") {
  delay = 10000;
}

// let chrome;
// setTimeout(function () {
//   console.log(`Launching Chrome`);
//   chrome = forever.start("chrome.js", {});
// }, delay);

// let nvda;
// if (process.env.AV != "true") {
//   console.log(`Launching NVDA`);
//   nvda = forever.start("nvda.js", {});
// }

const exit = () => {
  exec("start explorer.exe");

  server.stop();
  // chrome.stop();

  if (nvda != undefined) {
    nvda.stop();
  }

  // exec("taskkill /f /im chrome.exe");
  exec("taskkill /f /im nvda.exe");

  setTimeout(function () {
    process.exit();
  }, 100);
};

setTimeout(function () {
  rl.question("Press q then enter to quit\n", function (input) {
    if (input == "q") {
      exit();
    }
  });
}, 100 + delay);

process.on("SIGINT", exit);
