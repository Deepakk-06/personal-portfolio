// Vercel serverless function: what Deepak is listening to, via Last.fm (works with Spotify, Apple Music, YouTube Music scrobbling).
// Env vars (set in Vercel, never in the code): LASTFM_API_KEY, LASTFM_USER. Optional kill switch: NOW_PLAYING_OFF=1
// Also attaches a 30s preview clip (iTunes / Deezer search, no key needed) so visitors can tap the card to listen.

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

// ---- 30s preview lookup (Spotify no longer hands out preview clips to new apps, so use iTunes / Deezer) ----
const PREVIEW_HOSTS = ["mzstatic.com", "apple.com", "dzcdn.net", "deezer.com"];
const POS_TTL = 6 * 60 * 60 * 1000;
const NEG_TTL = 10 * 60 * 1000;
const previewCache = new Map();

export const clean = (v) =>
  String(v || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s*-\s*topic\b/g, " ")
    .replace(/\(.*?\)|\[.*?\]/g, " ")
    .replace(/\b(feat|ft|featuring)\b.*$/, " ")
    .replace(/\b(official|music|lyrical|lyric|full|video|audio|song|hd|4k|remastered)\b/g, " ")
    .replace(/[^\p{L}\p{N}\p{M}]+/gu, " ")
    .trim();

const titleMatches = (a, b) => {
  const x = clean(a);
  const y = clean(b);
  if (!x || !y) return false;
  if (x === y) return true;
  const [short, long] = x.length <= y.length ? [x, y] : [y, x];
  return short.length >= 5 && short.length / long.length >= 0.6 && long.includes(short);
};

const artistMatches = (a, b) => {
  const x = new Set(clean(a).split(" ").filter((w) => w.length > 2));
  return clean(b)
    .split(" ")
    .some((w) => w.length > 2 && x.has(w));
};

export const safePreview = (u) => {
  try {
    const url = new URL(u);
    if (url.protocol !== "https:") return "";
    const ok = PREVIEW_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith("." + h));
    return ok ? url.toString() : "";
  } catch {
    return "";
  }
};

const getJson = async (url, fetchImpl) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2500);
  try {
    const r = await fetchImpl(url, { headers: { "User-Agent": "deepxk-portfolio/1.0" }, signal: controller.signal });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

export const findPreview = async (artist, title, fetchImpl = fetch, now = Date.now()) => {
  const key = `${clean(artist)}|${clean(title)}`;
  if (!clean(title)) return "";
  const hit = previewCache.get(key);
  if (hit && hit.exp > now) return hit.url;

  const q = encodeURIComponent(`${clean(artist)} ${clean(title)}`.trim());
  const itunes = (country) =>
    getJson(`https://itunes.apple.com/search?term=${q}&media=music&entity=song&limit=8&country=${country}`, fetchImpl).then((d) =>
      (d?.results || []).map((r) => ({ title: r.trackName, artist: r.artistName, url: r.previewUrl })),
    );
  const deezer = () =>
    getJson(`https://api.deezer.com/search?q=${q}&limit=8`, fetchImpl).then((d) =>
      (d?.data || []).map((r) => ({ title: r.title, artist: r.artist?.name, url: r.preview })),
    );

  // sources in priority order, looked up in parallel
  const lists = await Promise.all([itunes("IN"), itunes("US"), deezer()].map((p) => p.catch(() => [])));
  let url = "";
  for (const list of lists) {
    const m = list.find((c) => c.url && titleMatches(c.title, title) && artistMatches(c.artist, artist) && safePreview(c.url));
    if (m) {
      url = safePreview(m.url);
      break;
    }
  }
  previewCache.set(key, { url, exp: now + (url ? POS_TTL : NEG_TTL) });
  if (previewCache.size > 200) previewCache.delete(previewCache.keys().next().value);
  return url;
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
    const picked = pickTrack(data?.recenttracks?.track);
    if (picked.state !== "none") {
      const preview = await findPreview(picked.artist, picked.title).catch(() => "");
      if (preview) picked.preview = preview;
    }
    return res.status(200).json(picked);
  } catch {
    return res.status(200).json({ state: "none" });
  }
}
