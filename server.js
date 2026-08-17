const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());

// ⚠️ Replace this with your actual DeepL Free API Key
const DEEPL_API_KEY = "8f2065e6-f52b-4561-af7d-4f4cdedbe203:fx";

app.post('/api/translate', async (req, res) => {
  const { text, sourceLang, targetLang } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  const payload = {
    text: [text],
    target_lang: targetLang.toUpperCase()
  };

  if (sourceLang && sourceLang !== 'autodetect') {
    payload.source_lang = sourceLang.toUpperCase();
  }

  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (response.ok && data.translations && data.translations.length > 0) {
      res.json({ translatedText: data.translations[0].text });
    } else {
      res.status(response.status).json({ error: data.message || "DeepL API translation failed." });
    }
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error connecting to DeepL." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Node.js backend server running on http://localhost:${PORT}`);
});