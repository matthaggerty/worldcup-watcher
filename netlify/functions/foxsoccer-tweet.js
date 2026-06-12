const SCREEN_NAME = "FOXSoccer";
const SYNDICATION_URL = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${SCREEN_NAME}?dnt=true&showReplies=false&limit=5&lang=en`;

let cache = { data: null, fetchedAt: 0 };
const CACHE_MS = 15 * 60 * 1000;

export default async function handler() {
  const now = Date.now();
  if (cache.data && now - cache.fetchedAt < CACHE_MS) {
    return jsonResponse(cache.data);
  }

  try {
    const res = await fetch(SYNDICATION_URL, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) throw new Error(`syndication responded ${res.status}`);

    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
    if (!match) throw new Error("could not find __NEXT_DATA__");

    const data = JSON.parse(match[1]);
    const entries = data?.props?.pageProps?.timeline?.entries || [];
    const tweets = entries
      .map((e) => e?.content?.tweet)
      .filter((t) => t && t.id_str && t.full_text);

    if (tweets.length === 0) throw new Error("no tweets found");

    const latest = tweets.reduce((a, b) =>
      new Date(a.created_at) > new Date(b.created_at) ? a : b
    );

    const media = latest.extended_entities?.media || latest.entities?.media || [];
    const photo = media.find((m) => m.type === "photo");
    const video = media.find((m) => m.type === "video" || m.type === "animated_gif");
    const videoThumb = video?.media_url_https;

    let text = latest.full_text;
    for (const m of media) {
      if (m.url) text = text.replace(m.url, "").trim();
    }

    const result = {
      text,
      url: `https://x.com/${SCREEN_NAME}/status/${latest.id_str}`,
      createdAt: latest.created_at,
      image: photo?.media_url_https || videoThumb || null,
      isVideo: !!video,
    };

    cache = { data: result, fetchedAt: now };
    return jsonResponse(result);
  } catch (err) {
    if (cache.data) return jsonResponse(cache.data);
    return jsonResponse({ error: err.message }, 502);
  }
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=900, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
