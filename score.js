const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};

    const name = String(body.name || 'Player')
      .replace(/[^\\w äöüÄÖÜß.-]/g, '')
      .slice(0, 24) || 'Player';

    const wave = Math.floor(Number(body.wave || 0));
    const lives = Math.floor(Number(body.lives || 0));
    const gold = Math.floor(Number(body.gold || 0));
    const towers = Math.floor(Number(body.towers || 0));

    if (wave < 1 || wave > 999) {
      return res.status(400).json({ ok: false, error: 'invalid_wave' });
    }

    if (lives < 0 || lives > 500 || gold < 0 || gold > 999999 || towers < 0 || towers > 300) {
      return res.status(400).json({ ok: false, error: 'not_plausible' });
    }

    const { error } = await supabase
      .from('scores')
      .insert([{ name, wave, lives, gold, towers }]);

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: 'server_error'
    });
  }
};
