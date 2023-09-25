const express = require("express");
require("colors");
require("dotenv").config();
const { Pool, Client } = require("pg");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());

const PORT = 8080;

const pool = new Pool();

app.get("/", (req, res) => {
  res.send("welcome");
});

app.get("/fighters", (req, res) => {
  pool
    .query("SELECT * FROM fighters;")
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500).send("Smth went very wrong"));
});

app.get("/fighters/:id", (req, res) => {
  const { id } = req.params;
  pool
    .query("SELECT * FROM fighters WHERE id = $1;", [id])
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500).json(e));
});

app.post("/fighters", (req, res) => {
  const { first_name, last_name, country_id, style } = req.body;

  pool
    .query(
      "INSERT INTO fighters (first_name, last_name, country_id, style) VALUES ($1, $2, $3, $4) RETURNING *",
      [first_name, last_name, country_id, style]
    )
    .then((data) => res.json(data.rows))
    .catch((e) => res.sendStatus(500).send("smth is wrong"));
});

app.get("/time", (req, res) => {
  pool.query("SELECT NOW()", (err, response) => {
    if (err) return res.status(500).send("failedddd");
    res.send(response.rows[0]);
    // pool.end();
  });
});

app.listen(PORT, () => {
  console.log(`connected to ${PORT}`.bgGreen);
});
