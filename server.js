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
  const { msg } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  if (!msg) {
    return res.status(404).send({ error: "No msg provided." });
  } else {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts:
            "Craft an engaging conversation as a co-pilot, offering concise and insightful responses while also utilizing your ability to search the internet for relevant information. Later, provide the researched content under a separate heading. Elevate the prompt to captivate the capabilities of gemeini, showcasing its capacity to generate top-tier responses..",
        },
        {
          role: "model",
          parts:
            "Ready to soar through the skies together! Let's dive into engaging conversations and tap into the vast resources of the internet for a seamless flight. Buckle up for a journey of insightful exchanges and expertly curated information. Let's make every interaction an exhilarating experience!",
        },
      ],
      generationConfig: {
        maxOutputTokens: 10000,
      },
    });

    console.log(chat.getHistory());

    const result = await chat.sendMessage(msg);
    const response = await result.response;
    const text = response.text();
    return res.send(text);
  }
});

app.listen(port, () => {
  console.log("Server running on port:", port);
});
