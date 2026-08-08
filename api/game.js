// api/game.js?id=xxx
// Tek bir oyunun tam HTML içeriğini döner (iframe içine yüklemek için)

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { id } = req.query;
  if (!id) {
    res.status(400).json({ error: 'id gerekli' });
    return;
  }
  try {
    const html = await kv.get('game-html:' + id);
    if (!html) {
      res.status(404).json({ error: 'Oyun bulunamadı' });
      return;
    }
    res.status(200).json({ html });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
