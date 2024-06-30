const axios = require("axios");
const express = require("express");
const redis = require("redis");
const app = express();
const MOCK_API = "https://jsonplaceholder.typicode.com/users/";
const redisClient = redis.createClient({ host: "localhost", port: 6379 });
redisClient.connect();
redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", () => {
  console.log("Not connect to Redis");
});

// trường hợp truy vấn dữ liệu qua email thông qua database

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
// trường hợp truy vấn dữ liệu qua email thông qua cache

app.get("/cached-users", async (req, res) => {
  const email = req.query.email;
  try {
    const emailExit = await redisClient.get("email");
    if (emailExit) {
      res.status(200).send(JSON.parse(emailExit));
    } else {
      axios.get(`${MOCK_API}?email=${email}`).then(function (response) {
        const users = response.data;
        redisClient.set("email", JSON.stringify(users));
        console.log("User successfully retrieved from the API");
        res.status(200).send(users);
      });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at port: ${PORT}`);
});
