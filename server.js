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
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = "Prove logically by contardiction, that 2+2=4.";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  res.send(text);
});

app.listen(port, () => {
  console.log("Server running on port:", port);
});
