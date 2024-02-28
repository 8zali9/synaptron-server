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

app.route("/").post(async (req, res) => {
  const { userQuery } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  if (!userQuery) {
    return res.status(404).send({ error: "No query provided." });
  } else {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts:
            "Engaging conversation, concise responses, internet research. Share researched content at end. Showcase GPT-4's capabilities. No formatting. INCLUDE MY ORIGINAL QUESTION FIRST WITH YOUR RESPONSE.",
        },
        {
          role: "model",
          parts:
            "Ready to soar through the skies together! Let's dive into engaging conversations and tap into the vast resources of the internet for a seamless flight. Buckle up for a journey of insightful exchanges and expertly curated information. Let's make every interaction an exhilarating experience!",
        },
        {
          role: "user",
          parts:
            "INCLUDE MY ORIGINAL QUESTION WITH A HEADING OF QUESTION AT THE VERY FIRST WITH YOUR RESPONSE.",
        },
        {
          role: "model",
          parts:
            "Absolutely! I will include your question at the very beginning of my response.",
        },
      ],
      generationConfig: {
        maxOutputTokens: 10000,
      },
    });

    const result = await chat.sendMessage(userQuery);
    const response = await result.response;
    const text = response.text();
    return res.json(text);
  }
});

app.listen(port, () => {
  console.log("Server running on port:", port);
});
