import React, { Component } from 'react';
import animationData from '../lotties/lottie_hero_section.json';

class LottieHero extends Component {
  state = { Lottie: null };

  componentDidMount() {
    import('react-lottie').then((mod) => this.setState({ Lottie: mod.default }));
  }

  render() {
    const { Lottie } = this.state;

    if (!Lottie) {
      return <div />;
    }

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
        <Lottie options={defaultOptions} />
      </div>
    );
  }
}

export default LottieHero;
