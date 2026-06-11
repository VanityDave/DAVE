const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const { data, error } = await supabase
      .from('scores')
      .select('name,wave,created_at')
      .order('wave', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(10);

    if (error) throw error;

    return res.status(200).json({
      ok: true,
      scores: data || []
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: 'server_error'
    });
  }
};
