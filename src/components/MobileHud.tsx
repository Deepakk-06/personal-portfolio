import { useEffect, useState } from "react";
import { lenis } from "./Navbar";
import { config } from "../config";
import "./styles/MobileHud.css";

const LEVELS: [string, string][] = [
  ["HOME", "#landingDiv"],
  ["ABOUT", "#about"],
  ["WHAT I DO", ".what-box"],
  ["CAREER", ".career-section"],
  ["WORK", "#work"],
  ["STACK", ".techstack-new"],
  ["CONTACT", "#contact"],
];
const DOCK: [string, string][] = [
  ["HOME", "#landingDiv"],
  ["ABOUT", "#about"],
  ["WORK", "#work"],
  ["STACK", ".techstack-new"],
  ["CONTACT", "#contact"],
];
const DOCK_OF_LEVEL = [0, 1, 1, 1, 2, 3, 4];

const MobileHud = () => {
  const [active, setActive] = useState(0);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0);
      const mid = window.innerHeight * 0.45;
      let cur = 0;
      LEVELS.forEach(([, sel], i) => {
        const el = document.querySelector(sel);
        if (el && el.getBoundingClientRect().top <= mid) cur = i;
      });
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const go = (sel: string) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.2 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="mhud">
      <div className="mhud-level" aria-hidden="true">
        <span>
          LVL {String(active + 1).padStart(2, "0")} · {LEVELS[active][0]}
        </span>
        <i>
          <b style={{ width: pct + "%" }}></b>
        </i>
      </div>
      <nav className="mhud-dock" aria-label="Sections">
        {DOCK.map(([label, sel], i) => (
          <button key={label} className={DOCK_OF_LEVEL[active] === i ? "on" : ""} onClick={() => go(sel)} data-cursor="disable">
            {label}
          </button>
        ))}
        <a className="mhud-resume" href={config.contact.resume} target="_blank" rel="noopener noreferrer" data-cursor="disable">
          RESUME
        </a>
      </nav>
    </div>
  );
};

export default MobileHud;
