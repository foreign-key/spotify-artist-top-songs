import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import runtimeEnv from "@mars/heroku-js-runtime-env";
import * as $ from "jquery";

const env = runtimeEnv();

export const authEndpoint = "https://accounts.spotify.com/authorize";

const clientId = env.REACT_APP_CLIENTID;
const redirectUri = env.REACT_APP_REDIRECT_URI;
const scopes = ["user-read-currently-playing", "user-read-playback-state"];

// Get the hash of the url
const hash = window.location.hash
  .substring(1)
  .split("&")
  .reduce(function (initial, item) {
    if (item) {
      var parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
    }
    return initial;
  }, {});
window.location.hash = "";

class Authorise extends Component {
  constructor() {
    super();
    this.state = {
      token: null,
      item: {
        album: {
          images: [{ url: "" }],
        },
        name: "",
        artists: [{ name: "" }],
        duration_ms: 0,
      },
      is_playing: "Paused",
      progress_ms: 0,
    };

    this.getCurrentlyPlaying = this.getCurrentlyPlaying.bind(this);
  }

  getCurrentlyPlaying(token) {
    // Make a call using the token
    $.ajax({
      url: "https://api.spotify.com/v1/me/player",
      type: "GET",
      beforeSend: (xhr) => {
        xhr.setRequestHeader("Authorization", "Bearer " + token);
      },
      success: (data) => {
        this.setState({
          item: data.item,
          is_playing: data.is_playing,
          progress_ms: data.progress_ms,
        });
      },
    });
  }

  componentDidMount() {
    // Set token
    let _token = hash.access_token;
    if (_token) {
      // Set token
      this.setState(
        {
          token: _token,
        },
        this.props.onTokenGenerated(_token)
      );
    }
  }

  render() {
    return (
      <div className="authorise">
        <Container fluid>
          {!this.state.token && (
            <Button
              size="lg"
              block
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </Button>
          )}
        </Container>
      </div>
    );
  }
}
export default Authorise;
