import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  const mobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>{mobile ? "EEE · BENGALURU" : "HELLO, WORLD."}</h2>
            <h1>deepAk</h1>
          </div>
          <div className="landing-info">
            <p className="landing-info-kicker">{mobile ? "NAVIGATING THE DARK" : "BUILT WITH CURIOSITY"}</p>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{mobile ? "ROBOTS THAT" : "I LOVE"}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{mobile ? "FIND THEIR WAY" : "BUILDING ROBOTS"}</div>
            </h2>
          </div>
        </div>
        <div className="mobile-hero-exit" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <i></i>
          <b>01 / ABOUT</b>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
