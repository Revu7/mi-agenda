export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const prompt = req.body?.prompt;
    console.log('Prompt recibido:', prompt);
    console.log('API Key existe:', !!process.env.OPENROUTER_KEY);
    
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
        model: 'meta-llama/llama-3.2-3b-instruct:free',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    console.log('Respuesta OpenRouter:', JSON.stringify(data));

    const text = data.choices?.[0]?.message?.content;
    if (!text) return res.status(500).json({ error: 'Sin respuesta', data });

    res.status(200).json({ candidates: [{ content: { parts: [{ text }] } }] });
  } catch (e) {
    console.log('Error:', e.message);
    res.status(500).json({ error: e.message });
  }
}
