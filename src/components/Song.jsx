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
                onClick={(event) =>
                  this.props.songChangeHandler(this._cardElement, info)
                }
                ref={(card) => (this._cardElement = card)}
                body
              >
                {info.name}
              </Card>
            );
          })}
        </React.Fragment>
      );
    }

    return <div>{songs}</div>;
  }
}

export default Song;
