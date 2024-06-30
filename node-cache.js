const axios = require("axios");
const express = require("express");
const NodeCache = require("node-cache");
const app = express();
const MOCK_API = "https://jsonplaceholder.typicode.com/users/";

const myCache = new NodeCache();

app.get("/users", (req, res) => {
  const email = req.query.email;

  try {
    axios.get(`${MOCK_API}?email=${email}`).then(function (response) {
      const users = response.data;

      console.log("User successfully retrieved from the API");

      res.status(200).send(users);
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.get("/node-cache-users", async (req, res) => {
  const email = req.query.email;
  try {
    const emailExit = await myCache.get("email");
    if (emailExit) {
      res.status(200).send(JSON.parse(emailExit));
    } else {
      axios.get(`${MOCK_API}?email=${email}`).then(function (response) {
        const users = response.data;
        myCache.set("email", JSON.stringify(users));
        console.log("User successfully retrieved from the API");
        res.status(200).send(users);
      });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log(`Server started at port: 3000`);
});
