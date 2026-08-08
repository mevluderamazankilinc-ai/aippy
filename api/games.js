// api/games.js
// GET  -> tüm oyunların listesini döner (html olmadan, hafif)
// POST -> yeni bir oyunu depoya kaydeder

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const index = (await kv.get('games-index')) || [];
      res.status(200).json(index);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  if (req.method === 'POST') {
    const { title, html, creator } = req.body || {};
    if (!title || !html) {
      res.status(400).json({ error: 'title ve html gerekli' });
      return;
    }
    try {
      const id = 'g_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      await kv.set('game-html:' + id, html);

      const index = (await kv.get('games-index')) || [];
      const entry = {
        id,
        title: String(title).slice(0, 80),
        creator: creator ? String(creator).slice(0, 40) : 'anonim',
        likes: 0,
        createdAt: Date.now()
      };
      index.unshift(entry);
      await kv.set('games-index', index);

      res.status(200).json(entry);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}
