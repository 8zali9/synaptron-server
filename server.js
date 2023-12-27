const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 1231;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.listen(port, () => {
  console.log("Server running on port:", port);
});
