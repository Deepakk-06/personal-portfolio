import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>HELLO, WORLD.</h2>
            <h1>deepAk</h1>
          </div>
          <div className="landing-info">
            <p className="landing-info-kicker">BUILT WITH CURIOSITY</p>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">I LOVE</div>
            </h2>
            <h2>
              <div className="landing-h2-info">BUILDING ROBOTS</div>
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
