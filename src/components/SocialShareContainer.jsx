import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SocialShareContainer extends Component {
  static defineNetworks() {
    return {
      vk: {
        name: 'vk',
        label: 'Поделиться Вконтакте',
      },
      facebook: {
        name: 'facebook',
        label: 'Поделиться в Facebook',
      },
      twitter: {
        name: 'twitter',
        label: 'Поделиться в Twitter',
      },
      pinterest: {
        name: 'pinterest',
        label: 'Опубликовать в Pinterest',
      },
      email: {
        name: 'email',
        label: 'Отправить по почте',
      },
    };
  }

  static calculateWindowPosition(windowDimension, popUpDimension) {
    return Math.round(windowDimension / 2 - popUpDimension / 2);
  }

  static windowSettings() {
    const windowSettings = {
      popUpWidth: 840,
      popUpHeight: 420,
      popUpLeft: 0,
      popUpTop: 0,
      height: window.innerHeight,
      width: window.innerWidth,
    };

    windowSettings.popUpLeft = SocialShareContainer.calculateWindowPosition(
      windowSettings.width,
      windowSettings.popUpWidth,
    );

    windowSettings.popUpTop =
      windowSettings.height > windowSettings.popUpHeight
        ? SocialShareContainer.calculateWindowPosition(
            windowSettings.height,
            windowSettings.popUpHeight,
          )
        : 0;

    windowSettings.windowOptions = 'toolbar=no,menubar=no,location=yes,resizable=no,scrollbars=yes';

    windowSettings.windowSize =
      `width=${windowSettings.popUpWidth},` +
      `height=${windowSettings.popUpHeight},` +
      `top=${windowSettings.popUpTop},` +
      `left=${windowSettings.popUpLeft}`;

    return windowSettings;
  }

  static openWindow(event) {
    const { windowOptions, windowSize } = SocialShareContainer.windowSettings();
    const isFacebook = event.currentTarget.dataset.network === 'facebook';
    const isReddit = event.currentTarget.dataset.network === 'reddit';
    const isTwitter = event.currentTarget.dataset.network === 'twitter';
    /* eslint no-underscore-dangle: ["error", { "allow": ["__twttr"] }] */
    const hasTwitterWidgets =
      typeof window !== 'undefined' &&
      typeof window.__twttr !== 'undefined' &&
      window.__twttr.widgets &&
      window.__twttr.widgets.init;
    const shouldOpenWindow = isFacebook || isReddit || (isTwitter && !hasTwitterWidgets);

    if (shouldOpenWindow) {
      window.open(event.currentTarget.href, 'share', `${windowOptions},${windowSize}`);

      event.preventDefault();
    }
  }

  constructor() {
    super();

    this.getData = this.getData.bind(this);
    this.networksToShow = this.networksToShow.bind(this);
  }

  getData() {
    const text = encodeURIComponent(this.props.text);
    const url = encodeURIComponent(this.props.url);
    const { via } = this.props;
    const data = SocialShareContainer.defineNetworks();

    data.facebook.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    data.twitter.href = `https://twitter.com/intent/tweet?text=${text}&url=${url}&via=${via}`;
    data.vk.href = `https://vk.com/share.php?url=${url}`;
    data.pinterest.href = `http://pinterest.com/pin/create/link/?url=${url}`;
    data.email.href = `mailto:?subject=${text}&body=${url}`;

    return data;
  }

  networksToShow() {
    const hiddenNetworks = this.props.hide;
    const networkData = this.getData();

    if (hiddenNetworks && hiddenNetworks.length) {
      for (let i = 0; i < hiddenNetworks.length; i += 1) {
        const { name } = networkData[hiddenNetworks[i]];

        delete networkData[name];
      }
    }

    return networkData;
  }

  render() {
    return React.createElement(this.props.children, {
      networks: this.networksToShow(),
      onClick: SocialShareContainer.openWindow,
      ...this.props,
    });
  }
}

SocialShareContainer.propTypes = {
  children: PropTypes.func.isRequired,
  url: PropTypes.string.isRequired,
  text: PropTypes.string,
  hide: PropTypes.arrayOf(PropTypes.oneOf(Object.keys(SocialShareContainer.defineNetworks()))),
  via: PropTypes.string,
};

SocialShareContainer.defaultProps = {
  text: '',
  hide: null,
  via: 'act_as_samurai',
};

export default SocialShareContainer;
