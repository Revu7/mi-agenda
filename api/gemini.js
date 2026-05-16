export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const prompt = req.body?.prompt;
    if (!prompt) return res.status(400).json({ error: 'No prompt' });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://nosemeolvida.es',
        'X-Title': 'NoSeMeOlvida'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(500).json({ error: JSON.stringify(data) });
    }

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'No response from AI' });

    res.status(200).json({ candidates: [{ content: { parts: [{ text }] } }] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
