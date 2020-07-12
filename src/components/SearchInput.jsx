import React, { Component } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "../styles/SearchInput.css";

class SearchInput extends Component {
  render() {
    return (
      <div>
        <Row>
          <Col>
            <form
              onSubmit={(event) =>
                this.props.searchHandler(event, this._inputElement)
              }
            >
              <div className="searchInput">
                <span className="fa fa-search search-feedback"></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for an Artist"
                  ref={(search) => (this._inputElement = search)}
                />
              </div>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SearchInput;
