import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

import runtimeEnv from "@mars/heroku-js-runtime-env";

const env = runtimeEnv();

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
  constructor(props) {
    super(props);
    this.state = { isSessionValid: false };
  }

  componentDidMount() {
    const access_token = this.getCookie("access_token");
    const cookieExpiry = this.getCookie("expires");

    if (access_token === "") {
      this.setState({ isSessionValid: false });
    }

    if (
      access_token !== "" &&
      cookieExpiry !== "" &&
      Date.parse(new Date().toUTCString()) <= Date.parse(cookieExpiry)
    ) {
      this.props.onAccountAuthorised(true);
      this.setState({ isSessionValid: true });
    } else if (hash.access_token) {
      this.setState({ isSessionValid: true });
      this.props.onAccountAuthorised(true);
      this.setCookie(
        "access_token",
        hash.access_token,
        new Date(new Date().setSeconds(hash.expires_in))
      );
    }
  }

  getCookie = (name) => {
    return document.cookie.split("; ").reduce((r, v) => {
      const parts = v.split("=");
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, "");
  };

  setCookie(name, value, expires) {
    this.deleteCookie(name);
    document.cookie = `${name}=${value}; `;
    document.cookie = `expires=${expires.toUTCString()};`;
  }

  deleteCookie = (name) => {
    document.cookie = `${name}=;`;
    document.cookie = `expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };

  render() {
    return (
      <div className="authorise">
        <Container fluid>
          {!this.state.isSessionValid && (
            <Button
              className="btn-authorise"
              size="lg"
              block
              href={`https://accounts.spotify.com/authorize?client_id=${env.REACT_APP_CLIENTID}&redirect_uri=${env.REACT_APP_REDIRECT_URI}&response_type=token&show_dialog=true`}
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
