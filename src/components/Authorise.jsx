import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Cookies from "universal-cookie";

import runtimeEnv from "@mars/heroku-js-runtime-env";

const env = runtimeEnv();
const cookies = new Cookies();

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
    const cookieExpiry = cookies.get("expires");
    const access_token = cookies.get("access_token");
    // const access_token = this.getCookie("access_token");

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
        new Date(new Date().setSeconds(hash.expires_in)),
        hash.expires_in
      );
    }
  }

  getCookie = (name) => {
    return document.cookie.split("; ").reduce((r, v) => {
      const parts = v.split("=");
      return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, "");
  };

  setCookie(name, value, expires, maxAge) {
    // document.cookie = name + "=" + value + "; expires=" + expires + " path=/;";
    cookies.set(name, value, { path: "/", expires: expires, maxAge: maxAge });
  }

  deleteCookie = (name) => {
    // document.cookie =
    //   name + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;";
    cookies.remove(name, {
      path: "/",
      expires: "Thu, 01 Jan 1970 00:00:01 GMT",
      maxAge: 0,
    });
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
