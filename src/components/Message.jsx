import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

class Message extends Component {
  render() {
    return (
      <Modal
        show={this.props.isPopAlert}
        searchParameter={this.props.searchParameter}
        errorMessage={this.props.errorMessage}
        onHide={this.props.toggleModal}
      >
        <Modal.Header>
          <Modal.Title>{this.props.errorMessage}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          '{this.props.searchParameter}' did not return any result.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.props.toggleModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default Message;
