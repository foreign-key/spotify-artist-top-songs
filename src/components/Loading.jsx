import React from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import * as SoundWaves from "../soundWaves.json";
import * as SuccessRequest from "../success.json";

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: SoundWaves.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

const defaultOptions2 = {
  loop: false,
  autoplay: true,
  animationData: SuccessRequest.default,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      requesting: false,
      done: false,
    };
  }

  render() {
    return (
      <div>
        <FadeIn>
          <div className="d-flex justify-content-center align-items-center">
            {this.props.requesting ? (
              <React.Fragment>
                <h2>Processing request...</h2>
                <Lottie options={defaultOptions} height={350} width={350} />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <h2>Completed</h2>
                <Lottie options={defaultOptions2} height={350} width={350} />
              </React.Fragment>
            )}
          </div>
        </FadeIn>
      </div>
    );
  }
}

export default Loading;
