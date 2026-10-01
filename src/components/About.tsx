import "./styles/About.css";
import { config } from "../config";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{config.about.title}</h3>
        <p className="para">
          {config.about.description.split("Deepak").map((part, i, arr) => i < arr.length - 1 ? <span key={i}>{part}<strong style={{ fontFamily: "inherit", letterSpacing: "0.06em", background: "linear-gradient(90deg, #d4ff00, #00f0ff, #ff2bd6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", filter: "drop-shadow(0 0 8px rgba(0,240,255,0.5))" }}>deepAk</strong></span> : part)}
        </p>
      </div>
    </div>
  );
};

export default About;
