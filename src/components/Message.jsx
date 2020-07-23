import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export const Message = (props) => {
  return (
    <Modal show={props.isPopAlert} onHide={props.toggleModal}>
      <Modal.Header>
        <Modal.Title>{props.errorMessage}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        '{props.searchParameter}' did not return any result.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={props.toggleModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Message;
