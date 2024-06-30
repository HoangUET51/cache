const axios = require("axios");
const express = require("express");
const cache = require("memory-cache");
const app = express();
const MOCK_API = "https://jsonplaceholder.typicode.com/users/";

//create new instance
const newCache = new cache.Cache();

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

app.get("/memory-cache-users", async (req, res) => {
  const email = req.query.email;
  try {
    const emailExit = await cache.get("email");
    if (emailExit) {
      res.status(200).send(JSON.parse(emailExit));
    } else {
      axios.get(`${MOCK_API}?email=${email}`).then(function (response) {
        const users = response.data;
        cache.put("email", JSON.stringify(users));
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
