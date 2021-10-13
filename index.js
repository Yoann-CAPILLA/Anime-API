require("dotenv").config();

const shell = require("shelljs");
const cron = require("node-cron");

cron.schedule("0 0 * * MON", () => {
  shell.exec("./data/script.sh");
});

const port = process.env.PORT || 5555;

const express = require("express");
const cors = require("cors");
const sanitize = require("./api/services/sanitizer");

const app = express();
const router = require("./api/router");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(sanitize);

app.use("/v1", router);

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
