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
import { removeAccents } from "../helpers/Helpers";
import { queryArtist, queryTracks } from "../helpers/RequestHandlers";
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
      isAuthorised: false,
      isPopAlert: false,
      requesting: false,
      tracks: [],
    };

    this.searchHandler = this.searchHandler.bind(this);
    this.songChangeHandler = this.songChangeHandler.bind(this);
  }

  searchHandler = (event, inputElement) => {
    const searchArtist = inputElement.value.trim().toLowerCase();

    if (searchArtist !== "") {
      this.setState({ requesting: true });
      setTimeout(() => {
        queryArtist(searchArtist)
          .then((data) => {
            if (data.artists.items.length > 0) {
              this.getArtistName(searchArtist, data.artists.items);
              this.searchAlbums();
            } else {
              this.invalidSearch(searchArtist);
            }
          })
          .catch((err) => {
            this.setState({
              errorMessage: err.statusText,
              requesting: false,
              done: true,
            });
          });
      }, 500);
    }

    inputElement.focus();
    inputElement.value = "";
    event.preventDefault();
  };

  searchAlbums = () => {
    if (this.state.artistId !== "") {
      this.setState({ requesting: true });
      setTimeout(() => {
        queryTracks(this.state.artistId)
          .then((data) => {
            this.setState({
              album: data.tracks[0],
              done: true,
              requesting: false,
              tracks: data.tracks,
            });
            document.title = `${this.state.docTitle} | Spotify`;
          })
          .catch((err) => {
            this.setState({
              errorMessage: err.statusText,
              requesting: false,
              done: true,
            });
          });
      }, 500);
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
    const filteredItems = items.filter(
      (x) =>
        removeAccents(x.name).toLowerCase() === searchArtist &&
        x.images.length > 0
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

  toggleModal = () => {
    this.setState({ isPopAlert: false });
  };

  onAccountAuthorised = (isAuthorised) =>
    this.setState({ isAuthorised: isAuthorised });

  render() {
    return (
      <React.Fragment>
        <Container>
          <Row>
            <Col xs={1} s={2} md={3} lg={4} />
            <Col xs={10} s={8} md={6} lg={4}>
              <Authorise onAccountAuthorised={this.onAccountAuthorised} />
            </Col>
            <Col xs={1} s={2} md={3} lg={4} />
          </Row>

          {this.state.isAuthorised && (
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
