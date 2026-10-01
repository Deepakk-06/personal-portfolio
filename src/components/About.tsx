import "./styles/About.css";
import { config } from "../config";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{config.about.title}</h3>
        <p className="para">
          {config.about.description.split("Deepak").map((part, i, arr) => i < arr.length - 1 ? <span key={i}>{part}<strong style={{ display: "inline-block", padding: "0 0.12em", fontFamily: "inherit", letterSpacing: "0.06em", background: "linear-gradient(90deg, #d4ff00, #00f0ff, #ff2bd6)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent", WebkitTransform: "translateZ(0)", transform: "translateZ(0)", filter: "drop-shadow(0 0 6px rgba(0,240,255,0.9)) drop-shadow(0 0 18px rgba(255,43,214,0.7))" }}>deepAk</strong></span> : part)}
        </p>
      </div>
    </div>
  );
};

export default About;
