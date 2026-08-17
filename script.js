// Get DOM elements
const sourceText = document.getElementById('sourceText');
const targetText = document.getElementById('targetText');
const sourceLang = document.getElementById('sourceLang');
const targetLang = document.getElementById('targetLang');
const translateBtn = document.getElementById('translateBtn');
const swapBtn = document.getElementById('swapBtn');
const copyBtn = document.getElementById('copyBtn');
const speakSourceBtn = document.getElementById('speakSourceBtn');
const speakTargetBtn = document.getElementById('speakTargetBtn');

// Function to call local Node.js server
async function translateText() {
  const text = sourceText.value.trim();
  
  if (!text) {
    targetText.value = '';
    return;
  }

  targetText.value = 'Translating...';

  try {
    const response = await fetch('http://localhost:8080/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        sourceLang: sourceLang.value,
        targetLang: targetLang.value
      })
    });

    const data = await response.json();

    if (response.ok && data.translatedText) {
      targetText.value = data.translatedText;
    } else {
      targetText.value = `Error: ${data.error || 'Translation failed'}`;
    }
  } catch (error) {
    console.error('Fetch Error:', error);
    targetText.value = 'Error: Could not reach server. Make sure node server.js is running!';
  }
}

// Event Listeners
translateBtn.addEventListener('click', translateText);

// Swap button functionality
swapBtn.addEventListener('click', () => {
  if (sourceLang.value === 'autodetect') return;

  const tempLang = sourceLang.value;
  sourceLang.value = targetLang.value;
  targetLang.value = tempLang;

  const tempText = sourceText.value;
  sourceText.value = targetText.value;
  targetText.value = tempText;
});

// Copy button functionality
copyBtn.addEventListener('click', () => {
  if (targetText.value) {
    navigator.clipboard.writeText(targetText.value);
  }
});

// Text-to-speech functionality
function speak(text, lang) {
  if (!text) return;
  const utterance = new SpeechSynthesisUtterance(text);
  if (lang && lang !== 'autodetect') {
    utterance.lang = lang;
  }
  window.speechSynthesis.speak(utterance);
}

speakSourceBtn.addEventListener('click', () => speak(sourceText.value, sourceLang.value));
speakTargetBtn.addEventListener('click', () => speak(targetText.value, targetLang.value));