export default async function handler(req, res) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const response = await fetch(
    `${url}/rest/v1/scores?select=*&order=wave.desc&limit=10`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`
      }
    }
  );

  if (!response.ok) {
    return res.status(500).json({ ok: false });
  }

  const scores = await response.json();

  res.status(200).json(scores);
}
