'use strict';

const { Component, h, render } = preact;

const MODES = [
  'Chromatic',
  'Major',
  'Minor',
  'Pentatonic',
];
const INITIAL_MODE = 'Chromatic';

class AdminApp extends Component {
  constructor(props) {
    super(props);

    this._onChangeMode = this._onChangeMode.bind(this);

    const socket = this.socket = io();

    socket.on('connect', () => {
      socket.emit('admin:initialize');
    });

    socket.on('server:initialize', (state) => {
      this.setState({
        loaded: true,
        steps: state.steps,
        devices: state.devices,
      });
    });

    // socket.on('server:step:set', (data) => {
    //   const index = data.step;
    //   const value = data.value;
    //   this.setState({
    //     steps: updateStepsFromServer(this.state.steps, index, value)
    //   })
    // });

    socket.on('server:devices', (devices) => {
      this.setState({ devices });
    });

    this.state = {
      loaded: false,
      devices: 0,
      modes: MODES,
      selectedMode: INITIAL_MODE,
    };
  }

  _onChangeMode(mode) {
    console.log('_onChangeMode', mode);
    this.setState({ selectedMode: mode });
  }

  render() {
    const {
      loaded,
      steps,
      devices,
      modes,
      selectedMode,
    } = this.state;
    if (loaded) {
      return (
        h('div', { className: 'AdminApp' },
          h(ModeMenu, { modes, selectedMode, onChangeMode: this._onChangeMode }),
          h(Counter, { devices })
        )
      );
    } else {
      return (
        h('div', { className: 'AdminApp' },
          h('div', null, 'Loading...')
        )
      );

    }
  }
}

const ModeMenu = (props) => {
  const { modes, selectedMode, onChangeMode } = props;
  return (
    h('div', { className: 'ModeMenu' },
      (modes.map(mode => (
        h(ModeButton, {
          active: (mode === selectedMode),
          onClick: () => onChangeMode(mode),
        }, mode)
      )))
    )
  );
};

const ModeButton = (props) => {
  const { children, active, onClick } = props;
  const className = (active ? 'ModeButton active' : 'ModeButton');
  return (
    h('div', { className, onClick }, children)
  );
};

const Counter = (props) => {
  const { devices } = props;
  return (
    h('div', { className: 'Counter' },
      h('div', null,
        'Devices connected: ',
        h('em', null, `${devices}`)
      )
    )
  );
};


render(h(AdminApp), document.body);
