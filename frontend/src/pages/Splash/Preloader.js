import React, { useEffect } from "react";
import "./Preloader.css";
import logo from "./code-crafters-logo.png";
import { preLoaderAnim } from "./SplashAnime";

const PreLoader = ({ onAnimationEnd }) => {
  useEffect(() => {
    preLoaderAnim().then(() => {
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    });
  }, [onAnimationEnd]);

  return (
    <div className="preloader">
      <div className="content-container">
        <div className="logo-container">
          <img src={logo} alt="Code_Crafters_logo" className="logo"/>
        </div>
        <div className="texts-container">
          <span>IoT-DIRfram</span>
        </div>
      </div>
    </div>
  );
};

export default PreLoader;
