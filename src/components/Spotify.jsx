import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import AlbumInfo from "./AlbumInfo";
import Authorise from "./Authorise";
import Footer from "./Footer";
import Loading from "./Loading";
import Message from "./Message";
import SearchInput from "./SearchInput";
import Song from "./Song";
import runtimeEnv from "@mars/heroku-js-runtime-env";

import "../styles/Footer.css";

const env = runtimeEnv();
let LastSelectedSong = null;

class Spotify extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      album: "",
      artist: "",
      artistId: "",
      docTitle: "",
      done: false,
      errorMessage: "",
      isPopAlert: false,
      requesting: false,
      token: "",
      tracks: [],
    };

    this.searchHandler = this.searchHandler.bind(this);
    this.songChangeHandler = this.songChangeHandler.bind(this);
  }

  processRequest = (requestUrl, done) => {
    var xhr = new XMLHttpRequest();
    this.setState({ requesting: true });
    setTimeout(() => {
      xhr.open("GET", requestUrl, true);
      xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
      this.setState({
        requesting: true,
      });

      xhr.onload = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            done(null, JSON.parse(xhr.responseText));
          }
        }
      };

      xhr.onerror = () => {
        done(xhr.response);
      };

      xhr.send();
    }, 700);
  };

  searchHandler = (event, inputElement) => {
    const searchArtist = inputElement.value.trim();

    if (searchArtist !== "") {
      this.processRequest(
        `https://api.spotify.com/v1/search?q=${inputElement.value}&type=artist`,
        (err, response) => {
          if (err) {
            this.setState({
              errorMessage: err,
              requesting: false,
              done: true,
            });
          }

          if (response.artists.items.length > 0) {
            this.getArtistName(searchArtist, response.artists.items);
            this.searchAlbums();
          } else {
            this.invalidSearch(searchArtist);
          }
        }
      );
    }

    inputElement.focus();
    inputElement.value = "";
    event.preventDefault();
  };

  searchAlbums = () => {
    if (this.state.artistId !== "") {
      this.processRequest(
        `https://api.spotify.com/v1/artists/${this.state.artistId}/top-tracks?country=US`,
        (err, response) => {
          if (err) {
            this.setState({
              done: true,
              errorMessage: err,
              requesting: false,
            });
          }

          this.setState({
            album: response.tracks[0],
            done: true,
            requesting: false,
            tracks: response.tracks,
          });
          document.title = `${this.state.docTitle} | Spotify`;
        }
      );
    }
  };

  invalidSearch = (searchArtist) => {
    this.setState({
      album: "",
      artist: searchArtist,
      artistId: "",
      docTitle: "",
      done: true,
      errorMessage: "Not Found",
      isPopAlert: true,
      requesting: false,
      tracks: [],
    });
    document.title = env.REACT_APP_NAME;
  };

  getArtistName = (searchArtist, items) => {
    const unorm = require("unorm");

    const filteredItems = items.filter(
      (x) =>
        unorm
          .nfkd(x.name)
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase() === searchArtist && x.images.length > 0
    );

    if (filteredItems.length > 0) {
      this.setState({
        artist: filteredItems[0].name,
        artistId: filteredItems[0].id,
        docTitle: `Top 10 Tracks of ${filteredItems[0].name}`,
      });
    } else {
      this.invalidSearch(searchArtist);
    }
  };

  songChangeHandler = (album, event) => {
    if (LastSelectedSong) {
      LastSelectedSong.classList.remove("active");
    }

    LastSelectedSong = event.target;
    event.target.classList.add("active");
    this.setState({ album: album });
  };

  onTokenGenerated = (token) => {
    this.setState({ token: token });
  };

  toggleModal = () => {
    this.setState({ isPopAlert: false });
  };

  render() {
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col xs={1} s={2} md={3} lg={4} />
            <Col xs={10} s={8} md={6} lg={4}>
              <Authorise onTokenGenerated={this.onTokenGenerated} />
            </Col>
            <Col xs={1} s={2} md={3} lg={4} />
          </Row>

          {this.state.token && (
            <div className="albumMain">
              <Row>
                <Col />
                <Col
                  xs={{ span: 8 }}
                  md={{ span: 6 }}
                  lg={{ span: 4 }}
                  xl={{ span: 4 }}
                >
                  <SearchInput searchHandler={this.searchHandler} />
                </Col>
                <Col />
              </Row>
              {this.state.tracks && (
                <React.Fragment>
                  {this.state.requesting ? (
                    <Row>
                      <Col xs={1} s={2} md={2} lg={3} />
                      <Col xs={10} s={8} md={8} lg={6}>
                        <Loading {...this.state} />
                      </Col>
                      <Col xs={1} s={2} md={2} lg={3} />
                    </Row>
                  ) : (
                    <React.Fragment>
                      {this.state.isPopAlert && (
                        <Message
                          searchParameter={this.state.artist}
                          errorMessage={this.state.errorMessage}
                          isPopAlert={this.state.isPopAlert}
                          toggleModal={this.toggleModal}
                        />
                      )}
                      <Row>
                        {this.state.artist && (
                          <div className="album-header">
                            <Col xs>
                              <h1>{this.state.docTitle}</h1>
                            </Col>
                          </div>
                        )}
                      </Row>
                      <Row>
                        <Col md={6}>
                          <AlbumInfo info={this.state.album} />
                        </Col>
                        <Col md={{ span: 5, offset: 1 }}>
                          <Song
                            songChangeHandler={this.songChangeHandler}
                            artistTracks={this.state.tracks}
                          />
                        </Col>
                      </Row>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </div>
          )}
        </Container>
        <Footer />
      </React.Fragment>
    );
  }
}

export default Spotify;
