export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const body = req.body;

  const response = await fetch(`${url}/rest/v1/scores`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      name: String(body.name || "Player").slice(0, 24),
      wave: Number(body.wave || 0),
      lives: Number(body.lives || 0),
      gold: Number(body.gold || 0),
      towers: Number(body.towers || 0)
    })
  });

  if (!response.ok) {
    return res.status(500).json({ ok: false });
  }

  res.status(200).json({ ok: true });
}
