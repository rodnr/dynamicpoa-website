import React, { Component } from 'react';
import Lottie from 'react-lottie';
import animationData from '../lotties/lf20_xRmNN8.json';

class LottieProgramming extends Component {
  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return (
      <div>
        <Lottie options={defaultOptions} height={450} width={450} />
      </div>
    );
  }
}

export default LottieProgramming;
