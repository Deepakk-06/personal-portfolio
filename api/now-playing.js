// Vercel serverless function: what Deepak is listening to, via Last.fm (works with Spotify, Apple Music, YouTube Music scrobbling).
// Env vars (set in Vercel, never in the code): LASTFM_API_KEY, LASTFM_USER. Optional kill switch: NOW_PLAYING_OFF=1

const API = "https://ws.audioscrobbler.com/2.0/";
const PLACEHOLDER = "2a96cbd8b46e442fc41c2b86b821562f"; // Last.fm's "no cover" star image
const MAX_AGE_SECONDS = 3 * 24 * 60 * 60; // hide "last played" after 3 days

const AD_EXACT = /^(spotify|ad|ads|advert|advertisement|spotify advertisement|spotify ad)$/i;
const AD_WORDS = /\b(advertisement|advertising|sponsored)\b/i;

const text = (v) => (v && typeof v === "object" ? v["#text"] : v) || "";

// Spotify ads must never show up on the site.
export const isAd = (track) => {
  const title = String(track?.name || "").trim();
  const artist = String(text(track?.artist)).trim();
  if (!title || !artist) return true;
  return AD_EXACT.test(title) || AD_EXACT.test(artist) || AD_WORDS.test(title) || AD_WORDS.test(artist);
};

const coverOf = (track) => {
  const images = Array.isArray(track?.image) ? track.image : [];
  for (let i = images.length - 1; i >= 0; i--) {
    const url = text(images[i]);
    if (url && !url.includes(PLACEHOLDER)) return url.replace(/^http:\/\//, "https://");
  }
  return "";
};

export const pickTrack = (recent, nowSeconds = Math.floor(Date.now() / 1000)) => {
  const list = (Array.isArray(recent) ? recent : recent ? [recent] : []).filter((t) => !isAd(t));
  const shape = (t, state) => ({
    state,
    title: t.name,
    artist: text(t.artist),
    album: text(t.album),
    url: t.url || "",
    image: coverOf(t),
    playedAt: t.date?.uts ? Number(t.date.uts) : undefined,
  });

  const live = list.find((t) => t?.["@attr"]?.nowplaying === "true");
  if (live) return shape(live, "playing");

  const last = list.find((t) => t?.date?.uts);
  if (last && nowSeconds - Number(last.date.uts) <= MAX_AGE_SECONDS) return shape(last, "last");

  return { state: "none" };
};

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "public, s-maxage=20, stale-while-revalidate=40");
  const key = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USER;
  if (req.method !== "GET" || !key || !user || process.env.NOW_PLAYING_OFF === "1") {
    return res.status(200).json({ state: "none" });
  }

  try {
    const url = `${API}?method=user.getrecenttracks&user=${encodeURIComponent(user)}&api_key=${encodeURIComponent(key)}&format=json&limit=6`;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(url, {
      headers: { "User-Agent": "deepxk-portfolio/1.0 (now-playing widget)" },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) return res.status(200).json({ state: "none" });
    const data = await response.json();
    return res.status(200).json(pickTrack(data?.recenttracks?.track));
  } catch {
    return res.status(200).json({ state: "none" });
  }
}
