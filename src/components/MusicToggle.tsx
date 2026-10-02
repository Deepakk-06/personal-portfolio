import { useEffect, useRef, useState } from "react";
import "./MusicToggle.css";

const MusicToggle = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // The card's song preview pauses the theme (and vice versa).
  useEffect(() => {
    const onOther = (e: Event) => {
      if ((e as CustomEvent).detail === "preview") {
        audioRef.current?.pause();
        setPlaying(false);
      }
    };
    window.addEventListener("site-audio", onOther);
    return () => window.removeEventListener("site-audio", onOther);
  }, []);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      setPlaying(false);
    } else {
      try {
        a.volume = 0.4;
        window.dispatchEvent(new CustomEvent("site-audio", { detail: "theme" }));
        await a.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/theme.mp3" loop preload="none" />
      <button className={`music-toggle ${playing ? "on" : ""}`} onClick={toggle} aria-label="Toggle music" data-cursor="disable">
        <span className="music-bars"><i /><i /><i /><i /></span>
        <span>&gt; SOUND: {playing ? "ON" : "OFF"}</span>
      </button>
    </>
  );
};

export default MusicToggle;
