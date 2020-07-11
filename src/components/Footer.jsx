import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import runtimeEnv from "@mars/heroku-js-runtime-env";

import "../styles/Footer.css";

const env = runtimeEnv();

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <Container>
          <Row>
            <Col xs={12} md={12} lg={12} xl={12}>
              <h6>{env.REACT_APP_NAME} © 2020</h6>

              <div className="social-container">
                <a href={env.REACT_APP_FOOTER_GITHUB} className="github social">
                  <FontAwesomeIcon icon={faGithub} size="2x" />
                </a>
                <a
                  href={env.REACT_APP_FOOTER_LINKEDIN}
                  className="linkedin social"
                >
                  <FontAwesomeIcon icon={faLinkedin} size="2x" />
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Footer;
