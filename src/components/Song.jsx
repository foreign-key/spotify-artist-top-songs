import React, { Component } from "react";
import Card from "react-bootstrap/Card";

import "../styles/Song.css";

class Song extends Component {
  render() {
    let songs = null;

    if (this.props.artistTracks) {
      songs = (
        <React.Fragment>
          {this.props.artistTracks.map((info, index) => {
            return (
              <Card
                key={index}
                onClick={(event) => this.props.songChangeHandler(info, event)}
                body
              >
                {index + 1} | {info.name}
              </Card>
            );
          })}
        </React.Fragment>
      );
    }

    return <React.Fragment>{songs}</React.Fragment>;
  }
}

export default Song;
