import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";

import "../styles/Footer.css";

const FooterIcon = (props) => {
  return (
    <a href={props.link} className={`${props.classname} social`}>
      <FontAwesomeIcon icon={props.faicon} size="2x" />
    </a>
  );
};

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <Container>
          <Row>
            <Col xs={12} md={12} lg={12} xl={12}>
              <h6>{process.env.REACT_APP_NAME} © 2020</h6>

              <div className="social-container">
                <FooterIcon
                  link={process.env.REACT_APP_FOOTER_GITHUB}
                  classname="github"
                  faicon={faGithub}
                />
                <FooterIcon
                  link={process.env.REACT_APP_FOOTER_LINKEDIN}
                  classname="linkedin"
                  faicon={faLinkedin}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Footer;
