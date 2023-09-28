const port = 4000;
const cors = require("cors");
const path = require("path");
const express = require("express");
const winston = require("winston");
const expressWinston = require("express-winston");
const { format } = require("logform");
const fs = require("fs");
const glob = require("glob");
const e = require("express");

const server = e();

const globStr = "/static/js/main.*.chunk.js";

server.get(globStr, async function (req, res) {
  glob("build" + globStr, function (err, globFile) {
    const ogPromise = new Promise((resolve, reject) => {
      fs.readFile(globFile[0], function (err, data) {
        resolve(data);
      });
    });

    const dataPromise = new Promise((resolve, reject) => {
      fs.readFile("./build/data.json", function (err, data) {
        resolve(data);
      });
    });

    Promise.all([ogPromise, dataPromise]).then((responses) => {
      let out = responses[0].toString();

      if (responses[1] != undefined) {
        const data = responses[1].toString();

        out = out.replace("__NASM_JSON__", data);
      }

      res.send(out);
    });
  });
});

// sending restart configs back to restart script
server.get("/restart_config", (req, res) => {
  fs.readFile("restartScriptConfig.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    const config = JSON.parse(data);
    const time = config.time;
    const isOn = config.isOn;

    const response = { time, isOn };
    console.log(response);
    res.json(response);
  });
});

// add middlewares
server.use(express.static(path.join(__dirname, "build")));
server.get("/*", function (req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, "build/") });
});
const logger = winston.createLogger({
  level: "error",
  transports: [
    new winston.transports.File({
      filename: "logs/server.log",
      level: "error",
    }),
    new winston.transports.Console(),
  ],
  msg: (req, res) => `Request body: ${JSON.stringify(req.body)}`,
  format: format.simple(),
});

// Google Analytics writing/reading
const GAFile = "./build/googleAnalytics.analytics";
server.use(require("express").json());

server.post("/session", function (req, res) {
  const receivedRawdata = req.body;

  if (fs.existsSync(GAFile)) {
    try {
      fs.appendFileSync(GAFile, JSON.stringify(receivedRawdata) + "\n");
      res.status(200).send({ message: "Data appended to file successfully" });
    } catch (err) {
      res.status(500).send({ message: "Error appending to file", error: err });
    }
  } else {
    fs.writeFileSync(GAFile, JSON.stringify(receivedRawdata) + "\n");
    res
      .status(200)
      .send({ message: "File created and data appended successfully" });
  }
});

// Error logging
server.post("/log-error", function (req, res) {
  const logReceived = JSON.stringify(req.body);
  logger.error(logReceived);
  res.send("Error logged in server.log file");
});

server.use(
  cors({
    origin: true,
    credentials: true,
    preflightContinue: false,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  })
);

server.options("*", cors());

server.use(expressWinston.logger({ winstonInstance: logger }));

server.listen(port, () => {
  console.log(`json server is running on port ${port}`);
});
