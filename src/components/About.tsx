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
        <div className="about-mobile">
          <div className="about-chain" aria-hidden="true">
            {config.about.chain.map((word, i) => (
              <span key={word} style={{ animationDelay: `${0.3 + i * 0.28}s` }}>{word}</span>
            ))}
          </div>
          <h4 className="about-pull">
            {config.about.pull.split(", ")[0]},
            <br />
            <em>{config.about.pull.split(", ")[1]}</em>
          </h4>
          <p className="about-body">{config.about.mobileDescription}</p>
        </div>
        <ul className="about-facts">
          {config.about.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default About;
