// api/generate.js
// Bu fonksiyon Vercel sunucusunda çalışır. GEMINI_API_KEY tarayıcıya asla gönderilmez.

const SYSTEM_INSTRUCTION = `Sen bir retro tarzı, tek dosyalık, bağımsız mini oyunlar üreten bir motorsun.
Kullanıcının fikrine göre HTML5 canvas tabanlı, hem dokunmatik hem klavye ile oynanabilen,
TAMAMEN kendi içinde çalışan (harici dosya, font, kütüphane veya ağ isteği YOK) kısa ve
verimli kodlu bir tarayıcı oyunu yaz. Oyun arka planı siyah, öğeler beyaz/gri tonlarında olsun
(monokrom, galaksi temasına uygun). Oyun bitince ya da kaybedilince kısa bir mesaj ve yeniden
başlatma imkânı olsun.
Yanıtının İLK satırı tam olarak '<!--TITLE: Kısa Oyun Adı-->' formatında olsun, hemen ardından
'<!DOCTYPE html>' ile başlayan tam ve çalışan HTML belgesi gelsin. Başka HİÇBİR açıklama,
markdown ya da \`\`\` işareti ekleme.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Sadece POST kabul edilir' });
    return;
  }

  const { idea } = req.body || {};
  if (!idea || typeof idea !== 'string' || !idea.trim()) {
    res.status(400).json({ error: 'Bir oyun fikri gerekli' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Sunucuda GEMINI_API_KEY tanımlı değil. Vercel > Settings > Environment Variables kısmından ekle.' });
    return;
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ role: 'user', parts: [{ text: 'Oyun fikri: ' + idea.slice(0, 300) }] }],
          generationConfig: { maxOutputTokens: 2048, temperature: 0.9 }
        })
      }
    );

    const data = await geminiRes.json();

    if (data.error) {
      res.status(502).json({ error: data.error.message || 'Gemini bir hata döndürdü' });
      return;
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    let text = parts.map(p => p.text || '').join('\n').trim();
    text = text.replace(/^```(html)?/i, '').replace(/```$/, '').trim();

    const titleMatch = text.match(/^<!--\s*TITLE:\s*(.+?)-->/i);
    const title = titleMatch ? titleMatch[1].trim() : idea.slice(0, 40);
    const htmlStart = text.search(/<!doctype html/i);

    if (htmlStart < 0) {
      res.status(502).json({ error: 'Yapay zekâ geçerli bir oyun döndürmedi. Fikri biraz daha netleştirip tekrar dene.' });
      return;
    }

    const html = text.slice(htmlStart);
    res.status(200).json({ title, html });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Beklenmeyen bir hata oluştu' });
  }
}
