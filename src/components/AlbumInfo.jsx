import React, { Component } from "react";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "../styles/AlbumInfo.css";

class AlbumInfo extends Component {
  render() {
    return (
      <React.Fragment>
        {this.props.info && (
          <Row>
            <Col>
              <Image
                src={this.props.info.album.images[0].url}
                rounded
                className="img-fluid img-thumbnail"
              />

              <div className="album-info">
                <h3>{this.props.info.name}</h3>
                <h4>{this.props.info.album.name}</h4>
                <h5>
                  {this.props.info.album.artists[0].name} |{" "}
                  {new Date(
                    this.props.info.album.release_date
                  ).toLocaleDateString()}
                </h5>
              </div>
            </Col>
          </Row>
        )}
      </React.Fragment>
    );
  }
}

export default AlbumInfo;
