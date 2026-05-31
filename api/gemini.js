export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { prompt, imageBase64 } = req.body;
    if (!prompt) return res.status(400).json({ error: 'No prompt' });

    const messages = imageBase64
      ? [{
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
            { type: 'text', text: prompt }
          ]
        }]
      : [{ role: 'user', content: prompt }];

    const model = imageBase64
      ? 'meta-llama/llama-3.2-11b-vision-instruct:free'
      : 'openrouter/auto';

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://nosemeolvida.es',
        'X-Title': 'NoSeMeOlvida'
      },
      body: JSON.stringify({ model, messages })
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response', data });
    res.status(200).json({ candidates: [{ content: { parts: [{ text }] } }] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
