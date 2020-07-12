import React, { Component } from "react";
import Button from "react-bootstrap/Button";

import "../styles/Song.css";

class Song extends Component {
  constructor(props) {
    super(props);
    this.songRefs = [];
  }

  componentDidMount() {
    this.songRefs[0] && this.songRefs[0].click();
  }

  render() {
    let songs = null;

    if (this.props.artistTracks) {
      songs = (
        <React.Fragment>
          {this.props.artistTracks.map((info, index) => {
            return (
              <Button
                key={index}
                variant="outline-warning"
                className="text-left"
                onClick={(event) => this.props.songChangeHandler(info, event)}
                ref={(ref) => (this.songRefs[index] = ref)}
              >
                {index + 1} | {info.name}
              </Button>
            );
          })}
        </React.Fragment>
      );
    }

    return <React.Fragment>{songs}</React.Fragment>;
  }
}

export default Song;
