const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 1231;
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEM_API_KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.route("/").get(async (req, res) => {
  const { prompt } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  if (!prompt) {
    return res.status(404).send({ error: "No prompt provided." });
  } else {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return res.send(text);
  }
});

app.listen(port, () => {
  console.log("Server running on port:", port);
});
