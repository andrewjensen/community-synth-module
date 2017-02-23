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
        selectedMode: state.mode,
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

    socket.on('server:ack', () => {
      this.setState({ lastAck: (new Date()) });
    });

    this.state = {
      loaded: false,
      devices: 0,
      modes: MODES,
      selectedMode: INITIAL_MODE,
      lastAck: null,
    };
  }

  _onChangeMode(mode) {
    console.log('_onChangeMode', mode);
    this.setState({ selectedMode: mode });
    this.socket.emit('admin:mode:set', { mode });
  }

  render() {
    const {
      loaded,
      steps,
      devices,
      modes,
      selectedMode,
      lastAck,
    } = this.state;
    if (loaded) {
      return (
        h('div', { className: 'AdminApp' },
          h(ModeMenu, { modes, selectedMode, onChangeMode: this._onChangeMode }),
          h(Counter, { devices }),
          h(Heartbeat, { lastAck })
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

class Heartbeat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      secondsAgo: 0
    };
  }

  componentDidMount() {
    this.clockInterval = setInterval(() => this.updateClock(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.clockInterval);
  }

  updateClock() {
    // console.log('updateClock');
    const { lastAck } = this.props;
    if (!lastAck) return;

    const now = new Date();
    this.setState({
      secondsAgo: Math.floor((now - lastAck) / 1000)
    });
  }

  render(props, state) {
    const { lastAck } = props;
    const { secondsAgo } = state;

    const errorState = (!lastAck || secondsAgo > 10);
    const message = (lastAck ? `${secondsAgo}sec ago` : 'Never');

    return (
      h('div', { className: 'Heartbeat' },
        h('div', { className: 'Heartbeat-message' },
          'Last ACK: ',
          h('em', null, message)
        ),
        (errorState ? (
          h('div', { className: 'Heartbeat-error' }, '!')
        ) : null)
      )
    );
  }
}


render(h(AdminApp), document.body);
