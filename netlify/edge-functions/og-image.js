const CHANNEL_ID = "UCwNqHDsnBCKT-olwJwIFyfg"; // FOX Sports (@Foxsoccer)
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
const CACHE_MS = 5 * 60 * 1000;

let cache = { videoId: null, fetchedAt: 0 };

export default async (request, context) => {
  const response = await context.next();
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) return response;

  const videoId = await getLatestShortId();
  if (!videoId) return response;

  let html = await response.text();
  const thumbUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  html = html
    .replace(/(property="og:image" content=")[^"]*(")/, `$1${thumbUrl}$2`)
    .replace(/(name="twitter:image" content=")[^"]*(")/, `$1${thumbUrl}$2`)
    .replace(/(property="og:image:width" content=")[^"]*(")/, `$1480$2`)
    .replace(/(property="og:image:height" content=")[^"]*(")/, `$1360$2`);

  const headers = new Headers(response.headers);
  headers.delete("content-length");
  return new Response(html, { status: response.status, headers });
};

async function getLatestShortId() {
  const now = Date.now();
  if (cache.videoId && now - cache.fetchedAt < CACHE_MS) return cache.videoId;

  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) throw new Error(`feed responded ${res.status}`);

    const xml = await res.text();
    const entries = xml.split("<entry>").slice(1);

    for (const entry of entries) {
      const match = entry.match(/\/shorts\/([^"]+)"/);
      if (match) {
        cache = { videoId: match[1], fetchedAt: now };
        return match[1];
      }
    }
  } catch {
    // fall through to stale cache below
  }

  return cache.videoId;
}

export const config = { path: "/*" };
