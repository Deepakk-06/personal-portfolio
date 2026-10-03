import { useEffect, useRef } from "react";
import "./styles/About.css";
import { config } from "../config";

const About = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(max-width: 767px)").matches) return undefined;
    el.classList.add("m-armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("m-in");
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="about-section" id="about" ref={ref}>
      <div className="about-me">
        <h3 className="title">{config.about.title}</h3>
        <p className="para">
          {config.about.description.split("Deepak").map((part, i, arr) => i < arr.length - 1 ? <span key={i}>{part}deepAk</span> : part)}
        </p>
        <p className="para-short">
          {config.about.shortDescription.split("Deepak").map((part, i, arr) => i < arr.length - 1 ? <span key={i}>{part}deepAk</span> : part)}
        </p>
      </div>
    </div>
  );
};

export default About;
