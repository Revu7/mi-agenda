export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { to, taskTitle, taskDate, taskTime } = req.body;
    if (!to || !taskTitle) return res.status(400).json({ error: 'Faltan datos' });

    const timeText = taskTime ? ` a las ${taskTime}` : '';

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_KEY
      },
      body: JSON.stringify({
        sender: { name: 'NoSeMeOlvida', email: 'recordatorio@nosemeolvida.es' },
        to: [{ email: to }],
        subject: `⏰ Recordatorio: ${taskTitle}`,
        htmlContent: `
          <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background: #f5f0e8;">
            <h1 style="font-size: 28px; color: #1a1410; margin-bottom: 8px;">NoSeMe<em style="color: #c4572a;">Olvida</em></h1>
            <p style="color: #888; font-size: 13px; margin-bottom: 32px;">Recordatorio personal</p>
            <div style="background: white; border-radius: 12px; padding: 24px; border-left: 4px solid #c4572a;">
              <p style="color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Tienes pendiente</p>
              <h2 style="color: #1a1410; font-size: 20px; margin-bottom: 16px;">${taskTitle}</h2>
              <p style="color: #c4572a; font-weight: bold;">📅 ${taskDate}${timeText}</p>
            </div>
            <p style="color: #aaa; font-size: 12px; margin-top: 32px; text-align: center;">Enviado desde nosemeolvida.es</p>
          </div>
        `
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
