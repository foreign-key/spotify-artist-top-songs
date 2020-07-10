import React from "react";
import ReactDOM from "react-dom";
import Spotify from "./components/Spotify";
import "./styles/index.css";

ReactDOM.render(
  <React.Fragment>
    <Spotify />
  </React.Fragment>,
  document.getElementById("spotifyMain")
);
