import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Authorise from "./Authorise";
import SearchInput from "./SearchInput";
import Song from "./Song";
import AlbumInfo from "./AlbumInfo";
import Loading from "./Loading";
import Footer from "./Footer";

import "../styles/index.css";

class Spotify extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      artist: "",
      artistId: "",
      token: "",
      tracks: [],
      album: "",
      requesting: false,
      done: false,
      docTitle: "",
    };

    this.searchHandler = this.searchHandler.bind(this);
    this.songChangeHandler = this.songChangeHandler.bind(this);
  }

  searchHandler = (event, inputElement) => {
    const searchArtist = inputElement.value;

    if (searchArtist !== "") {
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `https://api.spotify.com/v1/search?q=${inputElement.value}&type=artist`,
        true
      );
      xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
      this.setState({
        requesting: true,
      });

      xhr.onload = function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.artists.items.length > 0) {
              this.getArtistName(searchArtist, response.artists.items);
              this.searchAlbums();
            }
          } else {
            this.setState({
              errorMessage: xhr.statusText,
              requesting: false,
              done: true,
            });
            console.error(xhr.statusText);
          }
        }
      }.bind(this);
      xhr.onerror = function (e) {
        console.error(xhr.statusText);
      };
      xhr.send(null);
      this.setState({
        requesting: false,
        done: true,
      });
    }

    inputElement.focus();
    inputElement.value = "";
    event.preventDefault();
  };

  searchAlbums = () => {
    if (this.state.artistId !== "") {
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `https://api.spotify.com/v1/artists/${this.state.artistId}/top-tracks?country=US`,
        true
      );
      xhr.setRequestHeader("Authorization", "Bearer " + this.state.token);
      this.setState({
        requesting: true,
      });

      xhr.onload = function (e) {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            this.setState({
              tracks: response.tracks,
              album: response.tracks[0],
              done: true,
              requesting: false,
            });
          } else {
            this.setState({
              errorMessage: xhr.statusText,
              requesting: false,
              done: true,
            });
            console.error(xhr.statusText);
          }
        }
      }.bind(this);
      xhr.onerror = function (e) {
        console.error(xhr.statusText);
      };
      xhr.send(null);
    }
  };

  getArtistName = (searchArtist, items) => {
    const filteredItems = items.filter(
      (x) => x.name.toLowerCase() === searchArtist
    );

    let artistName = "",
      artistId = "";

    if (filteredItems.length > 0) {
      artistName = filteredItems[0].name;
      artistId = filteredItems[0].id;
    } else if (items.length > 0) {
      artistName = items[0].name;
      artistId = items[0].id;
    }

    this.setState({
      artist: artistName,
      artistId: artistId,
      docTitle: `Top 10 Tracks of ${artistName}`,
    });

    document.title = `${this.state.docTitle} | Spotify`;
  };

  songChangeHandler = (cardElement, album) => {
    this.setState({ album: album });
  };

  onTokenGenerated = (token) => {
    this.setState({ token: token });
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
