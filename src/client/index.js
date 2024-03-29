'use strict';

const { Component, h, render } = preact;

const {
  noteName,
  increment,
  decrement,
} = Music;

const INITIAL_STEPS = [0, 0, 0, 0, 0, 0, 0, 0];

const CHANGE_INC = 'CHANGE_INC';
const CHANGE_DEC = 'CHANGE_DEC';

function updateSteps(steps, index, action, mode) {
  return steps.map((step, i) => {
    if (i !== index) return step;

    return updateStep(step, action, mode);
  });
}

function updateStep(value, action, mode) {
  if (action === CHANGE_INC) return increment(value, mode);
  else if (action === CHANGE_DEC) return decrement(value, mode);
}

// TODO: combine with updateSteps() ?
function updateStepsFromServer(steps, index, value) {
  return steps.map((step, i) => {
    if (i !== index) return step;

    return value;
  });
}

class App extends Component {
  constructor(props) {
    super(props);

    this._onChangeStep = this._onChangeStep.bind(this);

    const socket = this.socket = io();

    socket.on('connect', () => {
      socket.emit('client:initialize');
    });

    socket.on('server:initialize', (state) => {
      this.setState({
        loaded: true,
        steps: state.steps,
        devices: state.devices,
        mode: state.mode,
      });
    });

    socket.on('server:state', (state) => {
      this.setState({
        loaded: true,
        steps: state.steps,
        devices: state.devices,
        mode: state.mode,
      });
    });

    socket.on('server:step:set', (data) => {
      const index = data.step;
      const value = data.value;
      this.setState({
        steps: updateStepsFromServer(this.state.steps, index, value)
      })
    });

    socket.on('server:devices', (devices) => {
      this.setState({ devices });
    });

    this.state = {
      loaded: false,
      steps: INITIAL_STEPS,
      devices: 0,
      mode: 'Chromatic',
    };
  }

  _onChangeStep(index, action) {
    const { steps, mode } = this.state;
    const oldValue = steps[index];
    const newSteps = updateSteps(steps, index, action, mode);
    const newValue = newSteps[index];

    if (newValue === oldValue) return;

    this.socket.emit('client:step:set', {
      step: index,
      value: newSteps[index]
    });
    this.setState({
      steps: newSteps
    });
  }

  render() {
    const { loaded, steps, devices } = this.state;
    if (loaded) {
      return (
        h('div', { className: 'App' },
          h(Header),
          h(Sequencer, { steps, onChangeStep: this._onChangeStep }),
          h(Footer, { devices })
        )
      );
    } else {
      return (
        h('div', { className: 'App' },
          h(LoadingScreen)
        )
      );

    }
  }
}

const Header = (props) => {
  return (
    h('div', { className: 'Header' },
      h('div', { className: 'Header-title' }, 'Community')
    )
  );
};

const Sequencer = (props) => {
  const { steps, onChangeStep } = props;
  return (
    h('div', { className: 'Sequencer' },
      (steps.map((step, index) => (
        h(Step, { step, index, onChangeStep })
      )))
    )
  );
};

const Step = (props) => {
  const { step, index, onChangeStep } = props;
  const name = noteName(step);
  return (
    h('div', { className: 'Step' },
      h(StepButton, { onClick: () => onChangeStep(index, CHANGE_INC) }, '+'),
      h('div', { className: 'Step-label' }, name),
      h(StepButton, { onClick: () => onChangeStep(index, CHANGE_DEC) }, '-')
    )
  );
};

const StepButton = (props) => {
  const { children, onClick } = props;
  return (
    h('div', { className: 'StepButton', onClick }, children)
  );
};

const LoadingScreen = (props) => {
  return (
    h('div', { className: 'LoadingScreen' },
      h('h1', null, 'Loading...')
    )
  );
};

const Footer = (props) => {
  const { devices } = props;
  return (
    h('div', { className: 'Footer' },
      h('div', { className: 'Footer-info' },
        'Devices connected: ',
        h('em', null, `${devices}`)
      ),
      h('div', { className: 'Footer-author' }, 'A crazy idea by Andrew Jensen')
    )
  );
}

render(h(App), document.body);
