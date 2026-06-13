const CACHE_MS = 24 * 60 * 60 * 1000;
const cache = new Map();

export default async function handler(req) {
  const url = new URL(req.url);
  const home = url.searchParams.get("home");
  const away = url.searchParams.get("away");
  if (!home || !away) return jsonResponse({ error: "missing teams" }, 400);

  const key = `${home}|${away}`.toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.fetchedAt < CACHE_MS) {
    return jsonResponse(cached.data);
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return jsonResponse({ error: "missing API key" }, 500);

  const query = `${home} vs ${away} highlights FIFA World Cup 2026`;
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&order=relevance&maxResults=1&q=${encodeURIComponent(query)}&key=${apiKey}`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    const item = data.items?.[0];
    const result = item ? { videoId: item.id.videoId, title: item.snippet.title } : { videoId: null };
    cache.set(key, { data: result, fetchedAt: Date.now() });
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err.message }, 502);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
