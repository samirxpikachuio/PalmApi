const express = require('express');
const { TextServiceClient } = require("@google-ai/generativelanguage").v1beta2;
const { GoogleAuth } = require("google-auth-library");

const app = express();
const PORT = 3000; 
const MODEL_NAME = "models/text-bison-001";
const API_KEY = ""; //add your api key read api.md for getting apikey 
const client = new TextServiceClient({
  authClient: new GoogleAuth().fromAPIKey(API_KEY),
});

app.get('/palm', async (req, res) => {
  const prompt = req.query.text;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing text parameter in the query.' });
  }

  try {
    const result = await client.generateText({
      model: MODEL_NAME,
      prompt: {
        text: prompt,
      },
    });

    
    const output = result[0]?.candidates[0]?.output;
    if (output) {
      res.json({ output });
    } else {
      res.status(500).json({ error: 'No output found in the response.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while generating text.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});