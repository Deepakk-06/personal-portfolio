import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { MdArrowOutward, MdPause, MdPlayArrow } from "react-icons/md";
import "./styles/NowPlaying.css";

type Track = {
  state: "playing" | "last" | "none";
  title?: string;
  artist?: string;
  url?: string;
  image?: string;
  playedAt?: number;
  preview?: string;
};

const POLL_MS = 30000;
const AUDIO_EVENT = "site-audio";

const ago = (uts: number) => {
  const s = Math.max(0, Math.floor(Date.now() / 1000) - uts);
  if (s < 3600) return `${Math.max(1, Math.round(s / 60))}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
};

const NowPlaying = () => {
  const [track, setTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const previewUrl = track?.preview || "";
  const preview = previewUrl && !failed ? previewUrl : "";

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

  // A new song means a new clip: stop and reset.
  useEffect(() => {
    audioRef.current?.pause();
    setPlaying(false);
    setProgress(0);
    setFailed(false);
  }, [previewUrl]);

  // If the theme music starts, the preview steps aside.
  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail === "theme") audioRef.current?.pause();
    };
    window.addEventListener(AUDIO_EVENT, onOther);
    return () => window.removeEventListener(AUDIO_EVENT, onOther);
  }, []);

  if (!track || track.state === "none" || !track.title) return null;
  const live = track.state === "playing";

  const onMain = () => {
    const a = audioRef.current;
    if (!preview || !a) {
      if (track.url) window.open(track.url, "_blank", "noopener,noreferrer");
      return;
    }
    if (!a.paused) {
      a.pause();
      return;
    }
    window.dispatchEvent(new CustomEvent(AUDIO_EVENT, { detail: "preview" }));
    a.volume = 0.7;
    a.play().catch((err: unknown) => {
      // A quick pause before the clip starts rejects with AbortError; that is not a broken clip.
      if ((err as Error)?.name === "NotSupportedError") setFailed(true);
    });
  };

  const who = live ? "Deepak is listening to" : "Deepak last played";
  const action = preview ? (playing ? "Pause preview" : "Play 30 second preview") : "Open track";

  return (
    <div
      className={`now-playing ${live ? "is-live" : ""} ${playing ? "is-previewing" : ""}`}
      style={{ "--np-progress": `${Math.round(progress * 100)}%` } as CSSProperties}
    >
      <button type="button" className="np-main" onClick={onMain} data-cursor="disable" aria-label={`${who} ${track.title} by ${track.artist}. ${action}`}>
        <span className="np-cover">
          {track.image ? <img src={track.image} alt="" loading="lazy" decoding="async" /> : !preview && <span className="np-cover-empty">♪</span>}
          {preview && <span className="np-play">{playing ? <MdPause /> : <MdPlayArrow />}</span>}
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
          {preview && <span className="np-hint">{playing ? "PLAYING · TAP TO PAUSE" : "TAP TO PLAY 30S PREVIEW"}</span>}
        </span>
      </button>
      {preview && track.url && (
        <a className="np-open" href={track.url} target="_blank" rel="noopener noreferrer" data-cursor="disable" aria-label="Open this track">
          <MdArrowOutward />
        </a>
      )}
      {preview && (
        <audio
          ref={audioRef}
          src={preview}
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => {
            setPlaying(false);
            setProgress(0);
          }}
          onTimeUpdate={(e) => {
            const a = e.currentTarget;
            setProgress(a.duration ? a.currentTime / a.duration : 0);
          }}
          onError={() => {
            setFailed(true);
            setPlaying(false);
          }}
        />
      )}
      <span className="np-progress" aria-hidden="true" />
    </div>
  );
};

export default NowPlaying;
