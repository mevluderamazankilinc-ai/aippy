// api/like.js
// POST { id, delta: 1 | -1 } -> beğeni sayısını günceller

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const { id, delta } = req.body || {};
  if (!id) {
    res.status(400).json({ error: 'id gerekli' });
    return;
  }
  try {
    const index = (await kv.get('games-index')) || [];
    const entry = index.find(g => g.id === id);
    if (!entry) {
      res.status(404).json({ error: 'Oyun bulunamadı' });
      return;
    }
    entry.likes = Math.max(0, (entry.likes || 0) + (delta === -1 ? -1 : 1));
    await kv.set('games-index', index);
    res.status(200).json({ likes: entry.likes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
