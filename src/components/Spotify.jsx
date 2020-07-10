import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Authorise from "./Authorise";
import SearchInput from "./SearchInput";
import Song from "./Song";
import AlbumInfo from "./AlbumInfo";
import Loading from "./Loading";

import "../styles/index.css";

class Spotify extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      artist: "",
      token: "",
      tracks: [],
      album: "",
      requesting: false,
      done: false,
    };

    this.searchHandler = this.searchHandler.bind(this);
    this.songChangeHandler = this.songChangeHandler.bind(this);
  }

  searchHandler = (event, inputElement) => {
    if (inputElement.value !== "") {
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
              this.searchAlbums(response.artists.items[0].id);
              document.title = `${response.artists.items[0].name}'s Top Tracks | Spotify`;
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

  searchAlbums = (artistId) => {
    if (artistId !== "") {
      var xhr = new XMLHttpRequest();
      xhr.open(
        "GET",
        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`,
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
              artist: response.tracks[0].album.artists[0].name,
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

  songChangeHandler = (cardElement, album) => {
    this.setState({ album: album });
  };

  onTokenGenerated = (token) => {
    this.setState({ token: token });
  };

  render() {
    return (
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
              <Row>
                {this.state.requesting ? (
                  <React.Fragment>
                    <Col xs={1} s={2} md={2} lg={3} />
                    <Col xs={10} s={8} md={8} lg={6}>
                      <Loading {...this.state} />
                    </Col>
                    <Col xs={1} s={2} md={2} lg={3} />
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <Col md={6}>
                      <AlbumInfo info={this.state.album} />
                    </Col>
                    <Col md={{ span: 5, offset: 1 }}>
                      <Song
                        songChangeHandler={this.songChangeHandler}
                        artistTracks={this.state.tracks}
                      />
                    </Col>
                  </React.Fragment>
                )}
              </Row>
            )}
          </div>
        )}
      </Container>
    );
  }
}

export default Spotify;
