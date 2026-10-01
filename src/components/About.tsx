import "./styles/About.css";
import { config } from "../config";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">{config.about.title}</h3>
        <p className="para">
          {config.about.description.split("Deepak").map((part, i, arr) => i < arr.length - 1 ? <span key={i}>{part}deepAk</span> : part)}
        </p>
      </div>
    </div>
  );
};

export default About;
