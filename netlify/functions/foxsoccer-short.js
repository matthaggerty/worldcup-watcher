const CHANNEL_ID = "UCwNqHDsnBCKT-olwJwIFyfg"; // FOX Sports (@Foxsoccer)
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const MAX_SHORTS = 10;

let cache = { data: null, fetchedAt: 0 };
const CACHE_MS = 5 * 60 * 1000;

export default async function handler() {
  const now = Date.now();
  if (cache.data && now - cache.fetchedAt < CACHE_MS) {
    return jsonResponse(cache.data);
  }

  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) throw new Error(`feed responded ${res.status}`);

    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);

    const shorts = [];
    for (const entry of entries) {
      const linkMatch = entry.match(/<link rel="alternate" href="[^"]*\/shorts\/([^"]+)"\s*\/>/);
      if (!linkMatch) continue;

      const titleMatch = entry.match(/<title>(.*?)<\/title>/s);
      const publishedMatch = entry.match(/<published>(.*?)<\/published>/);

      shorts.push({
        videoId: linkMatch[1],
        title: decodeXmlEntities(titleMatch?.[1] || ""),
        publishedAt: publishedMatch?.[1] || null,
        url: `https://www.youtube.com/shorts/${linkMatch[1]}`,
      });

      if (shorts.length >= MAX_SHORTS) break;
    }

    if (!shorts.length) throw new Error("no shorts found");

    const data = { shorts };
    cache = { data, fetchedAt: now };
    return jsonResponse(data);
  } catch (err) {
    if (cache.data) return jsonResponse(cache.data);
    return jsonResponse({ error: err.message }, 502);
  }
}

function decodeXmlEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=900",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
