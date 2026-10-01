import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const nameParts = config.developer.fullName.split(" ");
  const firstName = nameParts[0] || config.developer.name;
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {firstName.toUpperCase()}
              {' '}
              <br />
              {lastName && <span>{lastName.toUpperCase()}</span>}
            </h1>
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
