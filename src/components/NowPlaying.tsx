import { useEffect, useState } from "react";
import "./styles/NowPlaying.css";

type Track = {
  state: "playing" | "last" | "none";
  title?: string;
  artist?: string;
  url?: string;
  image?: string;
  playedAt?: number;
};

const POLL_MS = 30000;

const ago = (uts: number) => {
  const s = Math.max(0, Math.floor(Date.now() / 1000) - uts);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
};

const NowPlaying = () => {
  const [track, setTrack] = useState<Track | null>(null);

  useEffect(() => {
    let alive = true;
    let timer: number | undefined;

    const load = async () => {
      try {
        const res = await fetch("/api/now-playing");
        if (!res.ok) throw new Error("bad response");
        const data = (await res.json()) as Track;
        if (alive) setTrack(data);
      } catch {
        if (alive) setTrack(null);
      }
    };

    const loop = () => {
      if (!document.hidden) load();
      timer = window.setTimeout(loop, POLL_MS);
    };
    const onVisible = () => {
      if (!document.hidden) load();
    };

    load();
    timer = window.setTimeout(loop, POLL_MS);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  if (!track || track.state === "none" || !track.title) return null;
  const live = track.state === "playing";

  return (
    <a
      className={`now-playing ${live ? "is-live" : ""}`}
      href={track.url || undefined}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="disable"
      aria-label={`${live ? "Deepak is listening to" : "Deepak last played"} ${track.title} by ${track.artist}`}
    >
      <span className="np-cover">
        {track.image ? <img src={track.image} alt="" loading="lazy" decoding="async" /> : <span className="np-cover-empty">♪</span>}
      </span>
      <span className="np-text">
        <span className="np-label">
          {live ? (
            <>
              <span className="np-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              DEEPAK IS LISTENING TO
            </>
          ) : (
            <>LAST PLAYED{track.playedAt ? ` · ${ago(track.playedAt)}` : ""}</>
          )}
        </span>
        <span className="np-title">{track.title}</span>
        <span className="np-artist">{track.artist}</span>
      </span>
    </a>
  );
};

export default NowPlaying;
